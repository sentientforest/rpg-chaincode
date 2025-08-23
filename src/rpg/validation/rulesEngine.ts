import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";

import {
  RulesViolation,
  CharacterEntity,
  CharacterProgression,
  AttributesComponent,
  CharacterClass
} from "../types";

export interface RulesValidationContext {
  characterName?: string;
  campaignId?: string;
  encounterId?: string;
  transactionId?: string;
  action: string;
  data: any;
}

interface ViolationData {
  severity: string;
  ruleViolated: string;
  description: string;
}

export async function validateCharacterRules(
  ctx: GalaChainContext,
  validationContext: RulesValidationContext
): Promise<RulesViolation[]> {
  const violations: ViolationData[] = [];
  const currentTime = ctx.txUnixTime;
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  if (!validationContext.characterName) {
    return [];
  }
  
  try {
    // Get character data
    const characterKey = CharacterEntity.getCompositeKeyFromParts(
      CharacterEntity.INDEX_KEY,
      [validationContext.characterName, ctx.callingUser]
    );
    const character = await getObjectByKey(ctx, CharacterEntity, characterKey);
    
    const progressionKey = CharacterProgression.getCompositeKeyFromParts(
      CharacterProgression.INDEX_KEY,
      [validationContext.characterName]
    );
    const progression = await getObjectByKey(ctx, CharacterProgression, progressionKey);
    
    const attributesKey = AttributesComponent.getCompositeKeyFromParts(
      AttributesComponent.INDEX_KEY,
      [validationContext.characterName]
    );
    const attributes = await getObjectByKey(ctx, AttributesComponent, attributesKey);
    
    // Rule validation based on action type
    switch (validationContext.action) {
      case "level_up":
        violations.push(...await validateLevelUp(ctx, validationContext, progression));
        break;
        
      case "attribute_boost":
        violations.push(...await validateAttributeBoost(ctx, validationContext, attributes, progression));
        break;
        
      case "spell_cast":
        violations.push(...await validateSpellCasting(ctx, validationContext));
        break;
        
      case "multiclass":
        violations.push(...await validateMulticlass(ctx, validationContext, progression));
        break;
    }
    
    // Create violation records and return them
    const violationRecords: RulesViolation[] = [];
    
    for (const violationData of violations) {
      const violation = await createValidChainObject(RulesViolation, {
        timestamp: paddedTime,
        violationId: `${validationContext.transactionId}_${violations.indexOf(violationData)}`,
        violationType: validationContext.action,
        severity: violationData.severity,
        ruleViolated: violationData.ruleViolated,
        description: violationData.description,
        characterName: validationContext.characterName,
        campaignId: validationContext.campaignId,
        encounterId: validationContext.encounterId,
        transactionId: validationContext.transactionId,
        violationData: [validationContext.data],
        wasAutoFixed: false,
        requiresGMReview: violationData.severity === "critical",
        isResolved: false,
        detectedAt: currentTime
      });
      
      await putChainObject(ctx, violation);
      violationRecords.push(violation);
    }
    
    return violationRecords;
    
  } catch (error) {
    // Character not found or other error - create system violation
    const systemViolation = await createValidChainObject(RulesViolation, {
      timestamp: paddedTime,
      violationId: `${validationContext.transactionId}_system`,
      violationType: "system_error",
      severity: "error",
      ruleViolated: "character_existence",
      description: `Character validation failed: ${error}`,
      characterName: validationContext.characterName,
      campaignId: validationContext.campaignId,
      transactionId: validationContext.transactionId,
      violationData: [validationContext.data],
      wasAutoFixed: false,
      requiresGMReview: true,
      isResolved: false,
      detectedAt: currentTime
    });
    
    await putChainObject(ctx, systemViolation);
    return [systemViolation];
  }
}

async function validateLevelUp(
  ctx: GalaChainContext,
  validationContext: RulesValidationContext,
  progression: CharacterProgression
): Promise<ViolationData[]> {
  const violations: ViolationData[] = [];
  const data = validationContext.data;
  
  // Check level progression
  if (data.newLevel !== progression.level + 1) {
    violations.push({
      severity: "error",
      ruleViolated: "sequential_levels",
      description: `Character cannot advance from level ${progression.level} to ${data.newLevel}`
    });
  }
  
  // Check maximum level
  if (data.newLevel > 20) {
    violations.push({
      severity: "error",
      ruleViolated: "maximum_level",
      description: "Character cannot exceed level 20"
    });
  }
  
  // Check attribute boost timing (every 5 levels)
  if (data.newLevel % 5 === 0 && (!data.attributeBoosts || data.attributeBoosts.length !== 4)) {
    violations.push({
      severity: "error",
      ruleViolated: "attribute_boosts_required",
      description: `Level ${data.newLevel} requires exactly 4 attribute boosts`
    });
  }
  
  return violations;
}

async function validateAttributeBoost(
  ctx: GalaChainContext,
  validationContext: RulesValidationContext,
  attributes: AttributesComponent,
  progression: CharacterProgression
): Promise<ViolationData[]> {
  const violations: ViolationData[] = [];
  const data = validationContext.data;
  
  // Check if boost is allowed at this level
  if (progression.level % 5 !== 0) {
    violations.push({
      severity: "warning",
      ruleViolated: "attribute_boost_timing",
      description: "Attribute boosts are typically gained every 5 levels"
    });
  }
  
  // Check for attribute caps (simplified)
  const attributeNames = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
  for (const attrName of attributeNames) {
    const currentValue = attributes[attrName as keyof AttributesComponent] as number;
    if (currentValue >= 22) {
      violations.push({
        severity: "error",
        ruleViolated: "attribute_maximum",
        description: `${attrName} cannot exceed 22`
      });
    }
  }
  
  return violations;
}

async function validateSpellCasting(
  ctx: GalaChainContext,
  validationContext: RulesValidationContext
): Promise<ViolationData[]> {
  const violations: ViolationData[] = [];
  const data = validationContext.data;
  
  // Check spell level limits
  if (data.spellLevel > 9) {
    violations.push({
      severity: "error",
      ruleViolated: "maximum_spell_level",
      description: "Spell level cannot exceed 9"
    });
  }
  
  // Check heightening rules
  if (data.castAtLevel < data.baseSpellLevel) {
    violations.push({
      severity: "error",
      ruleViolated: "spell_heightening",
      description: "Cannot cast spell at lower level than its base level"
    });
  }
  
  return violations;
}

async function validateMulticlass(
  ctx: GalaChainContext,
  validationContext: RulesValidationContext,
  progression: CharacterProgression
): Promise<ViolationData[]> {
  const violations: ViolationData[] = [];
  const data = validationContext.data;
  
  // Get existing classes
  const existingClasses = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterClass.INDEX_KEY,
    [validationContext.characterName!],
    CharacterClass
  );
  
  // Check multiclass prerequisites
  if (existingClasses.length > 0 && !data.dedicationFeat) {
    violations.push({
      severity: "error",
      ruleViolated: "multiclass_dedication",
      description: "Multiclassing requires a dedication feat"
    });
  }
  
  // Check level requirements for dedication
  if (progression.level < 2 && existingClasses.length > 0) {
    violations.push({
      severity: "error",
      ruleViolated: "multiclass_level_requirement",
      description: "Cannot multiclass before level 2"
    });
  }
  
  return violations;
}