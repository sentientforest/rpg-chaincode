import { GalaChainContext, getObjectByKey, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  AncestryData,
  AttributesComponent,
  BackgroundData,
  CharacterEntity,
  CharacterFeat,
  CharacterProgression,
  CharacterSkillProficiency,
  CharacterSpell,
  CharacterState,
  ClassData,
  FeatData,
  SpellData,
  ValidateCharacterDto,
  ValidationResultDto
} from "../types";
import { GameCalculations } from "../utils/GameCalculations";

export async function validateCharacter(
  ctx: GalaChainContext,
  dto: ValidateCharacterDto
): Promise<ValidationResultDto> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    // 1. Verify character entity exists
    const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
      dto.characterName,
      ctx.callingUser
    ]);
    const character = await getObjectByKey(ctx, CharacterEntity, characterKey);

    // 2. Verify all core components exist
    const progressionKey = CharacterProgression.getCompositeKeyFromParts(CharacterProgression.INDEX_KEY, [
      dto.characterName
    ]);
    const progression = await getObjectByKey(ctx, CharacterProgression, progressionKey);

    const attributesKey = AttributesComponent.getCompositeKeyFromParts(AttributesComponent.INDEX_KEY, [
      dto.characterName
    ]);
    const attributes = await getObjectByKey(ctx, AttributesComponent, attributesKey);

    const stateKey = CharacterState.getCompositeKeyFromParts(CharacterState.INDEX_KEY, [dto.characterName]);
    const characterState = await getObjectByKey(ctx, CharacterState, stateKey);

    // 3. Validate reference data integrity
    if (dto.checkRuleCompliance) {
      // Validate ancestry exists
      const ancestryKey = AncestryData.getCompositeKeyFromParts(AncestryData.INDEX_KEY, [
        progression.ancestryName
      ]);
      await getObjectByKey(ctx, AncestryData, ancestryKey);

      // Validate class exists
      const classKey = ClassData.getCompositeKeyFromParts(ClassData.INDEX_KEY, [progression.className]);
      const classData = await getObjectByKey(ctx, ClassData, classKey);

      // Validate background exists
      const backgroundKey = BackgroundData.getCompositeKeyFromParts(BackgroundData.INDEX_KEY, [
        progression.backgroundName
      ]);
      await getObjectByKey(ctx, BackgroundData, backgroundKey);

      // Validate level is within bounds
      if (progression.level < 1 || progression.level > 20) {
        errors.push(`Invalid character level: ${progression.level}. Must be between 1 and 20.`);
      }

      // Validate attribute scores
      const attributeNames = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
      for (const attr of attributeNames) {
        const score = attributes[attr as keyof AttributesComponent] as number;
        if (score < 8 || score > 30) {
          errors.push(`Invalid ${attr} score: ${score}. Must be between 8 and 30.`);
        }
      }

      // Validate HP integrity
      const conModifier = GameCalculations.attributeToModifier(attributes.constitution);
      const expectedMaxHP = GameCalculations.calculateMaxHP(
        10,
        classData.hitPointsBase.toNumber(),
        progression.level,
        conModifier
      );
      const expectedMaxHPBigNumber = new BigNumber(expectedMaxHP);

      if (characterState.currentHP.isGreaterThan(expectedMaxHPBigNumber)) {
        errors.push(
          `Current HP (${characterState.currentHP.toString()}) exceeds maximum possible HP (${expectedMaxHP}).`
        );
      }

      if (characterState.currentHP.isLessThan(0)) {
        errors.push(`Current HP (${characterState.currentHP.toString()}) cannot be negative.`);
      }
    }

    // 4. Validate feats
    const characterFeats = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterFeat.INDEX_KEY,
      [dto.characterName],
      CharacterFeat
    );

    if (dto.checkRuleCompliance) {
      for (const feat of characterFeats) {
        try {
          const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [feat.featName]);
          await getObjectByKey(ctx, FeatData, featKey);
        } catch (error) {
          errors.push(`Feat "${feat.featName}" does not exist in reference data.`);
        }
      }
    }

    // 5. Validate skills
    const characterSkills = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterSkillProficiency.INDEX_KEY,
      [dto.characterName],
      CharacterSkillProficiency
    );

    if (dto.checkRuleCompliance) {
      for (const skill of characterSkills) {
        const validRanks = ["untrained", "trained", "expert", "master", "legendary"];
        if (!validRanks.includes(skill.proficiencyRank)) {
          errors.push(`Invalid proficiency rank "${skill.proficiencyRank}" for skill ${skill.skillName}.`);
        }
      }
    }

    // 6. Validate spells
    const characterSpells = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterSpell.INDEX_KEY,
      [dto.characterName],
      CharacterSpell
    );

    if (dto.checkRuleCompliance) {
      for (const spell of characterSpells) {
        try {
          const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [spell.spellName]);
          const spellData = await getObjectByKey(ctx, SpellData, spellKey);

          // Validate spell tradition
          if (!spellData.traditions.includes(spell.tradition)) {
            errors.push(`Spell "${spell.spellName}" is not available in ${spell.tradition} tradition.`);
          }

          // Validate spell level
          if (spellData.level !== spell.spellLevel) {
            errors.push(`Spell "${spell.spellName}" is level ${spellData.level}, not ${spell.spellLevel}.`);
          }
        } catch (error) {
          errors.push(`Spell "${spell.spellName}" does not exist in reference data.`);
        }
      }
    }

    // 7. Add warnings if requested
    if (dto.includeWarnings) {
      // Check for low HP
      if (characterState.currentHP.dividedBy(100).isLessThan(0.25)) {
        // Less than 25% HP
        warnings.push("Character is at low health and may be at risk.");
      }

      // Check for negative conditions
      const negativeConditions = ["dying", "unconscious", "paralyzed", "stunned"];
      for (const condition of characterState.conditions) {
        if (negativeConditions.includes(condition.toLowerCase())) {
          warnings.push(`Character has negative condition: ${condition}.`);
        }
      }

      // Check attribute balance
      const attributeScores = [
        attributes.strength,
        attributes.dexterity,
        attributes.constitution,
        attributes.intelligence,
        attributes.wisdom,
        attributes.charisma
      ];
      const minScore = Math.min(...attributeScores);
      const maxScore = Math.max(...attributeScores);

      if (maxScore - minScore > 10) {
        suggestions.push("Consider more balanced attribute distribution for versatility.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  } catch (error) {
    errors.push(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);

    return {
      isValid: false,
      errors,
      warnings,
      suggestions
    };
  }
}
