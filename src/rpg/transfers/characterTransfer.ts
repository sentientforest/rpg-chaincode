import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CampaignEntity, CharacterEntity, CharacterEvent, CharacterTransfer } from "../types";

export interface InitiateTransferDto {
  transferId: string;
  characterName: string;
  sourceCampaignId?: string;
  targetCampaignId?: string;
  sourceWorldId?: string;
  targetWorldId?: string;
  transferType: string; // "campaign_to_campaign", "world_to_world", "retirement"
  reason: string;
  retainHistory: boolean;
  retainAchievements: boolean;
  transferConditions?: string;
}

export async function initiateCharacterTransfer(
  ctx: GalaChainContext,
  dto: InitiateTransferDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  const character = await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Verify source campaign if specified
  let sourceGM: string | undefined;
  if (dto.sourceCampaignId) {
    const sourceCampaignKey = CampaignEntity.getCompositeKeyFromParts(CampaignEntity.INDEX_KEY, [
      dto.sourceCampaignId
    ]);
    const sourceCampaign = await getObjectByKey(ctx, CampaignEntity, sourceCampaignKey);
    sourceGM = sourceCampaign.gamemaster;
  }

  // 3. Verify target campaign if specified
  let targetGM: string | undefined;
  if (dto.targetCampaignId) {
    const targetCampaignKey = CampaignEntity.getCompositeKeyFromParts(CampaignEntity.INDEX_KEY, [
      dto.targetCampaignId
    ]);
    const targetCampaign = await getObjectByKey(ctx, CampaignEntity, targetCampaignKey);
    targetGM = targetCampaign.gamemaster;
  }

  // 4. Determine who needs to approve
  const approvalRequired: string[] = [];
  if (sourceGM && sourceGM !== ctx.callingUser) {
    approvalRequired.push(sourceGM);
  }
  if (targetGM && targetGM !== ctx.callingUser && targetGM !== sourceGM) {
    approvalRequired.push(targetGM);
  }

  // 5. Create character snapshot for transfer
  const characterSnapshot = {
    entityData: character,
    // In a full implementation, would snapshot all character components
    timestamp: currentTime,
    transferId: dto.transferId
  };

  // 6. Create transfer record
  const transfer = await createValidChainObject(CharacterTransfer, {
    transferId: dto.transferId,
    timestamp: paddedTime,
    characterName: dto.characterName,
    characterOwner: ctx.callingUser,
    sourceCampaignId: dto.sourceCampaignId,
    targetCampaignId: dto.targetCampaignId,
    sourceWorldId: dto.sourceWorldId,
    targetWorldId: dto.targetWorldId,
    transferType: dto.transferType,
    reason: dto.reason,
    status: approvalRequired.length > 0 ? "pending" : "approved",
    characterData: [characterSnapshot],
    approvalRequired: approvalRequired,
    approvedBy: approvalRequired.length === 0 ? [ctx.callingUser] : [],
    sourceGM: sourceGM,
    targetGM: targetGM,
    retainHistory: dto.retainHistory,
    retainAchievements: dto.retainAchievements,
    transferConditions: dto.transferConditions,
    initiatedAt: currentTime
  });

  // 7. Create transfer event
  const transferEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "transfer_initiated",
    description: `Character transfer initiated: ${dto.transferType}`,
    eventData: {
      transferId: dto.transferId,
      transferType: dto.transferType,
      sourceCampaignId: dto.sourceCampaignId,
      targetCampaignId: dto.targetCampaignId,
      reason: dto.reason,
      approvalRequired: approvalRequired
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 8. Save transfer and event
  await putChainObject(ctx, transfer);
  await putChainObject(ctx, transferEvent);
}

export interface ApproveTransferDto {
  transferId: string;
  approval: boolean; // true to approve, false to reject
  gmNotes?: string;
}

export async function approveCharacterTransfer(
  ctx: GalaChainContext,
  dto: ApproveTransferDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Get transfer record
  const transferKey = CharacterTransfer.getCompositeKeyFromParts(
    CharacterTransfer.INDEX_KEY,
    [dto.transferId, paddedTime] // This might need adjustment for proper key lookup
  );

  // For now, simplified implementation
  // In production, would need better key handling for finding transfers

  // This is a framework showing the approval process
  // Would update the transfer status and handle completion
}
