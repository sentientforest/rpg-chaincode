import { GalaChainContext, createValidChainObject, putChainObject } from "@gala-chain/chaincode";

import { AncestryData, AncestryDto, HeritageData } from "../types";

export async function saveAncestryData(ctx: GalaChainContext, dto: AncestryDto): Promise<AncestryData> {
  for (const heritage of dto.heritageOptions) {
    await putChainObject(ctx, heritage);
  }

  for (const trait of dto.traits) {
    await putChainObject(ctx, trait);
  }

  const ancestryData = await createValidChainObject(AncestryData, {
    ...dto,
    traits: dto.traits.map((t) => t.getCompositeKey())
  });

  await putChainObject(ctx, ancestryData);

  return ancestryData;
}
