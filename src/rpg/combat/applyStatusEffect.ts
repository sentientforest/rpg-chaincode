import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { ApplyStatusEffectDto, CharacterEntity, CharacterEvent, StatusEffect } from "../types";

export async function applyStatusEffect(ctx: GalaChainContext, dto: ApplyStatusEffectDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Create status effect
  const statusEffect = await createValidChainObject(StatusEffect, {
    characterName: dto.characterName,
    effectId: dto.effectId,
    effectName: dto.effectName,
    effectType: dto.effectType,
    intensity: dto.intensity,
    duration: dto.duration,
    remainingDuration: dto.duration, // Initially same as duration
    source: dto.source,
    sourceId: dto.sourceId,
    description: dto.description,
    isActive: true,
    isHidden: dto.isHidden || false,
    endCondition: dto.endCondition,
    saveDC: dto.saveDC,
    saveType: dto.saveType,
    appliedAt: currentTime,
    encounterId: dto.encounterId
  });

  // 3. Create event for status effect application
  const effectEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "status_effect_applied",
    description: `Applied ${dto.effectName}${dto.intensity ? ` ${dto.intensity}` : ""} effect`,
    eventData: {
      effectName: dto.effectName,
      effectType: dto.effectType,
      intensity: dto.intensity,
      duration: dto.duration,
      source: dto.source
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 4. Save status effect and event
  await putChainObject(ctx, statusEffect);
  await putChainObject(ctx, effectEvent);
}
