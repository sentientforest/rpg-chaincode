import BigNumber from "bignumber.js";

import { CharacterEquipment } from "../types";

/**
 * @description
 *
 * Core calculation functions for RPG game mechanics.
 * All calculations follow Pathfinder 2e rules.
 */
export class GameCalculations {
  /**
   * Calculate Armor Class
   * AC = 10 + Dex modifier + proficiency bonus + armor bonus + shield bonus
   */
  static calculateAC(
    dexModifier: number,
    armorProficiencyBonus: number,
    armorACBonus: number,
    armorDexCap: number | undefined,
    shieldBonus = 0
  ): number {
    // Apply dex cap from armor if applicable
    const effectiveDex = armorDexCap !== undefined ? Math.min(dexModifier, armorDexCap) : dexModifier;

    return 10 + effectiveDex + armorProficiencyBonus + armorACBonus + shieldBonus;
  }

  /**
   * Calculate Hit Points
   * HP = Ancestry HP + (Class HP per level × Level) + (Constitution modifier × Level)
   */
  static calculateMaxHP(ancestryHP: number, classHP: number, level: number, conModifier: number): number {
    return ancestryHP + classHP * level + conModifier * level;
  }

  /**
   * Calculate Proficiency Bonus
   * Bonus = Rank value + Character level
   * Untrained: 0, Trained: 2+level, Expert: 4+level, Master: 6+level, Legendary: 8+level
   */
  static calculateProficiencyBonus(rank: string, level: number): number {
    const rankValues: { [key: string]: number } = {
      untrained: 0,
      trained: 2,
      expert: 4,
      master: 6,
      legendary: 8
    };

    const rankValue = rankValues[rank.toLowerCase()] || 0;
    return rank.toLowerCase() === "untrained" ? 0 : rankValue + level;
  }

  /**
   * Calculate Saving Throw
   * Save = d20 + attribute modifier + proficiency bonus + item bonus
   */
  static calculateSavingThrow(
    attributeModifier: number,
    proficiencyRank: string,
    level: number,
    itemBonus = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(proficiencyRank, level);
    return attributeModifier + profBonus + itemBonus;
  }

  /**
   * Calculate Skill Modifier
   * Skill = attribute modifier + proficiency bonus + item bonus - armor check penalty
   */
  static calculateSkillModifier(
    attributeModifier: number,
    proficiencyRank: string,
    level: number,
    itemBonus = 0,
    armorCheckPenalty = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(proficiencyRank, level);
    return attributeModifier + profBonus + itemBonus - Math.abs(armorCheckPenalty);
  }

  /**
   * Calculate Strike (Attack) Modifier
   * Strike = attribute modifier + proficiency bonus + item bonus
   */
  static calculateStrikeModifier(
    attributeModifier: number, // Str for melee, Dex for ranged
    weaponProficiencyRank: string,
    level: number,
    itemBonus = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(weaponProficiencyRank, level);
    return attributeModifier + profBonus + itemBonus;
  }

  /**
   * Calculate Class DC
   * DC = 10 + proficiency bonus + key attribute modifier
   */
  static calculateClassDC(
    keyAttributeModifier: number,
    classDCProficiencyRank: string,
    level: number
  ): number {
    const profBonus = this.calculateProficiencyBonus(classDCProficiencyRank, level);
    return 10 + profBonus + keyAttributeModifier;
  }

  /**
   * Calculate Spell Attack Modifier
   * Spell Attack = key attribute modifier + proficiency bonus + item bonus
   */
  static calculateSpellAttack(
    keyAttributeModifier: number,
    spellAttackProficiencyRank: string,
    level: number,
    itemBonus = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(spellAttackProficiencyRank, level);
    return keyAttributeModifier + profBonus + itemBonus;
  }

  /**
   * Calculate Spell DC
   * Spell DC = 10 + key attribute modifier + proficiency bonus + item bonus
   */
  static calculateSpellDC(
    keyAttributeModifier: number,
    spellDCProficiencyRank: string,
    level: number,
    itemBonus = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(spellDCProficiencyRank, level);
    return 10 + keyAttributeModifier + profBonus + itemBonus;
  }

  /**
   * Calculate Bulk Limits
   * Encumbered: 5 + Strength modifier
   * Maximum: 10 + Strength modifier
   */
  static calculateBulkLimits(strengthModifier: number): {
    encumbered: number;
    maximum: number;
  } {
    return {
      encumbered: 5 + strengthModifier,
      maximum: 10 + strengthModifier
    };
  }

  /**
   * Calculate Total Bulk
   * Sum of all equipment bulk, 10 light items = 1 bulk
   */
  static calculateTotalBulk(equipment: CharacterEquipment[]): BigNumber {
    let totalBulk = new BigNumber(0);

    for (const item of equipment) {
      if (item.isEquipped || item.containerSlot) {
        totalBulk = totalBulk.plus(item.bulkPerItem.times(item.quantity));
      }
    }

    return totalBulk;
  }

  /**
   * Convert Attribute Score to Modifier
   * Modifier = (Score - 10) / 2, rounded down
   */
  static attributeToModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  /**
   * Convert Attribute Modifier to Score
   * Score = (Modifier * 2) + 10
   */
  static modifierToAttribute(modifier: number): number {
    return modifier * 2 + 10;
  }

  /**
   * Calculate Perception
   * Perception = Wisdom modifier + proficiency bonus + item bonus
   */
  static calculatePerception(
    wisdomModifier: number,
    perceptionProficiencyRank: string,
    level: number,
    itemBonus = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(perceptionProficiencyRank, level);
    return wisdomModifier + profBonus + itemBonus;
  }

  /**
   * Calculate initiative modifier
   * Initiative = Dexterity modifier (+ other bonuses)
   */
  static calculateInitiative(dexterityModifier: number, itemBonus = 0): number {
    return dexterityModifier + itemBonus;
  }

  /**
   * Calculate speed with modifiers
   * Speed = Base speed + racial modifiers + item modifiers - armor penalties
   */
  static calculateSpeed(baseSpeed: number, speedModifiers = 0, armorSpeedPenalty = 0): number {
    const result = baseSpeed + speedModifiers - Math.abs(armorSpeedPenalty);
    return Math.max(result, 5); // Minimum speed is 5 feet
  }
}
