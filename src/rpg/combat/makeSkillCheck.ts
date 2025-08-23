import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { CharacterEntity, EncounterAction, MakeSkillCheckDto, SkillCheck } from "../types";
import { DiceUtils } from "../utils/DiceUtils";

export async function makeSkillCheck(ctx: GalaChainContext, dto: MakeSkillCheckDto): Promise<SkillCheck> {
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

  // 3. Calculate total result
  const totalResult = d20Roll + dto.skillModifier + (dto.circumstanceBonus || 0) + (dto.itemBonus || 0);

  // 4. Determine success if DC is known
  let isSuccess: boolean | undefined;
  let degreeOfSuccess: string | undefined;
  let outcome: string | undefined;

  if (dto.dc !== undefined && !dto.isSecret) {
    isSuccess = totalResult >= dto.dc;

    if (d20Roll === 20 || (isSuccess && totalResult >= dto.dc + 10)) {
      degreeOfSuccess = "critical_success";
      outcome = "Exceptional result";
    } else if (isSuccess) {
      degreeOfSuccess = "success";
      outcome = "Successful attempt";
    } else if (d20Roll === 1 || totalResult <= dto.dc - 10) {
      degreeOfSuccess = "critical_failure";
      outcome = "Dramatic failure";
    } else {
      degreeOfSuccess = "failure";
      outcome = "Unsuccessful attempt";
    }
  }

  // 5. Create skill check record
  const skillCheck = await createValidChainObject(SkillCheck, {
    characterName: dto.characterName,
    timestamp: paddedTime,
    checkId: dto.checkId,
    skillName: dto.skillName,
    action: dto.action,
    dc: dto.dc,
    rollResult: d20Roll,
    skillModifier: dto.skillModifier,
    circumstanceBonus: dto.circumstanceBonus,
    itemBonus: dto.itemBonus,
    totalResult: totalResult,
    isSuccess: isSuccess,
    degreeOfSuccess: degreeOfSuccess,
    isSecret: dto.isSecret || false,
    assistedBy: dto.assistedBy,
    purpose: dto.purpose,
    outcome: outcome,
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
      actionType: "skill_check",
      description: `${dto.skillName.toUpperCase()} check${dto.action ? ` (${dto.action})` : ""} for ${dto.purpose}`,
      diceRolls: [d20Roll],
      totalResult: totalResult,
      outcome: degreeOfSuccess,
      actionData: {
        skillName: dto.skillName,
        action: dto.action,
        dc: dto.dc,
        modifier: dto.skillModifier,
        purpose: dto.purpose,
        isSecret: dto.isSecret
      },
      performedAt: currentTime
    });

    await putChainObject(ctx, encounterAction);
  }

  // 7. Save skill check
  await putChainObject(ctx, skillCheck);

  return skillCheck;
}
