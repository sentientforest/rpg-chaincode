import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import { AddSkillProficiencyDto, CharacterEntity, CharacterSkillProficiency, SkillData } from "../types";

export async function addSkillProficiency(ctx: GalaChainContext, dto: AddSkillProficiencyDto): Promise<void> {
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(CharacterEntity.INDEX_KEY, [
    dto.characterName,
    ctx.callingUser
  ]);
  await getObjectByKey(ctx, CharacterEntity, characterKey);

  // 2. Verify skill exists in reference data
  const skillKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [dto.skillName]);
  await getObjectByKey(ctx, SkillData, skillKey);

  // 3. Create or update skill proficiency
  const skillProficiency = await createValidChainObject(CharacterSkillProficiency, {
    entity: dto.characterName,
    skillName: dto.skillName,
    proficiencyRank: dto.proficiencyRank,
    source: dto.source
  });

  // 4. Save to chain
  await putChainObject(ctx, skillProficiency);
}
