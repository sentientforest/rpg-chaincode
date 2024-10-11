import {
  GalaChainContext,
  getObjectsByPartialCompositeKeyWithPagination,
  takeUntilUndefined
} from "@gala-chain/chaincode";

import { TraitData } from "../types";

export interface FetchTraitsInput {
  trait?: string | undefined;
  bookmark: string | undefined;
  limit: number | undefined;
}

export interface FetchTraitsOutput {
  traits: TraitData[];
  bookmark: string;
}

export async function fetchTraits(ctx: GalaChainContext, data: FetchTraitsInput): Promise<FetchTraitsOutput> {
  const queryParams = takeUntilUndefined(data.trait);

  const traitQuery = await getObjectsByPartialCompositeKeyWithPagination(
    ctx,
    TraitData.INDEX_KEY,
    queryParams,
    TraitData,
    data.bookmark,
    data.limit
  );

  const response = {
    traits: traitQuery.results,
    bookmark: traitQuery.metadata.bookmark
  };

  return response;
}
