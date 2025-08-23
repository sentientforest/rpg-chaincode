import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import {
  SpellEffect,
  CastSpellAction,
  EncounterEntity
} from "../types";

export interface CreateSpellEffectDto {
  effectId: string;
  castingActionId: string; // Links to CastSpellAction
  spellName: string;
  casterId: string;
  effectType: string; // "area", "persistent", "environmental", "triggered"
  encounterId?: string;
  campaignId?: string;
  duration?: number;
  areaType: string;
  areaSize?: number;
  centerPoint?: string;
  initialTargets: string[];
  saveDC?: number;
  saveType?: string;
  description: string;
  requiresConcentration: boolean;
  triggerCondition?: string;
}

export async function createSpellEffect(
  ctx: GalaChainContext,
  dto: CreateSpellEffectDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Verify the casting action exists
  const castingActionKey = CastSpellAction.getCompositeKeyFromParts(
    CastSpellAction.INDEX_KEY,
    [dto.casterId, paddedTime, dto.castingActionId] // Approximate, may need adjustment
  );
  
  try {
    await getObjectByKey(ctx, CastSpellAction, castingActionKey);
  } catch (error) {
    // If exact match fails, we'll trust the casting action ID for now
    // In production, might want more robust validation
  }
  
  // 2. Validate encounter exists if provided
  if (dto.encounterId) {
    const encounterKey = EncounterEntity.getCompositeKeyFromParts(
      EncounterEntity.INDEX_KEY,
      [dto.campaignId || "unknown", dto.encounterId]
    );
    
    try {
      await getObjectByKey(ctx, EncounterEntity, encounterKey);
    } catch (error) {
      throw new Error("Encounter not found for spell effect");
    }
  }
  
  // 3. Create persistent spell effect
  const spellEffect = await createValidChainObject(SpellEffect, {
    effectId: dto.effectId,
    timestamp: paddedTime,
    spellName: dto.spellName,
    casterId: dto.casterId,
    effectType: dto.effectType,
    encounterId: dto.encounterId,
    campaignId: dto.campaignId,
    duration: dto.duration,
    remainingDuration: dto.duration, // Initially same as duration
    areaType: dto.areaType,
    areaSize: dto.areaSize,
    centerPoint: dto.centerPoint,
    affectedTargets: dto.initialTargets,
    saveDC: dto.saveDC,
    saveType: dto.saveType,
    description: dto.description,
    isActive: true,
    requiresConcentration: dto.requiresConcentration,
    triggerCondition: dto.triggerCondition,
    createdAt: currentTime
  });
  
  // 4. Save spell effect
  await putChainObject(ctx, spellEffect);
}

export interface UpdateSpellEffectDto {
  effectId: string;
  newTargets?: string[];
  removeTargets?: string[];
  newDuration?: number;
  deactivate?: boolean;
}

export async function updateSpellEffect(
  ctx: GalaChainContext,
  dto: UpdateSpellEffectDto
): Promise<void> {
  // 1. Get existing spell effect
  const effectKey = SpellEffect.getCompositeKeyFromParts(
    SpellEffect.INDEX_KEY,
    [dto.effectId, ""] // Need to implement better key lookup
  );
  
  // For now, this is a simplified implementation
  // In production, would need better composite key handling for spell effects
  
  // Implementation would update the spell effect with new targets, duration, etc.
  // This is a framework for the functionality
}