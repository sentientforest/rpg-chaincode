import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { SpellData, UpdateSpellDataDto } from "../types";

export async function updateSpellData(ctx: GalaChainContext, dto: UpdateSpellDataDto): Promise<void> {
  // Get the existing spell data
  const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [dto.name]);
  const existingSpell = await getObjectByKey(ctx, SpellData, spellKey);

  // Update fields that are provided
  const updates: Partial<SpellData> = {};

  if (dto.level !== undefined) updates.level = dto.level;
  if (dto.traditions !== undefined) updates.traditions = dto.traditions;
  if (dto.castingTime !== undefined) updates.castingTime = dto.castingTime;
  if (dto.components !== undefined) updates.components = dto.components;
  if (dto.range !== undefined) updates.range = dto.range;
  if (dto.area !== undefined) updates.area = dto.area;
  if (dto.duration !== undefined) updates.duration = dto.duration;
  if (dto.traits !== undefined) updates.traits = dto.traits;
  if (dto.description !== undefined) updates.description = dto.description;
  if (dto.heightening !== undefined) updates.heightening = dto.heightening;
  if (dto.rarity !== undefined) updates.rarity = dto.rarity;

  // Create updated spell data
  const updatedSpell = await createValidChainObject(SpellData, {
    ...existingSpell,
    ...updates
  });

  // Save to chain
  await putChainObject(ctx, updatedSpell);
}
