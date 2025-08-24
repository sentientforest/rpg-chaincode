import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CharacterEntity, CharacterEvent, CraftingProject } from "../types";

export interface StartCraftingProjectDto {
  characterName: string;
  projectId: string;
  itemName: string;
  itemType: string;
  itemLevel: number;
  craftingSkill: string;
  targetDC: number;
  totalCost: number;
  materialsNeeded: string[];
  formula?: string;
}

export async function startCraftingProject(
  ctx: GalaChainContext,
  dto: StartCraftingProjectDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Validate crafting parameters
  if (dto.itemLevel < 0 || dto.itemLevel > 20) {
    throw new Error("Item level must be between 0 and 20");
  }

  if (dto.totalCost <= 0) {
    throw new Error("Total cost must be positive");
  }

  if (dto.targetDC < 10 || dto.targetDC > 50) {
    throw new Error("Target DC must be between 10 and 50");
  }

  // 3. Create crafting project
  const craftingProject = await createValidChainObject(CraftingProject, {
    characterName: dto.characterName,
    projectId: dto.projectId,
    itemName: dto.itemName,
    itemType: dto.itemType,
    itemLevel: dto.itemLevel,
    craftingSkill: dto.craftingSkill,
    targetDC: dto.targetDC,
    totalCost: dto.totalCost,
    progressMade: 0,
    materialsUsed: [],
    materialsNeeded: dto.materialsNeeded,
    daysWorked: 0,
    isCompleted: false,
    isCriticalSuccess: false,
    formula: dto.formula,
    startedAt: currentTime
  });

  // 4. Create event for project start
  const craftingEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "crafting_started",
    description: `Started crafting ${dto.itemName} (${dto.itemType}, level ${dto.itemLevel})`,
    eventData: {
      projectId: dto.projectId,
      itemName: dto.itemName,
      itemType: dto.itemType,
      itemLevel: dto.itemLevel,
      craftingSkill: dto.craftingSkill,
      totalCost: dto.totalCost
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 5. Save project and event
  await putChainObject(ctx, craftingProject);
  await putChainObject(ctx, craftingEvent);
}

export interface AdvanceCraftingDto {
  characterName: string;
  projectId: string;
  daysWorked: number;
  materialsUsed: string[];
  skillCheckResult: number;
  randomSeed: string;
}

export async function advanceCrafting(ctx: GalaChainContext, dto: AdvanceCraftingDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Get existing crafting project
  const projectKey = CraftingProject.getCompositeKeyFromParts(CraftingProject.INDEX_KEY, [
    dto.characterName,
    dto.projectId
  ]);
  const project = await getObjectByKey(ctx, CraftingProject, projectKey);

  if (project.isCompleted) {
    throw new Error("Project is already completed");
  }

  // 2. Determine progress based on skill check
  let progressAmount = 0;
  const isSuccess = dto.skillCheckResult >= project.targetDC;
  const isCriticalSuccess = dto.skillCheckResult >= project.targetDC + 10;
  let complications: string | undefined;

  if (isCriticalSuccess) {
    // Critical success: make significant progress
    progressAmount = Math.min(project.totalCost * 0.5, project.totalCost - project.progressMade);
  } else if (isSuccess) {
    // Success: normal progress
    progressAmount = Math.min(project.totalCost * 0.25, project.totalCost - project.progressMade);
  } else if (dto.skillCheckResult <= project.targetDC - 10) {
    // Critical failure: no progress and complication
    progressAmount = 0;
    complications = "Critical failure during crafting - materials damaged";
  } else {
    // Failure: minimal progress
    progressAmount = Math.min(project.totalCost * 0.1, project.totalCost - project.progressMade);
  }

  const newProgress = project.progressMade + progressAmount;
  const newDaysWorked = project.daysWorked + dto.daysWorked;
  const newMaterialsUsed = [...project.materialsUsed, ...dto.materialsUsed];

  // 3. Check if project is completed
  const isCompleted = newProgress >= project.totalCost;

  // 4. Update crafting project
  const updatedProject = await createValidChainObject(CraftingProject, {
    ...project,
    progressMade: newProgress,
    materialsUsed: newMaterialsUsed,
    daysWorked: newDaysWorked,
    isCompleted: isCompleted,
    isCriticalSuccess: isCriticalSuccess && isCompleted,
    complications: complications,
    completedAt: isCompleted ? currentTime : undefined
  });

  // 5. Create progress event
  const progressEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: isCompleted ? "crafting_completed" : "crafting_progress",
    description: isCompleted
      ? `Completed crafting ${project.itemName}${isCriticalSuccess ? " with exceptional quality" : ""}`
      : `Made progress on ${project.itemName} (${Math.round((newProgress / project.totalCost) * 100)}% complete)`,
    eventData: {
      projectId: dto.projectId,
      progressAmount: progressAmount,
      totalProgress: newProgress,
      daysWorked: dto.daysWorked,
      skillCheckResult: dto.skillCheckResult,
      isCompleted: isCompleted,
      isCriticalSuccess: isCriticalSuccess,
      complications: complications
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 6. Save updated project and event
  await putChainObject(ctx, updatedProject);
  await putChainObject(ctx, progressEvent);
}
