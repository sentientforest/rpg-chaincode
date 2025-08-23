import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";

import {
  CharacterEntity,
  CharacterClass,
  CharacterProgression,
  CharacterEvent,
  ClassData
} from "../types";

export interface AddCharacterClassDto {
  characterName: string;
  className: string;
  isPrimary?: boolean;
  archetype?: string;
  dedication?: string;
  spellcastingTradition?: string;
  keyAbility?: string;
}

export async function addCharacterClass(
  ctx: GalaChainContext,
  dto: AddCharacterClassDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(
    CharacterEntity.INDEX_KEY,
    [dto.characterName, ctx.callingUser]
  );
  await getObjectByKey(ctx, CharacterEntity, characterKey);
  
  // 2. Verify class exists in reference data
  const classKey = ClassData.getCompositeKeyFromParts(ClassData.INDEX_KEY, [dto.className]);
  await getObjectByKey(ctx, ClassData, classKey);
  
  // 3. Get character progression to determine current level
  const progressionKey = CharacterProgression.getCompositeKeyFromParts(
    CharacterProgression.INDEX_KEY,
    [dto.characterName]
  );
  const progression = await getObjectByKey(ctx, CharacterProgression, progressionKey);
  
  // 4. Check if character already has this class
  const existingClasses = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterClass.INDEX_KEY,
    [dto.characterName],
    CharacterClass
  );
  
  const existingClass = existingClasses.find(cc => cc.className === dto.className);
  
  if (existingClass) {
    throw new Error(`Character already has levels in ${dto.className}`);
  }
  
  // 5. Validate multiclass rules (simplified)
  const totalClasses = existingClasses.length;
  
  if (totalClasses > 0 && !dto.dedication) {
    throw new Error("Multiclassing requires a dedication feat");
  }
  
  // For first class or if explicitly marked as primary
  const isPrimary = totalClasses === 0 || dto.isPrimary === true;
  
  // 6. Create character class entry
  const characterClass = await createValidChainObject(CharacterClass, {
    characterName: dto.characterName,
    className: dto.className,
    classLevel: 1, // Starting at level 1 in new class
    isPrimary: isPrimary,
    archetype: dto.archetype,
    dedication: dto.dedication,
    gainedAtLevel: progression.level,
    spellcastingTradition: dto.spellcastingTradition,
    keyAbility: dto.keyAbility,
    lastUpdated: currentTime
  });
  
  // 7. Create event for class addition
  const classEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: isPrimary ? "class_selected" : "multiclass_added",
    description: `${isPrimary ? "Selected" : "Added multiclass"} ${dto.className}${dto.archetype ? ` (${dto.archetype})` : ""}`,
    eventData: {
      className: dto.className,
      isPrimary: isPrimary,
      archetype: dto.archetype,
      dedication: dto.dedication,
      gainedAtLevel: progression.level
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });
  
  // 8. Save class and event
  await putChainObject(ctx, characterClass);
  await putChainObject(ctx, classEvent);
}