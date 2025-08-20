import { Evaluate, GalaContract, GalaChainContext, Submit } from "@gala-chain/chaincode";
import { plainToInstance } from "class-transformer";
import { Info } from "fabric-contract-api";

import { version } from "../../package.json";
import {
  createWeaponData,
  createArmorData,
  createSkillData,
  createBackgroundData,
  createFeatData,
  createSpellData,
  updateWeaponData,
  updateArmorData,
  updateSkillData,
  updateBackgroundData,
  updateFeatData,
  updateSpellData,
  deleteWeaponData,
  deleteArmorData,
  deleteSkillData,
  deleteBackgroundData,
  deleteFeatData,
  deleteSpellData,
  getWeaponData,
  getArmorData,
  getSkillData,
  getBackgroundData,
  getFeatData,
  getSpellData,
  listWeaponData,
  listArmorData,
  listSkillData,
  listBackgroundData,
  listFeatData,
  listSpellData
} from "./reference";
import {
  CreateWeaponDataDto,
  CreateArmorDataDto,
  CreateSkillDataDto,
  CreateBackgroundDataDto,
  CreateFeatDataDto,
  CreateSpellDataDto,
  UpdateWeaponDataDto,
  UpdateArmorDataDto,
  UpdateSkillDataDto,
  UpdateBackgroundDataDto,
  UpdateFeatDataDto,
  UpdateSpellDataDto,
  DeleteReferenceDataDto,
  GetReferenceDataDto,
  ListReferenceDataDto,
  WeaponData,
  ArmorData,
  SkillData,
  BackgroundData,
  FeatData,
  SpellData
} from "./types";

const curatorOrgMsp = process.env.CURATOR_ORG_MSP ?? "CuratorOrg";

@Info({ title: "Rpg", description: "Contract for role playing games" })
export default class RpgContract extends GalaContract {
  constructor() {
    super("Rpg", version);
  }

  // Weapon Data CRUD
  @Submit({
    in: CreateWeaponDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateWeaponData(ctx: GalaChainContext, dto: CreateWeaponDataDto): Promise<void> {
    await createWeaponData(ctx, dto);
  }

  @Submit({
    in: UpdateWeaponDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateWeaponData(ctx: GalaChainContext, dto: UpdateWeaponDataDto): Promise<void> {
    await updateWeaponData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteWeaponData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteWeaponData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: WeaponData
  })
  public async GetWeaponData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<WeaponData> {
    return await getWeaponData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: WeaponData
  })
  public async ListWeaponData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<WeaponData[]> {
    return await listWeaponData(ctx, dto);
  }

  // Armor Data CRUD
  @Submit({
    in: CreateArmorDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateArmorData(ctx: GalaChainContext, dto: CreateArmorDataDto): Promise<void> {
    await createArmorData(ctx, dto);
  }

  @Submit({
    in: UpdateArmorDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateArmorData(ctx: GalaChainContext, dto: UpdateArmorDataDto): Promise<void> {
    await updateArmorData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteArmorData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteArmorData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: ArmorData
  })
  public async GetArmorData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<ArmorData> {
    return await getArmorData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: ArmorData
  })
  public async ListArmorData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<ArmorData[]> {
    return await listArmorData(ctx, dto);
  }

  // Skill Data CRUD
  @Submit({
    in: CreateSkillDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateSkillData(ctx: GalaChainContext, dto: CreateSkillDataDto): Promise<void> {
    await createSkillData(ctx, dto);
  }

  @Submit({
    in: UpdateSkillDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateSkillData(ctx: GalaChainContext, dto: UpdateSkillDataDto): Promise<void> {
    await updateSkillData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteSkillData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteSkillData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: SkillData
  })
  public async GetSkillData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<SkillData> {
    return await getSkillData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: SkillData
  })
  public async ListSkillData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<SkillData[]> {
    return await listSkillData(ctx, dto);
  }

  // Background Data CRUD
  @Submit({
    in: CreateBackgroundDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateBackgroundData(ctx: GalaChainContext, dto: CreateBackgroundDataDto): Promise<void> {
    await createBackgroundData(ctx, dto);
  }

  @Submit({
    in: UpdateBackgroundDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateBackgroundData(ctx: GalaChainContext, dto: UpdateBackgroundDataDto): Promise<void> {
    await updateBackgroundData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteBackgroundData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteBackgroundData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: BackgroundData
  })
  public async GetBackgroundData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<BackgroundData> {
    return await getBackgroundData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: BackgroundData
  })
  public async ListBackgroundData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<BackgroundData[]> {
    return await listBackgroundData(ctx, dto);
  }

  // Feat Data CRUD
  @Submit({
    in: CreateFeatDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateFeatData(ctx: GalaChainContext, dto: CreateFeatDataDto): Promise<void> {
    await createFeatData(ctx, dto);
  }

  @Submit({
    in: UpdateFeatDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateFeatData(ctx: GalaChainContext, dto: UpdateFeatDataDto): Promise<void> {
    await updateFeatData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteFeatData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteFeatData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: FeatData
  })
  public async GetFeatData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<FeatData> {
    return await getFeatData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: FeatData
  })
  public async ListFeatData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<FeatData[]> {
    return await listFeatData(ctx, dto);
  }

  // Spell Data CRUD
  @Submit({
    in: CreateSpellDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async CreateSpellData(ctx: GalaChainContext, dto: CreateSpellDataDto): Promise<void> {
    await createSpellData(ctx, dto);
  }

  @Submit({
    in: UpdateSpellDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async UpdateSpellData(ctx: GalaChainContext, dto: UpdateSpellDataDto): Promise<void> {
    await updateSpellData(ctx, dto);
  }

  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: [curatorOrgMsp]
  })
  public async DeleteSpellData(ctx: GalaChainContext, dto: DeleteReferenceDataDto): Promise<void> {
    await deleteSpellData(ctx, dto);
  }

  @Evaluate({
    in: GetReferenceDataDto,
    out: SpellData
  })
  public async GetSpellData(ctx: GalaChainContext, dto: GetReferenceDataDto): Promise<SpellData> {
    return await getSpellData(ctx, dto);
  }

  @Evaluate({
    in: ListReferenceDataDto,
    out: SpellData
  })
  public async ListSpellData(ctx: GalaChainContext, dto: ListReferenceDataDto): Promise<SpellData[]> {
    return await listSpellData(ctx, dto);
  }
}
