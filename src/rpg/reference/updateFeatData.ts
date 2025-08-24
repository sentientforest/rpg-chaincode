import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { FeatData, UpdateFeatDataDto } from "../types";

export async function updateFeatData(ctx: GalaChainContext, dto: UpdateFeatDataDto): Promise<void> {
  // Get the existing feat data
  const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [dto.name]);
  const existingFeat = await getObjectByKey(ctx, FeatData, featKey);

  // Update fields that are provided
  const updates: Partial<FeatData> = {};

  if (dto.level !== undefined) updates.level = dto.level;
  if (dto.prerequisites !== undefined) updates.prerequisites = dto.prerequisites;
  if (dto.traits !== undefined) updates.traits = dto.traits;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.frequency !== undefined) updates.frequency = dto.frequency;
  if (dto.actions !== undefined) updates.actions = dto.actions;
  if (dto.type !== undefined) updates.type = dto.type;

  // Create updated feat data
  const updatedFeat = await createValidChainObject(FeatData, {
    ...existingFeat,
    ...updates
  });

  // Save to chain
  await putChainObject(ctx, updatedFeat);
}
