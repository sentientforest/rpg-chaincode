import { createValidDTO } from "@gala-chain/api";
import {
  GalaChainContext,
  getObjectsByKeys,
  getObjectsByPartialCompositeKey,
  getObjectsByPartialCompositeKeyWithPagination,
  takeUntilUndefined
} from "@gala-chain/chaincode";

import { AncestryData, AncestryResDto, HeritageData, TraitData } from "../types";

export interface FetchAncestryOptionsInput {
  ancestry?: string | undefined;
}

/**
 * @description
 *
 * Fetch all character Ancestry options from on-chain World State.
 * For each Ancestry, also lookup and return any Heritage options.
 *
 * Does not support pagination - this implementation assumes fewer
 * ancestries than the configured Hyperledger Fabric maximum
 * results set value for partial composite key queries
 * (Default: 100,000);
 *
 * @param ctx
 * @param data
 * @returns
 */
export async function fetchAncestryOptions(ctx: GalaChainContext, data: FetchAncestryOptionsInput) {
  const queryParams = takeUntilUndefined(data.ancestry);

  const ancestryQuery = await getObjectsByPartialCompositeKey(
    ctx,
    AncestryData.INDEX_KEY,
    queryParams,
    AncestryData
  );

  const response: AncestryResDto[] = [];

  for (const ancestry of ancestryQuery) {
    const heritageData: HeritageData[] = await getObjectsByPartialCompositeKey(
      ctx,
      HeritageData.INDEX_KEY,
      [ancestry.name],
      HeritageData
    );

    const traitData: TraitData[] = await getObjectsByKeys(ctx, TraitData, ancestry.traits);

    const ancestryRes = await createValidDTO(AncestryResDto, {
      ...ancestry,
      traits: traitData,
      heritageOptions: heritageData
    });

    response.push(ancestryRes);
  }

  return response;
}
