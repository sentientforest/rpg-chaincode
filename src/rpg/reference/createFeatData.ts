import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import { CreateFeatDataDto, FeatData } from "../types";

export async function createFeatData(ctx: GalaChainContext, dto: CreateFeatDataDto): Promise<void> {
  // Create the feat data object
  const featData = await createValidChainObject(FeatData, {
    name: dto.name,
    type: dto.type,
    level: dto.level,
    prerequisites: dto.prerequisites,
    description: dto.description,
    traits: dto.traits,
    frequency: dto.frequency,
    actions: dto.actions
  });

  // Save to chain
  await putChainObject(ctx, featData);
}
