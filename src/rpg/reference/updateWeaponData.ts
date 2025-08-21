import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import { UpdateWeaponDataDto, WeaponData } from "../types";
import { CurrencyUtils } from "../utils/CurrencyUtils";

export async function updateWeaponData(
  ctx: GalaChainContext,
  dto: UpdateWeaponDataDto
): Promise<void> {
  // Get the existing weapon data
  const weaponKey = WeaponData.getCompositeKeyFromParts(WeaponData.INDEX_KEY, [dto.name]);
  const existingWeapon = await getObjectByKey(ctx, WeaponData, weaponKey);
  
  // Update fields that are provided
  const updates: Partial<WeaponData> = {};
  
  if (dto.category !== undefined) updates.category = dto.category;
  if (dto.group !== undefined) updates.group = dto.group;
  if (dto.price !== undefined) {
    updates.price = CurrencyUtils.toCopper(dto.price);
  }
  if (dto.damage !== undefined) updates.damage = dto.damage;
  if (dto.damageType !== undefined) updates.damageType = dto.damageType;
  if (dto.traits !== undefined) updates.traits = dto.traits;
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
  if (dto.hands !== undefined) updates.hands = dto.hands;
  if (dto.range !== undefined) updates.range = dto.range;
  if (dto.description !== undefined) updates.description = dto.description;
  
  // Create updated weapon data
  const updatedWeapon = await createValidChainObject(WeaponData, {
    ...existingWeapon,
    ...updates
  });
  
  // Save to chain
  await putChainObject(ctx, updatedWeapon);
}