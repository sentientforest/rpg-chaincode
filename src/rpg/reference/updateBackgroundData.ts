import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { BackgroundData, UpdateBackgroundDataDto } from "../types";

export async function updateBackgroundData(
  ctx: GalaChainContext,
  dto: UpdateBackgroundDataDto
): Promise<void> {
  // Get the existing background data
  const backgroundKey = BackgroundData.getCompositeKeyFromParts(BackgroundData.INDEX_KEY, [dto.name]);
  const existingBackground = await getObjectByKey(ctx, BackgroundData, backgroundKey);

  // Update fields that are provided
  const updates: Partial<BackgroundData> = {};

  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.attributeBoosts !== undefined) updates.attributeBoosts = dto.attributeBoosts;
  if (dto.trainedSkill !== undefined) updates.trainedSkill = dto.trainedSkill;
  if (dto.loreSkill !== undefined) updates.loreSkill = dto.loreSkill;
  if (dto.skillFeat !== undefined) updates.skillFeat = dto.skillFeat;
  if (dto.category !== undefined) updates.category = dto.category;

  // Create updated background data
  const updatedBackground = await createValidChainObject(BackgroundData, {
    ...existingBackground,
    ...updates
  });

  // Save to chain
  await putChainObject(ctx, updatedBackground);
}
