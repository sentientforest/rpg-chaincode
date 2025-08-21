import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import {
  CreateEncounterDto,
  EncounterEntity,
  EncounterParticipant,
  CampaignEntity,
  CharacterEntity
} from "../types";

export async function createEncounter(
  ctx: GalaChainContext,
  dto: CreateEncounterDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  
  // 1. Verify campaign exists and caller is GM
  const campaignKey = CampaignEntity.getCompositeKeyFromParts(
    CampaignEntity.INDEX_KEY,
    [dto.campaignId]
  );
  const campaign = await getObjectByKey(ctx, CampaignEntity, campaignKey);
  
  if (campaign.gamemaster !== ctx.callingUser) {
    throw new Error("Only the campaign gamemaster can create encounters");
  }
  
  // 2. Create encounter entity
  const encounter = await createValidChainObject(EncounterEntity, {
    campaignId: dto.campaignId,
    encounterId: dto.encounterId,
    name: dto.name,
    description: dto.description,
    encounterType: dto.encounterType,
    level: dto.level,
    status: "pending",
    participantIds: dto.initialParticipants || [],
    createdAt: currentTime,
    gamemaster: ctx.callingUser
  });
  
  // 3. Add initial participants if provided
  if (dto.initialParticipants && dto.initialParticipants.length > 0) {
    for (const characterId of dto.initialParticipants) {
      // Verify character exists
      const characterKey = CharacterEntity.getCompositeKeyFromParts(
        CharacterEntity.INDEX_KEY,
        [characterId, ctx.callingUser] // For now, assume same user owns characters
      );
      
      try {
        await getObjectByKey(ctx, CharacterEntity, characterKey);
        
        // Create participant entry
        const participant = await createValidChainObject(EncounterParticipant, {
          encounterId: dto.encounterId,
          participantId: characterId,
          participantType: "character",
          initiative: 0,
          initiativeBonus: 0,
          isActive: true,
          isDefeated: false,
          teamId: "players"
        });
        
        await putChainObject(ctx, participant);
      } catch (error) {
        // Character not found or not owned by caller, skip
        console.warn(`Character ${characterId} not found or not accessible`);
      }
    }
  }
  
  // 4. Save encounter
  await putChainObject(ctx, encounter);
}