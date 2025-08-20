import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { SkillData, UpdateSkillDataDto } from "../types";

export async function updateSkillData(
  ctx: GalaChainContext,
  dto: UpdateSkillDataDto
): Promise<void> {
  // Get the existing skill data
  const skillKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [dto.name]);
  const existingSkill = await getObjectByKey(ctx, SkillData, skillKey);
  
  // Update fields that are provided
  const updates: Partial<SkillData> = {};
  
  if (dto.keyAttribute !== undefined) updates.keyAttribute = dto.keyAttribute;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.trainedActions !== undefined) updates.trainedActions = dto.trainedActions;
  if (dto.hasArmorCheckPenalty !== undefined) updates.hasArmorCheckPenalty = dto.hasArmorCheckPenalty;
  
  // Create updated skill data
  const updatedSkill = await createValidChainObject(SkillData, {
    ...existingSkill,
    ...updates
  });
  
  // Save to chain
  await putChainObject(ctx, updatedSkill);
}