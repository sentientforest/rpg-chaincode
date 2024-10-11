import { ChainObject } from "@gala-chain/api";
import { GalaChainContext, deleteChainObject, getObjectsByKeys } from "@gala-chain/chaincode";

import { TraitData, TraitDeleteDto } from "../types";

export async function deleteTraitData(ctx: GalaChainContext, dto: TraitDeleteDto) {
  const chainKeys = dto.names.map((name) => {
    return ChainObject.getCompositeKeyFromParts(TraitData.INDEX_KEY, [name]);
  });

  const data = await getObjectsByKeys(ctx, TraitData, chainKeys);

  for (const trait of data) {
    await deleteChainObject(ctx, trait);
  }

  return data;
}
