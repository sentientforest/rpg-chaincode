import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import { CreateSkillDataDto, SkillData } from "../types";

export async function createSkillData(
  ctx: GalaChainContext,
  dto: CreateSkillDataDto
): Promise<void> {
  // Create the skill data object
  const skillData = await createValidChainObject(SkillData, {
    name: dto.name,
    keyAttribute: dto.keyAttribute,
    description: dto.description,
    trainedActions: dto.trainedActions,
    hasArmorCheckPenalty: dto.hasArmorCheckPenalty
  });
  
  // Save to chain
  await putChainObject(ctx, skillData);
}