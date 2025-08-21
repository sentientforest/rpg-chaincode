import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import {
  RollDiceDto,
  DiceRoll
} from "../types";
import { DiceUtils } from "../utils/DiceUtils";

export async function rollDice(
  ctx: GalaChainContext,
  dto: RollDiceDto
): Promise<DiceRoll> {
  const currentTime = ctx.txUnixTime;
  const paddedTime = currentTime.toString().padStart(10, '0');
  
  // 1. Execute the dice roll
  const rollResult = DiceUtils.executeRoll(dto.diceExpression, dto.randomSeed);
  
  // 2. Determine outcome if DC was provided
  let outcome: string | undefined;
  if (dto.targetDC) {
    const dc = parseInt(dto.targetDC);
    if (!isNaN(dc)) {
      outcome = DiceUtils.determineOutcome(rollResult.total + dto.modifier, dc);
      
      // Check for natural 20/1 on d20 rolls
      const naturalResult = DiceUtils.checkNaturalRoll(rollResult.individualRolls, 20);
      if (naturalResult === "natural_20" && outcome === "success") {
        outcome = "critical_success";
      } else if (naturalResult === "natural_1" && outcome === "failure") {
        outcome = "critical_failure";
      }
    }
  }
  
  // 3. Create dice roll record
  const diceRoll = await createValidChainObject(DiceRoll, {
    rollId: dto.rollId,
    timestamp: paddedTime,
    roller: ctx.callingUser,
    rollType: dto.rollType,
    diceExpression: dto.diceExpression,
    individualRolls: rollResult.individualRolls,
    modifier: dto.modifier,
    totalResult: rollResult.total + dto.modifier,
    randomSeed: dto.randomSeed,
    purpose: dto.purpose,
    targetDC: dto.targetDC,
    outcome,
    performedAt: currentTime
  });
  
  // 4. Save dice roll
  await putChainObject(ctx, diceRoll);
  
  return diceRoll;
}