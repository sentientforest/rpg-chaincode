import { GalaChainContext, getObjectByKey, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";

import {
  AttributesComponent,
  AttributesDto,
  CalculatedStatsDto,
  CharacterEntity,
  CharacterEquipment,
  CharacterFeat,
  CharacterFeatDto,
  CharacterProgression,
  CharacterSheetDto,
  CharacterSkillProficiency,
  CharacterState,
  CharacterStateDto,
  EquipmentItemDto,
  GetCharacterDto,
  SkillData,
  SkillProficiencyDto
} from "../types";
import { GameCalculations } from "../utils/GameCalculations";

export async function getCharacterSheet(
  ctx: GalaChainContext,
  dto: GetCharacterDto
): Promise<CharacterSheetDto> {
  // 1. Get main character entity
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    dto.owner || ctx.callingUser
  ]);
  const character = await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Get attributes component
  const attributesKey = AttributesComponent.getCompositeKeyFromParts(AttributesComponent.INDEX_KEY, [
    dto.characterName
  ]);
  const attributes = await getObjectByKey(ctx, AttributesComponent, attributesKey);

  // 3. Get progression component
  const progressionKey = CharacterProgression.getCompositeKeyFromParts(CharacterProgression.INDEX_KEY, [
    dto.characterName
  ]);
  const progression = await getObjectByKey(ctx, CharacterProgression, progressionKey);

  // 4. Get current state component
  const stateKey = CharacterState.getCompositeKeyFromParts(CharacterState.INDEX_KEY, [dto.characterName]);
  const state = await getObjectByKey(ctx, CharacterState, stateKey);

  // 5. Get all skill proficiencies
  const skills = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterSkillProficiency.INDEX_KEY,
    [dto.characterName],
    CharacterSkillProficiency
  );

  // 6. Get all feats
  const feats = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterFeat.INDEX_KEY,
    [dto.characterName],
    CharacterFeat
  );

  // 7. Get all equipment
  const equipment = await getObjectsByPartialCompositeKey(
    ctx,
    CharacterEquipment.INDEX_KEY,
    [dto.characterName],
    CharacterEquipment
  );

  // 8. Calculate derived stats
  const attributeModifiers = {
    strengthModifier: GameCalculations.attributeToModifier(attributes.strength),
    dexterityModifier: GameCalculations.attributeToModifier(attributes.dexterity),
    constitutionModifier: GameCalculations.attributeToModifier(attributes.constitution),
    intelligenceModifier: GameCalculations.attributeToModifier(attributes.intelligence),
    wisdomModifier: GameCalculations.attributeToModifier(attributes.wisdom),
    charismaModifier: GameCalculations.attributeToModifier(attributes.charisma)
  };

  // Calculate max HP
  const maxHP = GameCalculations.calculateMaxHP(
    8, // Placeholder for ancestry HP - would need to lookup AncestryData
    8, // Placeholder for class HP - would need to lookup ClassData
    progression.level,
    attributeModifiers.constitutionModifier
  );

  // Calculate AC (basic unarmored for now)
  const armorClass = GameCalculations.calculateAC(
    attributeModifiers.dexterityModifier,
    0, // Unarmored proficiency
    0, // No armor bonus
    undefined, // No dex cap
    0 // No shield
  );

  // Calculate saves (need to implement proficiency lookup)
  const fortitudeSave = GameCalculations.calculateSavingThrow(
    attributeModifiers.constitutionModifier,
    "trained", // Placeholder
    progression.level
  );

  const reflexSave = GameCalculations.calculateSavingThrow(
    attributeModifiers.dexterityModifier,
    "trained", // Placeholder
    progression.level
  );

  const willSave = GameCalculations.calculateSavingThrow(
    attributeModifiers.wisdomModifier,
    "trained", // Placeholder
    progression.level
  );

  // Calculate perception
  const perception = GameCalculations.calculatePerception(
    attributeModifiers.wisdomModifier,
    "trained", // Placeholder
    progression.level
  );

  // Calculate initiative
  const initiative = GameCalculations.calculateInitiative(attributeModifiers.dexterityModifier);

  // Calculate class DC (placeholder - need class key attribute)
  const classDC = GameCalculations.calculateClassDC(
    attributeModifiers.intelligenceModifier, // Placeholder
    "trained",
    progression.level
  );

  // Calculate skill modifiers
  const skillDtos: SkillProficiencyDto[] = [];
  for (const skill of skills) {
    // Get skill data to determine key attribute
    let skillModifier = 0;
    try {
      const skillDataKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [skill.skillName]);
      const skillData = await getObjectByKey(ctx, SkillData, skillDataKey);

      // Get the appropriate attribute modifier
      const keyAttr = skillData.keyAttribute.toLowerCase();
      let attrModifier = 0;
      switch (keyAttr) {
        case "strength":
          attrModifier = attributeModifiers.strengthModifier;
          break;
        case "dexterity":
          attrModifier = attributeModifiers.dexterityModifier;
          break;
        case "constitution":
          attrModifier = attributeModifiers.constitutionModifier;
          break;
        case "intelligence":
          attrModifier = attributeModifiers.intelligenceModifier;
          break;
        case "wisdom":
          attrModifier = attributeModifiers.wisdomModifier;
          break;
        case "charisma":
          attrModifier = attributeModifiers.charismaModifier;
          break;
      }

      skillModifier = GameCalculations.calculateSkillModifier(
        attrModifier,
        skill.proficiencyRank,
        progression.level,
        0, // No item bonus
        skillData.hasArmorCheckPenalty ? 0 : 0 // No armor check penalty for now
      );
    } catch (error) {
      // If skill data not found, use basic calculation
      skillModifier = GameCalculations.calculateSkillModifier(
        attributeModifiers.dexterityModifier, // Default to dex
        skill.proficiencyRank,
        progression.level
      );
    }

    skillDtos.push({
      skillName: skill.skillName,
      proficiencyRank: skill.proficiencyRank,
      source: skill.source,
      modifier: skillModifier
    });
  }

  // Build character sheet DTO
  const characterSheet: CharacterSheetDto = {
    // Basic info
    name: character.name,
    owner: character.owner,
    concept: character.concept,

    // Progression
    level: progression.level,
    ancestryName: progression.ancestryName,
    backgroundName: progression.backgroundName,
    className: progression.className,

    // Attributes with modifiers
    attributes: {
      strength: attributes.strength,
      dexterity: attributes.dexterity,
      constitution: attributes.constitution,
      intelligence: attributes.intelligence,
      wisdom: attributes.wisdom,
      charisma: attributes.charisma,
      ...attributeModifiers
    },

    // Current state
    currentState: {
      currentHP: state.currentHP.toNumber(),
      maxHP: maxHP,
      temporaryHP: state.temporaryHP.toNumber(),
      heroPoints: state.heroPoints,
      focusPoints: state.focusPoints,
      conditions: state.conditions
    },

    // Calculated stats
    calculatedStats: {
      armorClass: armorClass,
      fortitudeSave: fortitudeSave,
      reflexSave: reflexSave,
      willSave: willSave,
      perception: perception,
      initiative: initiative,
      speed: 30, // Placeholder - need to lookup ancestry speed
      classDC: classDC
    },

    // Skills
    skills: skillDtos,

    // Feats
    feats: feats.map((feat) => ({
      featName: feat.featName,
      featType: feat.featType,
      source: feat.source,
      level: feat.level
    })),

    // Equipment
    equipment: equipment.map((item) => ({
      itemId: item.itemId,
      itemName: item.itemName,
      itemType: item.itemType,
      quantity: item.quantity.toNumber(),
      isEquipped: item.isEquipped,
      bulkPerItem: item.bulkPerItem.toNumber(),
      containerSlot: item.containerSlot
    })),

    // Metadata
    createdAt: character.createdAt,
    lastModified: character.lastModified
  };

  return characterSheet;
}
