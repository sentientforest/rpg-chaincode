import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import { CharacterEntity, CharacterEvent, CharacterState, UpdateCharacterStateDto } from "../types";

export async function updateCharacterState(
  ctx: GalaChainContext,
  dto: UpdateCharacterStateDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Get current character state
  const stateKey = CharacterState.getCompositeKeyFromParts(CharacterState.INDEX_KEY, [dto.characterName]);
  const currentState = await getObjectByKey(ctx, CharacterState, stateKey);

  // 3. Apply updates
  const updates: Partial<CharacterState> = {
    lastUpdated: currentTime
  };

  if (dto.currentHP !== undefined) {
    updates.currentHP = new BigNumber(dto.currentHP);
  }

  if (dto.temporaryHP !== undefined) {
    updates.temporaryHP = new BigNumber(dto.temporaryHP);
  }

  if (dto.heroPoints !== undefined) {
    updates.heroPoints = dto.heroPoints;
  }

  if (dto.focusPoints !== undefined) {
    updates.focusPoints = dto.focusPoints;
  }

  // Handle conditions - merge with existing or replace
  let newConditions = [...currentState.conditions];

  if (dto.conditions !== undefined) {
    // Add new conditions
    for (const condition of dto.conditions) {
      if (!newConditions.includes(condition)) {
        newConditions.push(condition);
      }
    }
  }

  if (dto.removeConditions !== undefined) {
    // Remove specified conditions
    newConditions = newConditions.filter((condition) => !dto.removeConditions!.includes(condition));
  }

  updates.conditions = newConditions;

  // 4. Create updated state
  const updatedState = await createValidChainObject(CharacterState, {
    ...currentState,
    ...updates
  });

  // 5. Create state update event
  const stateEvent = await createValidChainObject(CharacterEvent, {
    entity: dto.characterName,
    timestamp: paddedTime,
    txId: txId,
    eventType: "state_update",
    description: "Character state updated",
    eventData: {
      updates: updates,
      removedConditions: dto.removeConditions
    },
    isValid: true,
    triggeredBy: ctx.callingUser
  });

  // 6. Save changes
  await putChainObject(ctx, updatedState);
  await putChainObject(ctx, stateEvent);
}
