import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CampaignEntity, GameSession } from "../types";

export interface StartGameSessionDto {
  campaignId: string;
  sessionId: string;
  title?: string;
  participantCharacters: string[]; // Character IDs participating
  participantPlayers: string[]; // User IDs participating
}

export async function startGameSession(ctx: GalaChainContext, dto: StartGameSessionDto): Promise<void> {
  const currentTime = ctx.txUnixTime;

  // 1. Verify campaign exists and caller is GM
  const campaignKey = CampaignEntity.getCompositeKeyFromParts(CampaignEntity.INDEX_KEY, [dto.campaignId]);
  const campaign = await getObjectByKey(ctx, CampaignEntity, campaignKey);

  if (campaign.gamemaster !== ctx.callingUser) {
    throw new Error("Only the campaign gamemaster can start sessions");
  }

  // 2. Create session date string (YYYYMMDD format)
  const sessionDate = new Date(currentTime * 1000);
  const dateString =
    sessionDate.getFullYear().toString() +
    (sessionDate.getMonth() + 1).toString().padStart(2, "0") +
    sessionDate.getDate().toString().padStart(2, "0");

  // 3. Create game session
  const gameSession = await createValidChainObject(GameSession, {
    campaignId: dto.campaignId,
    sessionDate: dateString,
    sessionId: dto.sessionId,
    title: dto.title,
    summary: "", // Will be filled in later
    participantCharacters: dto.participantCharacters,
    participantPlayers: dto.participantPlayers,
    encountersRun: [],
    wasCompleted: false,
    sessionLength: 0, // Will be calculated when session ends
    startedAt: currentTime,
    gamemaster: ctx.callingUser
  });

  // 4. Update campaign with session info
  const updatedCampaign = await createValidChainObject(CampaignEntity, {
    ...campaign,
    sessionsPlayed: campaign.sessionsPlayed + 1,
    lastSessionDate: currentTime
  });

  // 5. Save session and updated campaign
  await putChainObject(ctx, gameSession);
  await putChainObject(ctx, updatedCampaign);
}
