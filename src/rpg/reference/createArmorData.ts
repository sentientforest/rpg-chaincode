import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import { ArmorData, CreateArmorDataDto } from "../types";
import { CurrencyUtils } from "../utils/CurrencyUtils";

export async function createArmorData(
  ctx: GalaChainContext,
  dto: CreateArmorDataDto
): Promise<void> {
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
  
  // Create the armor data object
  const armorData = await createValidChainObject(ArmorData, {
    name: dto.name,
    category: dto.category,
    price: priceInCopper,
    acBonus: dto.acBonus,
    dexCap: dto.dexCap,
    checkPenalty: dto.checkPenalty,
    speedPenalty: dto.speedPenalty,
    bulk: bulk,
    group: dto.group,
    traits: dto.traits,
    description: dto.description
  });
  
  // Save to chain
  await putChainObject(ctx, armorData);
}