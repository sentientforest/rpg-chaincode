import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { AddFeatDto, CharacterEntity, CharacterFeat, FeatData } from "../types";

export async function addFeat(ctx: GalaChainContext, dto: AddFeatDto): Promise<void> {
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Verify feat exists in reference data
  const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [dto.featName]);
  await getObjectByKey(ctx, FeatData, featKey);

  // 3. Create feat entry
  const characterFeat = await createValidChainObject(CharacterFeat, {
    entity: dto.characterName,
    featName: dto.featName,
    featType: dto.featType,
    source: dto.source,
    level: dto.level
  });

  // 4. Save to chain
  await putChainObject(ctx, characterFeat);
}
