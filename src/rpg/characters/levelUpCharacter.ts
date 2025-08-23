import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  AttributeModifierType,
  AttributesComponent,
  CharacterEntity,
  CharacterEvent,
  CharacterFeat,
  CharacterProgression,
  CharacterSkillProficiency,
  CharacterState,
  FeatData,
  LevelUpCharacterDto,
  SkillData
} from "../types";
import { GameCalculations } from "../utils/GameCalculations";

export async function levelUpCharacter(ctx: GalaChainContext, dto: LevelUpCharacterDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  const character = await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Get current progression
  const progressionKey = CharacterProgression.getCompositeKeyFromParts(CharacterProgression.INDEX_KEY, [
    dto.characterName
  ]);
  const progression = await getObjectByKey(ctx, CharacterProgression, progressionKey);

  const newLevel = progression.level + 1;

  // 3. Validate level-up is allowed (could add XP requirements here)
  if (newLevel > 20) {
    throw new Error("Cannot level beyond 20th level");
  }

  // 4. Get and update attributes with boosts
  const attributesKey = AttributesComponent.getCompositeKeyFromParts(AttributesComponent.INDEX_KEY, [
    dto.characterName
  ]);
  const attributes = await getObjectByKey(ctx, AttributesComponent, attributesKey);

  // Apply attribute boosts (levels 5, 10, 15, 20 get 4 boosts)
  for (const boost of dto.attributeBoosts) {
    const attributeType = boost.affects as AttributeModifierType;
    attributes.boost(boost, attributeType);
  }

  // 5. Update progression
  const updatedProgression = await createValidChainObject(CharacterProgression, {
    ...progression,
    level: newLevel,
    lastLevelUp: currentTime
  });

  // 6. Update character state with new max HP
  const stateKey = CharacterState.getCompositeKeyFromParts(CharacterState.INDEX_KEY, [dto.characterName]);
  const characterState = await getObjectByKey(ctx, CharacterState, stateKey);

  // Calculate new max HP (need ancestry and class HP from reference data)
  const conModifier = GameCalculations.attributeToModifier(attributes.constitution);
  // Simplified: add class HP + con modifier for the new level
  const hpIncrease = 8 + conModifier; // Placeholder - should lookup class data
  const newCurrentHP = characterState.currentHP.plus(hpIncrease);

  const updatedState = await createValidChainObject(CharacterState, {
    ...characterState,
    currentHP: newCurrentHP,
    lastUpdated: currentTime
  });

  // 7. Add skill increases
  if (dto.skillIncreases) {
    for (const skillName of dto.skillIncreases) {
      // Verify skill exists
      const skillKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [skillName]);
      await getObjectByKey(ctx, SkillData, skillKey);

      // Get current skill proficiency or create new one
      let currentRank = "untrained";
      try {
        const skillProfKey = CharacterSkillProficiency.getCompositeKeyFromParts(
          CharacterSkillProficiency.INDEX_KEY,
          [dto.characterName, skillName]
        );
        const currentSkill = await getObjectByKey(ctx, CharacterSkillProficiency, skillProfKey);
        currentRank = currentSkill.proficiencyRank;
      } catch (error) {
        // Skill not found, will create as trained
      }

      // Increase proficiency rank
      const rankProgression = ["untrained", "trained", "expert", "master", "legendary"];
      const currentIndex = rankProgression.indexOf(currentRank);
      const newRank =
        currentIndex < rankProgression.length - 1 ? rankProgression[currentIndex + 1] : currentRank;

      const skillProficiency = await createValidChainObject(CharacterSkillProficiency, {
        entity: dto.characterName,
        skillName: skillName,
        proficiencyRank: newRank,
        source: "level_up"
      });

      await putChainObject(ctx, skillProficiency);
    }
  }

  // 8. Add feats
  const featsToAdd: Array<{ name: string; type: string }> = [];

  if (dto.generalFeat) {
    featsToAdd.push({ name: dto.generalFeat, type: "general" });
  }
  if (dto.classFeat) {
    featsToAdd.push({ name: dto.classFeat, type: "class" });
  }
  if (dto.ancestryFeat) {
    featsToAdd.push({ name: dto.ancestryFeat, type: "ancestry" });
  }

  for (const feat of featsToAdd) {
    // Verify feat exists
    const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [feat.name]);
    await getObjectByKey(ctx, FeatData, featKey);

    const characterFeat = await createValidChainObject(CharacterFeat, {
      entity: dto.characterName,
      featName: feat.name,
      featType: feat.type,
      source: "level_up",
      level: newLevel
    });

    await putChainObject(ctx, characterFeat);
  }

  // 9. Create level-up event for history
  const levelUpEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "level_up",
    description: `Leveled up to level ${newLevel}`,
    eventData: {
      newLevel: newLevel,
      attributeBoosts: dto.attributeBoosts,
      skillIncreases: dto.skillIncreases,
      feats: featsToAdd
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 10. Save all changes
  await putChainObject(ctx, character); // Update last modified
  await putChainObject(ctx, updatedProgression);
  await putChainObject(ctx, attributes);
  await putChainObject(ctx, updatedState);
  await putChainObject(ctx, levelUpEvent);
}
