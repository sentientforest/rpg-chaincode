import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import {
  CampaignEntity
} from "../types";

export interface CreateCampaignDto {
  campaignId: string;
  name: string;
  description?: string;
  setting: string; // "homebrew", "pathfinder_ap", "custom"
  recommendedLevel: number;
  allowsNewPlayers: boolean;
  visibility: string; // "public", "invite_only", "private"
  initialPlayers?: string[]; // User IDs to add immediately
}

export async function createCampaign(
  ctx: GalaChainContext,
  dto: CreateCampaignDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  
  // 1. Create campaign entity
  const campaign = await createValidChainObject(CampaignEntity, {
    campaignId: dto.campaignId,
    name: dto.name,
    description: dto.description,
    setting: dto.setting,
    gamemaster: ctx.callingUser,
    playerIds: dto.initialPlayers || [],
    characterIds: [],
    partyIds: [],
    recommendedLevel: dto.recommendedLevel,
    isActive: true,
    allowsNewPlayers: dto.allowsNewPlayers,
    visibility: dto.visibility,
    sessionsPlayed: 0,
    createdAt: currentTime
  });
  
  // 2. Save campaign
  await putChainObject(ctx, campaign);
}