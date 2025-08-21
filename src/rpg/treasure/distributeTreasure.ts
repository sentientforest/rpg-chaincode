import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  TreasureDistribution,
  PartyEntity,
  PartyTreasury,
  CharacterEntity
} from "../types";

export interface DistributeTreasureDto {
  distributionId: string;
  source: string; // "encounter", "session", "gm_award", "found"
  sourceId?: string;
  partyId?: string;
  recipients: string[]; // Character IDs
  goldValue: number;
  currencyBreakdown: {
    characterId: string;
    goldPieces: number;
    silverPieces: number;
    copperPieces: number;
    platinumPieces: number;
  }[];
  itemIds?: string[];
  distributionMethod: string; // "equal", "roll", "assigned", "vote"
  notes?: string;
}

export async function distributeTreasure(
  ctx: GalaChainContext,
  dto: DistributeTreasureDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Verify all recipients exist
  for (const characterId of dto.recipients) {
    try {
      // For now, assume characters are accessible to the caller
      // In a real implementation, we'd need more sophisticated access control
      const characterKey = CharacterEntity.getCompositeKeyFromParts(
        CharacterEntity.INDEX_KEY,
        [characterId, ctx.callingUser]
      );
      await getObjectByKey(ctx, CharacterEntity, characterKey);
    } catch (error) {
      throw new Error(`Character ${characterId} not found or not accessible`);
    }
  }
  
  // 2. If party-based distribution, verify party exists and update treasury
  if (dto.partyId) {
    const partyKey = PartyEntity.getCompositeKeyFromParts(
      PartyEntity.INDEX_KEY,
      [dto.partyId]
    );
    const party = await getObjectByKey(ctx, PartyEntity, partyKey);
    
    // Verify all recipients are party members
    for (const characterId of dto.recipients) {
      if (!party.memberIds.includes(characterId)) {
        throw new Error(`Character ${characterId} is not a member of party ${dto.partyId}`);
      }
    }
    
    // Update party treasury with total treasure
    const treasuryKey = PartyTreasury.getCompositeKeyFromParts(
      PartyTreasury.INDEX_KEY,
      [dto.partyId]
    );
    const treasury = await getObjectByKey(ctx, PartyTreasury, treasuryKey);
    
    // Calculate total currency from distribution
    let totalGold = new BigNumber(0);
    let totalSilver = new BigNumber(0);
    let totalCopper = new BigNumber(0);
    let totalPlatinum = new BigNumber(0);
    
    for (const distribution of dto.currencyBreakdown) {
      totalGold = totalGold.plus(distribution.goldPieces);
      totalSilver = totalSilver.plus(distribution.silverPieces);
      totalCopper = totalCopper.plus(distribution.copperPieces);
      totalPlatinum = totalPlatinum.plus(distribution.platinumPieces);
    }
    
    // Update treasury
    const updatedTreasury = await createValidChainObject(PartyTreasury, {
      ...treasury,
      goldPieces: treasury.goldPieces.plus(totalGold),
      silverPieces: treasury.silverPieces.plus(totalSilver),
      copperPieces: treasury.copperPieces.plus(totalCopper),
      platinumPieces: treasury.platinumPieces.plus(totalPlatinum),
      sharedItems: [...treasury.sharedItems, ...(dto.itemIds || [])],
      treasureHistory: [...treasury.treasureHistory, ctx.stub.getTxID()],
      lastUpdated: currentTime
    });
    
    await putChainObject(ctx, updatedTreasury);
  }
  
  // 3. Create treasure distribution record
  const treasureDistribution = await createValidChainObject(TreasureDistribution, {
    timestamp: paddedTime,
    distributionId: dto.distributionId,
    source: dto.source,
    sourceId: dto.sourceId,
    recipients: dto.recipients,
    partyId: dto.partyId,
    totalGoldValue: new BigNumber(dto.goldValue),
    currencyDistribution: dto.currencyBreakdown,
    itemsDistributed: dto.itemIds || [],
    distributionMethod: dto.distributionMethod,
    notes: dto.notes,
    distributedAt: currentTime,
    distributedBy: ctx.callingUser
  });
  
  // 4. Save treasure distribution
  await putChainObject(ctx, treasureDistribution);
}