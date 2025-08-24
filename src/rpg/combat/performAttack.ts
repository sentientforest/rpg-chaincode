import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import {
  CombatAction,
  EncounterAction,
  EncounterEntity,
  EncounterParticipant,
  PerformAttackDto
} from "../types";
import { DiceUtils } from "../utils/DiceUtils";

export async function performAttack(ctx: GalaChainContext, dto: PerformAttackDto): Promise<CombatAction> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  const paddedTime = currentTime.toString().padStart(10, "0");

  // 1. Verify encounter exists and is active
  const encounterKey = EncounterEntity.getCompositeKeyFromParts(
    EncounterEntity.INDEX_KEY,
    [dto.encounterId.split("|")[0], dto.encounterId] // Assuming campaignId|encounterId format
  );
  const encounter = await getObjectByKey(ctx, EncounterEntity, encounterKey);

  if (encounter.status !== "active") {
    throw new Error("Cannot perform attacks in non-active encounters");
  }

  // 2. Verify both participants exist in encounter
  const attackerKey = EncounterParticipant.getCompositeKeyFromParts(EncounterParticipant.INDEX_KEY, [
    dto.encounterId,
    dto.attackerId
  ]);
  const attacker = await getObjectByKey(ctx, EncounterParticipant, attackerKey);

  const defenderKey = EncounterParticipant.getCompositeKeyFromParts(EncounterParticipant.INDEX_KEY, [
    dto.encounterId,
    dto.defenderId
  ]);
  const defender = await getObjectByKey(ctx, EncounterParticipant, defenderKey);

  if (!attacker.isActive || attacker.isDefeated) {
    throw new Error("Attacker is not active or is defeated");
  }

  if (!defender.isActive || defender.isDefeated) {
    throw new Error("Target is not active or is defeated");
  }

  // 3. Roll attack
  let attackRoll: number;
  if (dto.hasAdvantage) {
    // Roll twice, take higher
    const roll1 = DiceUtils.executeRoll("1d20", dto.randomSeed + "_1");
    const roll2 = DiceUtils.executeRoll("1d20", dto.randomSeed + "_2");
    attackRoll = Math.max(roll1.total, roll2.total);
  } else if (dto.hasDisadvantage) {
    // Roll twice, take lower
    const roll1 = DiceUtils.executeRoll("1d20", dto.randomSeed + "_1");
    const roll2 = DiceUtils.executeRoll("1d20", dto.randomSeed + "_2");
    attackRoll = Math.min(roll1.total, roll2.total);
  } else {
    const roll = DiceUtils.executeRoll("1d20", dto.randomSeed);
    attackRoll = roll.total;
  }

  const totalAttack = attackRoll + dto.attackBonus;

  // 4. Determine hit/miss
  const isHit = totalAttack >= dto.targetAC;
  const isCritical = attackRoll === 20 || (isHit && totalAttack >= dto.targetAC + 10);
  const isCriticalMiss = attackRoll === 1 || (!isHit && totalAttack <= dto.targetAC - 10);

  // 5. Calculate damage if hit
  let damageRolls: number[] | undefined;
  let totalDamage: number | undefined;
  let finalDamage: number | undefined;

  if (isHit && dto.damageExpression) {
    const damageResult = DiceUtils.executeRoll(dto.damageExpression, dto.randomSeed + "_damage");
    damageRolls = damageResult.individualRolls;
    totalDamage = damageResult.total;

    // Double damage on critical hit
    if (isCritical) {
      totalDamage *= 2;
    }

    // Apply damage reduction (simplified - would need resistance/immunity lookup)
    const damageReduction = 0; // TODO: Implement resistance/immunity system
    finalDamage = Math.max(0, totalDamage - damageReduction);
  }

  // 6. Create combat action record
  const combatAction = await createValidChainObject(CombatAction, {
    encounterId: dto.encounterId,
    timestamp: paddedTime,
    actionId: txId,
    attackerId: dto.attackerId,
    defenderId: dto.defenderId,
    actionType: dto.actionType,
    weaponUsed: dto.weaponUsed,
    attackRoll: attackRoll,
    attackBonus: dto.attackBonus,
    targetAC: dto.targetAC,
    isHit: isHit,
    isCritical: isCritical,
    damageRolls: damageRolls,
    totalDamage: totalDamage,
    damageType: dto.damageType,
    damageReduction: 0,
    finalDamage: finalDamage,
    appliedEffects: [], // TODO: Implement weapon effects
    roundNumber: 1, // TODO: Get from initiative tracker
    performedAt: currentTime
  });

  // 7. Create encounter action for the attack
  const encounterAction = await createValidChainObject(EncounterAction, {
    encounterId: dto.encounterId,
    timestamp: paddedTime,
    txId: txId + "_encounter",
    actingParticipant: dto.attackerId,
    actionType: dto.actionType,
    description: `${dto.actionType} against ${dto.defenderId}${dto.weaponUsed ? ` with ${dto.weaponUsed}` : ""}`,
    targetParticipant: dto.defenderId,
    roundNumber: 1,
    diceRolls: [attackRoll, ...(damageRolls || [])],
    totalResult: totalAttack,
    outcome: isCritical
      ? "critical_success"
      : isHit
        ? "success"
        : isCriticalMiss
          ? "critical_failure"
          : "failure",
    actionData: {
      attackRoll,
      attackBonus: dto.attackBonus,
      targetAC: dto.targetAC,
      damage: finalDamage,
      damageType: dto.damageType
    },
    performedAt: currentTime
  });

  // 8. Save records
  await putChainObject(ctx, combatAction);
  await putChainObject(ctx, encounterAction);

  return combatAction;
}
