import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CharacterEntity, EncounterAction, MakeSavingThrowDto, SavingThrow } from "../types";
import { DiceUtils } from "../utils/DiceUtils";

export async function makeSavingThrow(ctx: GalaChainContext, dto: MakeSavingThrowDto): Promise<SavingThrow> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify character exists
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Roll d20
  const rollResult = DiceUtils.executeRoll("1d20", dto.randomSeed);
  const d20Roll = rollResult.total;
  const totalResult = d20Roll + dto.modifier;

  // 3. Determine success/failure
  const isSuccess = totalResult >= dto.dc;
  const isCriticalSuccess = d20Roll === 20 || (isSuccess && totalResult >= dto.dc + 10);
  const isCriticalFailure = d20Roll === 1 || (!isSuccess && totalResult <= dto.dc - 10);

  // 4. Determine consequence based on result
  let consequence: string;
  if (isCriticalSuccess) {
    consequence = "Critical success - no effect and potential bonus";
  } else if (isSuccess) {
    consequence = "Success - reduced or no effect";
  } else if (isCriticalFailure) {
    consequence = "Critical failure - maximum effect";
  } else {
    consequence = "Failure - full effect";
  }

  // 5. Create saving throw record
  const savingThrow = await createValidChainObject(SavingThrow, {
    characterName: dto.characterName,
    timestamp: paddedTime,
    saveId: dto.saveId,
    saveType: dto.saveType,
    dc: dto.dc,
    rollResult: d20Roll,
    modifier: dto.modifier,
    totalResult: totalResult,
    isSuccess: isSuccess,
    isCriticalSuccess: isCriticalSuccess,
    isCriticalFailure: isCriticalFailure,
    purpose: dto.purpose,
    sourceEffect: dto.sourceEffect,
    consequence: consequence,
    encounterId: dto.encounterId,
    performedAt: currentTime
  });

  // 6. If made during encounter, create encounter action
  if (dto.encounterId) {
    const encounterAction = await createValidChainObject(EncounterAction, {
      encounterId: dto.encounterId,
      timestamp: paddedTime,
      txId: txId + "_encounter",
      actingParticipant: dto.characterName,
      actionType: "saving_throw",
      description: `${dto.saveType.toUpperCase()} save vs DC ${dto.dc} (${dto.purpose})`,
      diceRolls: [d20Roll],
      totalResult: totalResult,
      outcome: isCriticalSuccess
        ? "critical_success"
        : isSuccess
          ? "success"
          : isCriticalFailure
            ? "critical_failure"
            : "failure",
      actionData: {
        saveType: dto.saveType,
        dc: dto.dc,
        modifier: dto.modifier,
        purpose: dto.purpose
      },
      performedAt: currentTime
    });

    await putChainObject(ctx, encounterAction);
  }

  // 7. Save saving throw
  await putChainObject(ctx, savingThrow);

  return savingThrow;
}
