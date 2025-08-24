import {
  GalaChainContext,
  getObjectByKey,
  getObjectsByPartialCompositeKey,
  getObjectsByPartialCompositeKeyWithPagination
} from "@gala-chain/chaincode";

import {
  ArmorData,
  BackgroundData,
  FeatData,
  GetReferenceDataDto,
  ListReferenceDataDto,
  SkillData,
  SpellData,
  WeaponData
} from "../types";

// Single item getters
export async function getWeaponData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<WeaponData> {
  const weaponKey = WeaponData.getCompositeKeyFromParts(WeaponData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, WeaponData, weaponKey);
}

export async function getArmorData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<ArmorData> {
  const armorKey = ArmorData.getCompositeKeyFromParts(ArmorData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, ArmorData, armorKey);
}

export async function getSkillData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<SkillData> {
  const skillKey = SkillData.getCompositeKeyFromParts(SkillData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, SkillData, skillKey);
}

export async function getBackgroundData(
  ctx: GalaChainContext,
  dto: GetReferenceDataDto
): Promise<BackgroundData> {
  const backgroundKey = BackgroundData.getCompositeKeyFromParts(BackgroundData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, BackgroundData, backgroundKey);
}

export async function getFeatData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<FeatData> {
  const featKey = FeatData.getCompositeKeyFromParts(FeatData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, FeatData, featKey);
}

export async function getSpellData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<SpellData> {
  const spellKey = SpellData.getCompositeKeyFromParts(SpellData.INDEX_KEY, [dto.name]);
  return await getObjectByKey(ctx, SpellData, spellKey);
}

// List all items
export async function listWeaponData(
  ctx: GalaChainContext,
  dto: ListReferenceDataDto
): Promise<WeaponData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      WeaponData.INDEX_KEY,
      [],
      WeaponData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, WeaponData.INDEX_KEY, [], WeaponData);
  }
}

export async function listArmorData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<ArmorData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      ArmorData.INDEX_KEY,
      [],
      ArmorData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, ArmorData.INDEX_KEY, [], ArmorData);
  }
}

export async function listSkillData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<SkillData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      SkillData.INDEX_KEY,
      [],
      SkillData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, SkillData.INDEX_KEY, [], SkillData);
  }
}

export async function listBackgroundData(
  ctx: GalaChainContext,
  dto: ListReferenceDataDto
): Promise<BackgroundData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      BackgroundData.INDEX_KEY,
      [],
      BackgroundData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, BackgroundData.INDEX_KEY, [], BackgroundData);
  }
}

export async function listFeatData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<FeatData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      FeatData.INDEX_KEY,
      [],
      FeatData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, FeatData.INDEX_KEY, [], FeatData);
  }
}

export async function listSpellData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<SpellData[]> {
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      SpellData.INDEX_KEY,
      [],
      SpellData,
      dto.bookmark,
      dto.limit
    );
    return result.results;
  } else {
    return await getObjectsByPartialCompositeKey(ctx, SpellData.INDEX_KEY, [], SpellData);
  }
}
