import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject, getObjectsByPartialCompositeKey } from "@gala-chain/chaincode";

import {
  InitiativeTracker,
  EncounterEntity,
  EncounterParticipant,
  EncounterAction
} from "../types";

export interface StartInitiativeDto {
  encounterId: string;
}

export interface AdvanceTurnDto {
  encounterId: string;
}

export async function startInitiative(
  ctx: GalaChainContext,
  dto: StartInitiativeDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Verify encounter exists and is active
  const encounterKey = EncounterEntity.getCompositeKeyFromParts(
    EncounterEntity.INDEX_KEY,
    [dto.encounterId.split("|")[0], dto.encounterId]
  );
  const encounter = await getObjectByKey(ctx, EncounterEntity, encounterKey);
  
  if (encounter.status !== "active") {
    throw new Error("Cannot start initiative for non-active encounter");
  }
  
  // 2. Get all participants and sort by initiative
  const participants = await getObjectsByPartialCompositeKey(
    ctx,
    EncounterParticipant.INDEX_KEY,
    [dto.encounterId],
    EncounterParticipant
  );
  
  const activeParticipants = participants.filter(p => p.isActive && !p.isDefeated);
  
  if (activeParticipants.length === 0) {
    throw new Error("No active participants in encounter");
  }
  
  // Sort by initiative (highest first), then by bonus for ties
  activeParticipants.sort((a, b) => {
    if (a.initiative !== b.initiative) {
      return b.initiative - a.initiative; // Descending order
    }
    return b.initiativeBonus - a.initiativeBonus; // Higher bonus wins ties
  });
  
  // 3. Create initiative tracker
  const initiativeTracker = await createValidChainObject(InitiativeTracker, {
    encounterId: dto.encounterId,
    currentRound: 1,
    currentTurnParticipant: activeParticipants[0].participantId,
    currentTurnIndex: 0,
    isActive: true,
    hasStarted: true,
    turnStartTime: currentTime,
    roundStartTime: currentTime,
    lastUpdated: currentTime
  });
  
  // 4. Create encounter action for initiative start
  const initiativeAction = await createValidChainObject(EncounterAction, {
    encounterId: dto.encounterId,
    timestamp: paddedTime,
    txId: txId,
    actingParticipant: "GM", // System action
    actionType: "initiative",
    description: `Initiative started - ${activeParticipants[0].participantId} goes first`,
    roundNumber: 1,
    actionData: {
      initiativeOrder: activeParticipants.map(p => ({
        participantId: p.participantId,
        initiative: p.initiative,
        initiativeBonus: p.initiativeBonus
      }))
    },
    performedAt: currentTime
  });
  
  // 5. Save tracker and action
  await putChainObject(ctx, initiativeTracker);
  await putChainObject(ctx, initiativeAction);
}

export async function advanceTurn(
  ctx: GalaChainContext,
  dto: AdvanceTurnDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Get current initiative tracker
  const trackerKey = InitiativeTracker.getCompositeKeyFromParts(
    InitiativeTracker.INDEX_KEY,
    [dto.encounterId]
  );
  const tracker = await getObjectByKey(ctx, InitiativeTracker, trackerKey);
  
  if (!tracker.isActive) {
    throw new Error("Initiative is not currently active");
  }
  
  // 2. Get all active participants in initiative order
  const participants = await getObjectsByPartialCompositeKey(
    ctx,
    EncounterParticipant.INDEX_KEY,
    [dto.encounterId],
    EncounterParticipant
  );
  
  const activeParticipants = participants
    .filter(p => p.isActive && !p.isDefeated)
    .sort((a, b) => {
      if (a.initiative !== b.initiative) {
        return b.initiative - a.initiative;
      }
      return b.initiativeBonus - a.initiativeBonus;
    });
  
  // 3. Advance to next participant
  let nextTurnIndex = tracker.currentTurnIndex + 1;
  let newRound = tracker.currentRound;
  let roundStartTime = tracker.roundStartTime;
  
  // Check if we need to start a new round
  if (nextTurnIndex >= activeParticipants.length) {
    nextTurnIndex = 0;
    newRound = tracker.currentRound + 1;
    roundStartTime = currentTime;
  }
  
  const nextParticipant = activeParticipants[nextTurnIndex];
  
  // 4. Update initiative tracker
  const updatedTracker = await createValidChainObject(InitiativeTracker, {
    ...tracker,
    currentRound: newRound,
    currentTurnParticipant: nextParticipant.participantId,
    currentTurnIndex: nextTurnIndex,
    turnStartTime: currentTime,
    roundStartTime: roundStartTime,
    lastUpdated: currentTime
  });
  
  // 5. Create encounter action for turn advance
  const turnAction = await createValidChainObject(EncounterAction, {
    encounterId: dto.encounterId,
    timestamp: paddedTime,
    txId: txId,
    actingParticipant: "GM", // System action
    actionType: "turn_advance",
    description: newRound > tracker.currentRound 
      ? `Round ${newRound} begins - ${nextParticipant.participantId}'s turn`
      : `${nextParticipant.participantId}'s turn`,
    roundNumber: newRound,
    actionData: {
      previousParticipant: tracker.currentTurnParticipant,
      nextParticipant: nextParticipant.participantId,
      roundChanged: newRound > tracker.currentRound
    },
    performedAt: currentTime
  });
  
  // 6. Save updated tracker and action
  await putChainObject(ctx, updatedTracker);
  await putChainObject(ctx, turnAction);
}