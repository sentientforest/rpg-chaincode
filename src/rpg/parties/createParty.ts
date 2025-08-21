import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  CreatePartyDto,
  PartyEntity,
  PartyTreasury,
  CharacterEntity
} from "../types";

export async function createParty(
  ctx: GalaChainContext,
  dto: CreatePartyDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  
  // 1. Verify initial members exist (if provided)
  const validMemberIds: string[] = [];
  if (dto.initialMembers && dto.initialMembers.length > 0) {
    for (const characterId of dto.initialMembers) {
      try {
        const characterKey = CharacterEntity.getCompositeKeyFromParts(
          CharacterEntity.INDEX_KEY,
          [characterId, ctx.callingUser]
        );
        await getObjectByKey(ctx, CharacterEntity, characterKey);
        validMemberIds.push(characterId);
      } catch (error) {
        // Character not found or not accessible, skip
        console.warn(`Character ${characterId} not found or not accessible`);
      }
    }
  }
  
  // 2. Determine party leader (first valid member or will be set later)
  const leader = validMemberIds.length > 0 ? validMemberIds[0] : "";
  
  // 3. Create party entity
  const party = await createValidChainObject(PartyEntity, {
    partyId: dto.partyId,
    name: dto.name,
    description: dto.description,
    leader: leader,
    memberIds: validMemberIds,
    invitedPlayers: dto.inviteePlayers || [],
    isActive: true,
    treasurePolicy: dto.treasurePolicy,
    createdAt: currentTime,
    createdBy: ctx.callingUser
  });
  
  // 4. Create party treasury
  const treasury = await createValidChainObject(PartyTreasury, {
    partyId: dto.partyId,
    goldPieces: new BigNumber(0),
    silverPieces: new BigNumber(0),
    copperPieces: new BigNumber(0),
    platinumPieces: new BigNumber(0),
    sharedItems: [],
    treasureHistory: [],
    lastUpdated: currentTime
  });
  
  // 5. Save party and treasury
  await putChainObject(ctx, party);
  await putChainObject(ctx, treasury);
}