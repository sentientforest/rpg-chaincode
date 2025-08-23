import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import { CreateWeaponDataDto, WeaponData } from "../types";
import { CurrencyUtils } from "../utils/CurrencyUtils";

export async function createWeaponData(ctx: GalaChainContext, dto: CreateWeaponDataDto): Promise<void> {
  // Convert price to copper pieces
  const priceInCopper = CurrencyUtils.toCopper(dto.price);

  // Handle bulk conversion
  let bulk: BigNumber;
  if (dto.bulkSpecial) {
    if (dto.bulkSpecial === "L") {
      bulk = new BigNumber(0.1); // Light = 0.1 bulk
    } else if (dto.bulkSpecial === "—" || dto.bulkSpecial === "-") {
      bulk = new BigNumber(0); // Negligible
    } else {
      bulk = new BigNumber(0);
    }
  } else {
    bulk = new BigNumber(dto.bulk || 0);
  }

  // Create the weapon data object
  const weaponData = await createValidChainObject(WeaponData, {
    name: dto.name,
    category: dto.category,
    group: dto.group,
    price: priceInCopper,
    damage: dto.damage,
    damageType: dto.damageType,
    traits: dto.traits,
    bulk: bulk,
    hands: dto.hands,
    range: dto.range,
    description: dto.description
  });

  // Save to chain
  await putChainObject(ctx, weaponData);
}
