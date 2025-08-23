import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  AncestryData,
  AttributeModifierType,
  AttributesComponent,
  BackgroundData,
  CharacterEntity,
  CharacterFeat,
  CharacterProgression,
  CharacterSkillProficiency,
  CharacterState,
  ClassData,
  CreateCharacterDto
} from "../types";
import { GameCalculations } from "../utils/GameCalculations";

export async function createCharacter(ctx: GalaChainContext, dto: CreateCharacterDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const callingUser = ctx.callingUser;

  // 1. Validate reference data exists
  const ancestryKey = AncestryData.getCompositeKeyFromParts(AncestryData.INDEX_KEY, [dto.ancestryName]);
  const ancestry = await getObjectByKey(ctx, AncestryData, ancestryKey);

  const backgroundKey = BackgroundData.getCompositeKeyFromParts(BackgroundData.INDEX_KEY, [
    dto.backgroundName
  ]);
  const background = await getObjectByKey(ctx, BackgroundData, backgroundKey);

  const classKey = ClassData.getCompositeKeyFromParts(ClassData.INDEX_KEY, [dto.className]);
  const characterClass = await getObjectByKey(ctx, ClassData, classKey);

  // 2. Create main character entity
  const characterEntity = await createValidChainObject(CharacterEntity, {
    name: dto.characterName,
    owner: callingUser,
    concept: dto.concept,
    createdAt: currentTime,
    lastModified: currentTime
  });

  // 3. Create attributes component with starting values (10s) + boosts
  const attributes = await createValidChainObject(AttributesComponent, {
    entity: dto.characterName,
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    strengthPartialBoost: false,
    dexterityPartialBoost: false,
    constitutionPartialBoost: false,
    intelligencePartialBoost: false,
    wisdomPartialBoost: false,
    charismaPartialBoost: false
  });

  // Apply the 4 starting attribute boosts
  for (const boost of dto.attributeBoosts) {
    const attributeType = boost.affects as AttributeModifierType;
    attributes.boost(boost, attributeType);
  }

  // Apply ancestry attribute boosts
  for (const ancestryBoost of ancestry.attributeBoosts) {
    const attributeType = ancestryBoost.affects as AttributeModifierType;
    attributes.boost(ancestryBoost, attributeType);
  }

  // Apply ancestry attribute flaws
  for (const ancestryFlaw of ancestry.attributeFlaws) {
    const attributeType = ancestryFlaw.affects as AttributeModifierType;
    attributes.reduce(ancestryFlaw, attributeType);
  }

  // Apply background attribute boosts
  for (const backgroundBoost of background.attributeBoosts) {
    const attributeType = backgroundBoost.affects as AttributeModifierType;
    attributes.boost(backgroundBoost, attributeType);
  }

  // 4. Create character progression component
  const progression = await createValidChainObject(CharacterProgression, {
    entity: dto.characterName,
    level: 1,
    experience: new BigNumber(0),
    ancestryName: dto.ancestryName,
    backgroundName: dto.backgroundName,
    className: dto.className,
    lastLevelUp: currentTime
  });

  // 5. Calculate and create character state with starting HP
  const conModifier = GameCalculations.attributeToModifier(attributes.constitution);
  const maxHP = GameCalculations.calculateMaxHP(
    ancestry.hitPoints.toNumber(),
    characterClass.hitPointsBase.toNumber(),
    1, // Level 1
    conModifier
  );

  const characterState = await createValidChainObject(CharacterState, {
    entity: dto.characterName,
    currentHP: new BigNumber(maxHP),
    temporaryHP: new BigNumber(0),
    heroPoints: 1, // Characters start with 1 hero point
    focusPoints: 0, // Will be set by class features later
    conditions: [],
    lastUpdated: currentTime
  });

  // 6. Create skill proficiencies from background
  const backgroundSkill = await createValidChainObject(CharacterSkillProficiency, {
    entity: dto.characterName,
    skillName: background.trainedSkill,
    proficiencyRank: "trained",
    source: "background"
  });

  const loreSkill = await createValidChainObject(CharacterSkillProficiency, {
    entity: dto.characterName,
    skillName: background.loreSkill,
    proficiencyRank: "trained",
    source: "background"
  });

  // 7. Create starting feats
  const feats: CharacterFeat[] = [];

  // Background skill feat
  if (background.skillFeat) {
    const skillFeat = await createValidChainObject(CharacterFeat, {
      entity: dto.characterName,
      featName: background.skillFeat,
      featType: "skill",
      source: "background",
      level: 1
    });
    feats.push(skillFeat);
  }

  // Any additional starting feats specified in DTO
  if (dto.startingFeats) {
    for (const featName of dto.startingFeats) {
      const feat = await createValidChainObject(CharacterFeat, {
        entity: dto.characterName,
        featName: featName,
        featType: "general", // Could be refined based on feat data
        source: "starting",
        level: 1
      });
      feats.push(feat);
    }
  }

  // 8. Save all components to chain
  await putChainObject(ctx, characterEntity);
  await putChainObject(ctx, attributes);
  await putChainObject(ctx, progression);
  await putChainObject(ctx, characterState);
  await putChainObject(ctx, backgroundSkill);
  await putChainObject(ctx, loreSkill);

  for (const feat of feats) {
    await putChainObject(ctx, feat);
  }
}
