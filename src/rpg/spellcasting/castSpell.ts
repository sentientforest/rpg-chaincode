import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";

import {
  CastSpellDto,
  CastSpellAction,
  CharacterEntity,
  CharacterSpell,
  SpellSlot,
  SpellData,
  EncounterAction
} from "../types";
import { DiceUtils } from "../utils/DiceUtils";

export async function castSpell(
  ctx: GalaChainContext,
  dto: CastSpellDto
): Promise<CastSpellAction> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(
    CharacterEntity.INDEX_KEY,
    [dto.characterName, ctx.callingUser]
  );
  await getObjectByKey(ctx, CharacterEntity, characterKey);
  
  // 2. Verify character knows the spell
  const characterSpells = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterSpell.INDEX_KEY,
    [dto.characterName],
    CharacterSpell
  );
  
  const knownSpell = characterSpells.find(spell => 
    spell.spellName === dto.spellName && 
    spell.tradition === dto.tradition
  );
  
  if (!knownSpell) {
    throw new Error(`Character does not know spell ${dto.spellName} in ${dto.tradition} tradition`);
  }
  
  // 3. Verify spell exists in reference data
  const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [dto.spellName]);
  const spellData = await getObjectByKey(ctx, SpellData, spellKey);
  
  // 4. Validate casting level
  if (dto.castAtLevel < spellData.level) {
    throw new Error(`Cannot cast ${dto.spellName} at level ${dto.castAtLevel}, minimum level is ${spellData.level}`);
  }
  
  // 5. Handle spell slot consumption for prepared/spontaneous casters
  let spellSlotUsed: number | undefined;
  if (dto.castingSource === "prepared" || dto.castingSource === "spontaneous") {
    if (dto.spellSlotUsed === undefined) {
      throw new Error("Must specify spell slot for prepared/spontaneous casting");
    }
    
    // Get the spell slot
    const slotKey = SpellSlot.getCompositeKeyFromParts(
      SpellSlot.INDEX_KEY,
      [dto.characterName, dto.castAtLevel, dto.spellSlotUsed]
    );
    
    try {
      const spellSlot = await getObjectByKey(ctx, SpellSlot, slotKey);
      
      if (spellSlot.isUsed) {
        throw new Error(`Spell slot ${dto.castAtLevel}-${dto.spellSlotUsed} is already used`);
      }
      
      if (spellSlot.tradition !== dto.tradition) {
        throw new Error(`Spell slot tradition ${spellSlot.tradition} does not match spell tradition ${dto.tradition}`);
      }
      
      // Mark spell slot as used
      const updatedSlot = await createValidChainObject(SpellSlot, {
        ...spellSlot,
        isUsed: true,
        lastUsed: currentTime
      });
      
      await putChainObject(ctx, updatedSlot);
      spellSlotUsed = dto.spellSlotUsed;
      
    } catch (error) {
      throw new Error(`Invalid or unavailable spell slot: ${error}`);
    }
  }
  
  // 6. Perform any dice rolls for the spell (simplified)
  let diceRolls: number[] | undefined;
  let outcome: string | undefined;
  let damageDealt: number | undefined;
  let healingDone: number | undefined;
  
  if (dto.randomSeed) {
    // Example: if spell has attack roll or damage
    if (spellData.description && spellData.description.includes("attack")) {
      const attackRoll = DiceUtils.executeRoll("1d20", dto.randomSeed);
      diceRolls = attackRoll.individualRolls;
      outcome = "rolled"; // Simplified - would need target AC for real outcome
    }
    
    // Example damage/healing (simplified)
    if (spellData.description && spellData.description.includes("damage")) {
      const damageRoll = DiceUtils.executeRoll(`${dto.castAtLevel}d6`, dto.randomSeed + "_damage");
      damageDealt = damageRoll.total;
    }
    
    if (spellData.description && spellData.description.includes("heal")) {
      const healingRoll = DiceUtils.executeRoll(`${dto.castAtLevel}d8`, dto.randomSeed + "_healing");
      healingDone = healingRoll.total;
    }
  }
  
  // 7. Create cast spell action record
  const castAction = await createValidChainObject(CastSpellAction, {
    characterName: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    spellName: dto.spellName,
    tradition: dto.tradition,
    castAtLevel: dto.castAtLevel,
    castingSource: dto.castingSource,
    encounterId: dto.encounterId,
    targets: dto.targets,
    diceRolls,
    outcome,
    damageDealt,
    healingDone,
    appliedConditions: [], // Would be determined by spell effects
    spellSlotUsed,
    wasCounterspelled: false,
    performedAt: currentTime
  });
  
  // 8. If cast during encounter, also create encounter action
  if (dto.encounterId) {
    const encounterAction = await createValidChainObject(EncounterAction, {
      encounterId: dto.encounterId,
      timestamp: paddedTime,
      txId: txId + "_encounter",
      actingParticipant: dto.characterName,
      actionType: "spell",
      description: `Cast ${dto.spellName} at level ${dto.castAtLevel}`,
      targetParticipant: dto.targets ? dto.targets[0] : undefined,
      diceRolls,
      totalResult: diceRolls ? diceRolls.reduce((sum, roll) => sum + roll, 0) : undefined,
      outcome,
      actionData: {
        spellName: dto.spellName,
        tradition: dto.tradition,
        castAtLevel: dto.castAtLevel,
        damageDealt,
        healingDone
      },
      performedAt: currentTime
    });
    
    await putChainObject(ctx, encounterAction);
  }
  
  // 9. Save cast spell action
  await putChainObject(ctx, castAction);
  
  return castAction;
}