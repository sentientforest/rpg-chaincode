import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CharacterAchievement, CharacterEntity, CharacterEvent } from "../types";

export interface AwardAchievementDto {
  characterName: string;
  achievementId: string;
  achievementName: string;
  description: string;
  category: string; // "combat", "exploration", "social", "milestone", "special"
  rarity: string; // "common", "uncommon", "rare", "legendary"
  campaignId?: string;
  sessionId?: string;
  encounterId?: string;
  witnessedBy?: string[];
  specialReward?: string;
  isSecret?: boolean;
  progressValue?: number;
  maxProgress?: number;
}

export async function awardAchievement(ctx: GalaChainContext, dto: AwardAchievementDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // Create date string for achievement
  const achievementDate = new Date(currentTime * 1000);
  const dateString =
    achievementDate.getFullYear().toString() +
    (achievementDate.getMonth() + 1).toString().padStart(2, "0") +
    achievementDate.getDate().toString().padStart(2, "0");

  // 1. Verify character exists
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Create achievement record
  const achievement = await createValidChainObject(CharacterAchievement, {
    characterName: dto.characterName,
    dateEarned: dateString,
    achievementId: dto.achievementId,
    achievementName: dto.achievementName,
    description: dto.description,
    category: dto.category,
    rarity: dto.rarity,
    campaignId: dto.campaignId,
    sessionId: dto.sessionId,
    encounterId: dto.encounterId,
    witnessedBy: dto.witnessedBy || [],
    specialReward: dto.specialReward,
    isSecret: dto.isSecret || false,
    isRepeatable: false, // Default to non-repeatable
    progressValue: dto.progressValue,
    maxProgress: dto.maxProgress,
    earnedAt: currentTime
  });

  // 3. Create achievement event
  const achievementEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "achievement_earned",
    description: `Earned achievement: ${dto.achievementName}`,
    eventData: {
      achievementId: dto.achievementId,
      achievementName: dto.achievementName,
      category: dto.category,
      rarity: dto.rarity,
      specialReward: dto.specialReward,
      campaignId: dto.campaignId
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 4. Save achievement and event
  await putChainObject(ctx, achievement);
  await putChainObject(ctx, achievementEvent);
}

export interface CheckAchievementProgressDto {
  characterName: string;
  eventType: string;
  eventData: any;
}

export async function checkAchievementProgress(
  ctx: GalaChainContext,
  dto: CheckAchievementProgressDto
): Promise<string[]> {
  // This function would analyze the event and determine if any achievements should be awarded
  // Returns array of achievement IDs that should be awarded

  const triggeredAchievements: string[] = [];

  // Example achievement triggers (would be more sophisticated in production)
  switch (dto.eventType) {
    case "level_up":
      if (dto.eventData.newLevel === 10) {
        triggeredAchievements.push("VETERAN_ADVENTURER");
      }
      if (dto.eventData.newLevel === 20) {
        triggeredAchievements.push("LEGENDARY_HERO");
      }
      break;

    case "combat_victory":
      if (dto.eventData.enemyLevel >= dto.eventData.characterLevel + 5) {
        triggeredAchievements.push("GIANT_SLAYER");
      }
      break;

    case "spell_cast":
      if (dto.eventData.spellLevel >= 9) {
        triggeredAchievements.push("ARCHMAGE");
      }
      break;

    case "treasure_found":
      if (dto.eventData.goldValue >= 10000) {
        triggeredAchievements.push("WEALTHY_ADVENTURER");
      }
      break;

    case "first_death":
      triggeredAchievements.push("HEROIC_SACRIFICE");
      break;
  }

  return triggeredAchievements;
}
