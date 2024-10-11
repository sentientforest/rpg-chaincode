import { ChainObject } from "@gala-chain/api";
import { GalaChainContext, deleteChainObject, getObjectsByKeys } from "@gala-chain/chaincode";

import { AncestryData, AncestryDeleteDto } from "../types";

export async function deleteAncestryData(
  ctx: GalaChainContext,
  dto: AncestryDeleteDto
): Promise<AncestryData[]> {
  const chainKeys = dto.names.map((name) => {
    return ChainObject.getCompositeKeyFromParts(AncestryData.INDEX_KEY, [name]);
  });

  const data: AncestryData[] = await getObjectsByKeys(ctx, AncestryData, chainKeys);

  for (const ancestry of data) {
    await deleteChainObject(ctx, ancestry);
  }

  return data;
}
