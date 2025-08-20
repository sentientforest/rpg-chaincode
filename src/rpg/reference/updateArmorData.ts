import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import { ArmorData, UpdateArmorDataDto } from "../types";
import { CurrencyUtils } from "../utils/CurrencyUtils";

export async function updateArmorData(
  ctx: GalaChainContext,
  dto: UpdateArmorDataDto
): Promise<void> {
  // Get the existing armor data
  const armorKey = ArmorData.getCompositeKeyFromParts(ArmorData.INDEX_KEY, [dto.name]);
  const existingArmor = await getObjectByKey(ctx, ArmorData, armorKey);
  
  // Update fields that are provided
  const updates: Partial<ArmorData> = {};
  
  if (dto.category !== undefined) updates.category = dto.category;
  if (dto.price !== undefined) {
    updates.price = CurrencyUtils.toCopper(dto.price);
  }
  if (dto.acBonus !== undefined) updates.acBonus = dto.acBonus;
  if (dto.dexCap !== undefined) updates.dexCap = dto.dexCap;
  if (dto.checkPenalty !== undefined) updates.checkPenalty = dto.checkPenalty;
  if (dto.speedPenalty !== undefined) updates.speedPenalty = dto.speedPenalty;
  if (dto.bulk !== undefined || dto.bulkSpecial !== undefined) {
    let bulk: BigNumber;
    if (dto.bulkSpecial) {
      if (dto.bulkSpecial === "L") {
        bulk = new BigNumber(0.1);
      } else if (dto.bulkSpecial === "—" || dto.bulkSpecial === "-") {
        bulk = new BigNumber(0);
      } else {
        bulk = new BigNumber(0);
      }
    } else {
      bulk = new BigNumber(dto.bulk || 0);
    }
    updates.bulk = bulk;
  }
  if (dto.group !== undefined) updates.group = dto.group;
  if (dto.traits !== undefined) updates.traits = dto.traits;
  if (dto.description !== undefined) updates.description = dto.description;
  
  // Create updated armor data
  const updatedArmor = await createValidChainObject(ArmorData, {
    ...existingArmor,
    ...updates
  });
  
  // Save to chain
  await putChainObject(ctx, updatedArmor);
}