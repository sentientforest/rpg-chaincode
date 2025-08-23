import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { AddSpellDto, CharacterEntity, CharacterEvent, CharacterSpell, SpellData } from "../types";

export async function addSpell(ctx: GalaChainContext, dto: AddSpellDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Verify spell exists in reference data
  const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [dto.spellName]);
  const spellData = await getObjectByKey(ctx, SpellData, spellKey);

  // 3. Validate spell tradition matches
  if (!spellData.traditions.includes(dto.tradition)) {
    throw new Error(`Spell ${dto.spellName} is not available in ${dto.tradition} tradition`);
  }

  // 4. Validate spell level matches
  if (spellData.level !== dto.spellLevel) {
    throw new Error(`Spell ${dto.spellName} is level ${spellData.level}, not ${dto.spellLevel}`);
  }

  // 5. Create character spell
  const characterSpell = await createValidChainObject(CharacterSpell, {
    entity: dto.characterName,
    spellName: dto.spellName,
    tradition: dto.tradition,
    spellLevel: dto.spellLevel,
    castingType: dto.castingType,
    source: dto.source,
    gainedAtLevel: dto.gainedAtLevel
  });

  // 6. Create spell addition event
  const spellEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "spell_added",
    description: `Added ${dto.tradition} spell: ${dto.spellName}`,
    eventData: {
      spellName: dto.spellName,
      tradition: dto.tradition,
      spellLevel: dto.spellLevel,
      castingType: dto.castingType,
      source: dto.source
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 7. Save to chain
  await putChainObject(ctx, characterSpell);
  await putChainObject(ctx, spellEvent);
}
