import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import { BackgroundData, CreateBackgroundDataDto } from "../types";

export async function createBackgroundData(
  ctx: GalaChainContext,
  dto: CreateBackgroundDataDto
): Promise<void> {
  // Create the background data object
  const backgroundData = await createValidChainObject(BackgroundData, {
    name: dto.name,
    description: dto.description,
    attributeBoosts: dto.attributeBoosts,
    trainedSkill: dto.trainedSkill,
    loreSkill: dto.loreSkill,
    skillFeat: dto.skillFeat,
    category: dto.category
  });
  
  // Save to chain
  await putChainObject(ctx, backgroundData);
}