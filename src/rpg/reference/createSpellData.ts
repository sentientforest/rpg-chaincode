import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import { CreateSpellDataDto, SpellData } from "../types";

export async function createSpellData(
  ctx: GalaChainContext,
  dto: CreateSpellDataDto
): Promise<void> {
  // Create the spell data object
  const spellData = await createValidChainObject(SpellData, {
    name: dto.name,
    level: dto.level,
    traditions: dto.traditions,
    castingTime: dto.castingTime,
    components: dto.components,
    range: dto.range,
    area: dto.area,
    duration: dto.duration,
    traits: dto.traits,
    description: dto.description,
    heightening: dto.heightening,
    rarity: dto.rarity
  });
  
  // Save to chain
  await putChainObject(ctx, spellData);
}