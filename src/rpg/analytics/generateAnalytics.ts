import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectsByPartialCompositeKey, putChainObject } from "@gala-chain/chaincode";

import {
  CastSpellAction,
  CharacterAchievement,
  CharacterClass,
  CharacterEntity,
  CombatAction,
  DiceRoll,
  EncounterEntity,
  GameAnalytics,
  GameSession,
  RulesViolation,
  TreasureDistribution
} from "../types";

export interface GenerateAnalyticsDto {
  reportType: string; // "daily", "weekly", "monthly", "campaign", "character"
  startDate: string; // YYYYMMDD format
  endDate: string; // YYYYMMDD format
  scopeId?: string; // Campaign/Character ID if specific scope
}

export async function generateAnalytics(ctx: GalaChainContext, dto: GenerateAnalyticsDto): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const reportDate = new Date(currentTime * 1000);
  const dateString =
    reportDate.getFullYear().toString() +
    (reportDate.getMonth() + 1).toString().padStart(2, "0") +
    reportDate.getDate().toString().padStart(2, "0");

  // Generate unique report ID
  const reportId = `${dto.reportType}_${dateString}_${ctx.stub.getTxID().substring(0, 8)}`;

  // 1. Gather session data
  let totalSessions = 0;
  let totalSessionLength = 0;

  try {
    const sessions = await getObjectsByPartialCompositeKey(
      ctx,
      GameSession.INDEX_KEY,
      dto.scopeId ? [dto.scopeId] : [],
      GameSession
    );

    // Filter sessions by date range
    const filteredSessions = sessions.filter((session) => {
      const sessionDate = session.sessionDate;
      return sessionDate >= dto.startDate && sessionDate <= dto.endDate;
    });

    totalSessions = filteredSessions.length;
    totalSessionLength = filteredSessions.reduce((sum, session) => sum + session.sessionLength, 0);
  } catch (error) {
    // Handle case where no sessions exist
  }

  // 2. Gather encounter data
  let totalEncounters = 0;

  try {
    const encounters = await getObjectsByPartialCompositeKey(
      ctx,
      EncounterEntity.INDEX_KEY,
      dto.scopeId ? [dto.scopeId] : [],
      EncounterEntity
    );

    // Filter by date range (simplified)
    totalEncounters = encounters.length;
  } catch (error) {
    // Handle case where no encounters exist
  }

  // 3. Gather combat action data
  let totalCombatActions = 0;

  try {
    const combatActions = await getObjectsByPartialCompositeKey(
      ctx,
      CombatAction.INDEX_KEY,
      [],
      CombatAction
    );

    totalCombatActions = combatActions.length;
  } catch (error) {
    // Handle case where no combat actions exist
  }

  // 4. Gather spell casting data
  let totalSpellsCast = 0;
  const spellUsage: { [spellName: string]: number } = {};

  try {
    const spellActions = await getObjectsByPartialCompositeKey(
      ctx,
      CastSpellAction.INDEX_KEY,
      [],
      CastSpellAction
    );

    totalSpellsCast = spellActions.length;

    // Count spell usage
    spellActions.forEach((action) => {
      spellUsage[action.spellName] = (spellUsage[action.spellName] || 0) + 1;
    });
  } catch (error) {
    // Handle case where no spell actions exist
  }

  // 5. Gather dice roll data
  let totalDiceRolls = 0;

  try {
    const diceRolls = await getObjectsByPartialCompositeKey(ctx, DiceRoll.INDEX_KEY, [], DiceRoll);

    totalDiceRolls = diceRolls.length;
  } catch (error) {
    // Handle case where no dice rolls exist
  }

  // 6. Gather character data
  let activeCharacters = 0;
  let newCharacters = 0;
  const classUsage: { [className: string]: number } = {};

  try {
    const characters = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterEntity.INDEX_KEY,
      [],
      CharacterEntity
    );

    activeCharacters = characters.length;

    // Count new characters in date range (simplified)
    newCharacters = characters.filter((char) => {
      const charDate = new Date(char.createdAt * 1000);
      const charDateString =
        charDate.getFullYear().toString() +
        (charDate.getMonth() + 1).toString().padStart(2, "0") +
        charDate.getDate().toString().padStart(2, "0");
      return charDateString >= dto.startDate && charDateString <= dto.endDate;
    }).length;

    // Get class usage statistics
    try {
      const characterClasses = await getObjectsByPartialCompositeKey(
        ctx,
        CharacterClass.INDEX_KEY,
        [],
        CharacterClass
      );

      characterClasses.forEach((charClass) => {
        classUsage[charClass.className] = (classUsage[charClass.className] || 0) + 1;
      });
    } catch (error) {
      // Handle case where no character classes exist
    }
  } catch (error) {
    // Handle case where no characters exist
  }

  // 7. Gather achievement data
  let achievementsEarned = 0;

  try {
    const achievements = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterAchievement.INDEX_KEY,
      [],
      CharacterAchievement
    );

    // Filter by date range
    achievementsEarned = achievements.filter((achievement) => {
      return achievement.dateEarned >= dto.startDate && achievement.dateEarned <= dto.endDate;
    }).length;
  } catch (error) {
    // Handle case where no achievements exist
  }

  // 8. Gather rules violation data
  let rulesViolations = 0;

  try {
    const violations = await getObjectsByPartialCompositeKey(
      ctx,
      RulesViolation.INDEX_KEY,
      [],
      RulesViolation
    );

    rulesViolations = violations.length;
  } catch (error) {
    // Handle case where no violations exist
  }

  // 9. Gather treasure data
  let totalTreasure = 0;

  try {
    const treasureDistributions = await getObjectsByPartialCompositeKey(
      ctx,
      TreasureDistribution.INDEX_KEY,
      [],
      TreasureDistribution
    );

    totalTreasure = treasureDistributions.reduce((sum, dist) => sum + dist.totalGoldValue.toNumber(), 0);
  } catch (error) {
    // Handle case where no treasure distributions exist
  }

  // 10. Calculate derived statistics
  const averageSessionLength = totalSessions > 0 ? Math.round(totalSessionLength / totalSessions) : 0;

  // Get top classes
  const mostPopularClasses = Object.entries(classUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([className]) => className);

  // Get top spells
  const mostPopularSpells = Object.entries(spellUsage)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([spellName]) => spellName);

  // 11. Create analytics record
  const analytics = await createValidChainObject(GameAnalytics, {
    reportDate: dateString,
    reportId: reportId,
    reportType: dto.reportType,
    scopeId: dto.scopeId,
    totalSessions: totalSessions,
    totalEncounters: totalEncounters,
    totalCombatActions: totalCombatActions,
    totalSpellsCast: totalSpellsCast,
    totalDiceRolls: totalDiceRolls,
    averageSessionLength: averageSessionLength,
    activeCharacters: activeCharacters,
    newCharactersCreated: newCharacters,
    charactersLeveledUp: 0, // Would need to track level-up events
    mostPopularClasses: mostPopularClasses,
    mostPopularSpells: mostPopularSpells,
    mostUsedSkills: [], // Would need to track skill usage
    totalTreasureDistributed: totalTreasure,
    achievementsEarned: achievementsEarned,
    rulesViolationsDetected: rulesViolations,
    topPerformingCampaigns: [], // Would need campaign activity analysis
    generatedAt: currentTime
  });

  // 12. Save analytics
  await putChainObject(ctx, analytics);
}
