import { createValidDTO } from "@gala-chain/api";
import {
  GalaChainContext,
  getObjectsByKeys,
  getObjectsByPartialCompositeKey,
  takeUntilUndefined
} from "@gala-chain/chaincode";

import { ClassData, ClassResDto, TraitData } from "../types";

export interface FetchClassDataInput {
  class?: string | undefined;
}

export async function fetchClassData(ctx: GalaChainContext, data: FetchClassDataInput) {
  const queryPararms = takeUntilUndefined(data.class);

  const classQuery = await getObjectsByPartialCompositeKey(ctx, ClassData.INDEX_KEY, queryPararms, ClassData);

  const response: ClassResDto[] = [];

  for (const characterClass of classQuery) {
    const traitData: TraitData[] = await getObjectsByKeys(ctx, TraitData, characterClass.traits);

    const characterclass = await createValidDTO(ClassResDto, {
      ...characterClass,
      traits: traitData
    });
  }
}
