import { GalaChainContext, putChainObject } from "@gala-chain/chaincode";

import { TraitData, TraitDto } from "../types";

export async function saveTraitData(ctx: GalaChainContext, dto: TraitDto): Promise<TraitData[]> {
  for (const trait of dto.traits) {
    await putChainObject(ctx, trait);
  }

  return dto.traits;
}
