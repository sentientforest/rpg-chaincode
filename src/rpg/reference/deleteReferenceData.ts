import { GalaChainContext, deleteChainObject, getObjectByKey } from "@gala-chain/chaincode";

import { 
  ArmorData, 
  BackgroundData, 
  DeleteReferenceDataDto, 
  FeatData, 
  SkillData, 
  SpellData, 
  WeaponData 
} from "../types";

export async function deleteWeaponData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const weaponKey = WeaponData.getCompositeKeyFromParts(WeaponData.INDEX_KEY, [dto.name]);
  const weapon = await getObjectByKey(ctx, WeaponData, weaponKey);
  await deleteChainObject(ctx, weapon);
}

export async function deleteArmorData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const armorKey = ArmorData.getCompositeKeyFromParts(ArmorData.INDEX_KEY, [dto.name]);
  const armor = await getObjectByKey(ctx, ArmorData, armorKey);
  await deleteChainObject(ctx, armor);
}

export async function deleteSkillData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const skillKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [dto.name]);
  const skill = await getObjectByKey(ctx, SkillData, skillKey);
  await deleteChainObject(ctx, skill);
}

export async function deleteBackgroundData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const backgroundKey = BackgroundData.getCompositeKeyFromParts(BackgroundData.INDEX_KEY, [dto.name]);
  const background = await getObjectByKey(ctx, BackgroundData, backgroundKey);
  await deleteChainObject(ctx, background);
}

export async function deleteFeatData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [dto.name]);
  const feat = await getObjectByKey(ctx, FeatData, featKey);
  await deleteChainObject(ctx, feat);
}

export async function deleteSpellData(
  ctx: GalaChainContext,
  dto: DeleteReferenceDataDto
): Promise<void> {
  const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [dto.name]);
  const spell = await getObjectByKey(ctx, SpellData, spellKey);
  await deleteChainObject(ctx, spell);
}