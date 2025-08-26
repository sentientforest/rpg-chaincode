import {
  ChainClient,
  CommonContractAPI,
  GalaChainResponse,
  commonContractAPI
} from "@gala-chain/api";

// Import reference data DTOs and types for sub-task 0.1
import {
  // Weapon Data
  CreateWeaponDataDto,
  UpdateWeaponDataDto,
  DeleteReferenceDataDto,
  GetReferenceDataDto,
  ListReferenceDataDto,
  WeaponData,
  
  // Armor Data
  CreateArmorDataDto,
  UpdateArmorDataDto,
  ArmorData,
  
  // Skill Data
  CreateSkillDataDto,
  UpdateSkillDataDto,
  SkillData,
  
  // Background Data
  CreateBackgroundDataDto,
  UpdateBackgroundDataDto,
  BackgroundData,
  
  // Feat Data
  CreateFeatDataDto,
  UpdateFeatDataDto,
  FeatData,
  
  // Spell Data
  CreateSpellDataDto,
  UpdateSpellDataDto,
  SpellData
} from "../src/rpg/types";

// Sub-task 0.1: API interface for all reference data methods (30 methods total)
export interface RpgContractAPI {
  // Reference Data - Weapons (5 methods)
  CreateWeaponData(dto: CreateWeaponDataDto): Promise<GalaChainResponse<void>>;
  UpdateWeaponData(dto: UpdateWeaponDataDto): Promise<GalaChainResponse<void>>;
  DeleteWeaponData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetWeaponData(dto: GetReferenceDataDto): Promise<GalaChainResponse<WeaponData>>;
  ListWeaponData(dto: ListReferenceDataDto): Promise<GalaChainResponse<WeaponData[]>>;
  
  // Reference Data - Armor (5 methods)
  CreateArmorData(dto: CreateArmorDataDto): Promise<GalaChainResponse<void>>;
  UpdateArmorData(dto: UpdateArmorDataDto): Promise<GalaChainResponse<void>>;
  DeleteArmorData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetArmorData(dto: GetReferenceDataDto): Promise<GalaChainResponse<ArmorData>>;
  ListArmorData(dto: ListReferenceDataDto): Promise<GalaChainResponse<ArmorData[]>>;
  
  // Reference Data - Skills (5 methods)
  CreateSkillData(dto: CreateSkillDataDto): Promise<GalaChainResponse<void>>;
  UpdateSkillData(dto: UpdateSkillDataDto): Promise<GalaChainResponse<void>>;
  DeleteSkillData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetSkillData(dto: GetReferenceDataDto): Promise<GalaChainResponse<SkillData>>;
  ListSkillData(dto: ListReferenceDataDto): Promise<GalaChainResponse<SkillData[]>>;
  
  // Reference Data - Backgrounds (5 methods)
  CreateBackgroundData(dto: CreateBackgroundDataDto): Promise<GalaChainResponse<void>>;
  UpdateBackgroundData(dto: UpdateBackgroundDataDto): Promise<GalaChainResponse<void>>;
  DeleteBackgroundData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetBackgroundData(dto: GetReferenceDataDto): Promise<GalaChainResponse<BackgroundData>>;
  ListBackgroundData(dto: ListReferenceDataDto): Promise<GalaChainResponse<BackgroundData[]>>;
  
  // Reference Data - Feats (5 methods)
  CreateFeatData(dto: CreateFeatDataDto): Promise<GalaChainResponse<void>>;
  UpdateFeatData(dto: UpdateFeatDataDto): Promise<GalaChainResponse<void>>;
  DeleteFeatData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetFeatData(dto: GetReferenceDataDto): Promise<GalaChainResponse<FeatData>>;
  ListFeatData(dto: ListReferenceDataDto): Promise<GalaChainResponse<FeatData[]>>;
  
  // Reference Data - Spells (5 methods)
  CreateSpellData(dto: CreateSpellDataDto): Promise<GalaChainResponse<void>>;
  UpdateSpellData(dto: UpdateSpellDataDto): Promise<GalaChainResponse<void>>;
  DeleteSpellData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetSpellData(dto: GetReferenceDataDto): Promise<GalaChainResponse<SpellData>>;
  ListSpellData(dto: ListReferenceDataDto): Promise<GalaChainResponse<SpellData[]>>;
  
  // TODO: Add remaining methods in subsequent sub-tasks:
  // - Sub-task 0.2: Character CRUD methods
  // - Sub-task 0.3: Character management methods  
  // - Sub-task 0.4: Combat + advanced methods
}

// Sub-task 0.1: Implementation function for all reference data methods (30 methods total)
export function rpgContractAPI(client: ChainClient): RpgContractAPI & CommonContractAPI {
  return {
    // Include common contract API (GetContractAPI, DryRun, etc.)
    ...commonContractAPI(client),
    
    // Reference Data - Weapons (5 methods)
    CreateWeaponData(dto: CreateWeaponDataDto) {
      return client.submitTransaction("CreateWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateWeaponData(dto: UpdateWeaponDataDto) {
      return client.submitTransaction("UpdateWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteWeaponData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetWeaponData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetWeaponData", dto, WeaponData) as Promise<GalaChainResponse<WeaponData>>;
    },
    ListWeaponData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListWeaponData", dto) as Promise<GalaChainResponse<WeaponData[]>>;
    },
    
    // Reference Data - Armor (5 methods)
    CreateArmorData(dto: CreateArmorDataDto) {
      return client.submitTransaction("CreateArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateArmorData(dto: UpdateArmorDataDto) {
      return client.submitTransaction("UpdateArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteArmorData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetArmorData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetArmorData", dto, ArmorData) as Promise<GalaChainResponse<ArmorData>>;
    },
    ListArmorData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListArmorData", dto) as Promise<GalaChainResponse<ArmorData[]>>;
    },
    
    // Reference Data - Skills (5 methods)
    CreateSkillData(dto: CreateSkillDataDto) {
      return client.submitTransaction("CreateSkillData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateSkillData(dto: UpdateSkillDataDto) {
      return client.submitTransaction("UpdateSkillData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteSkillData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteSkillData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetSkillData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetSkillData", dto, SkillData) as Promise<GalaChainResponse<SkillData>>;
    },
    ListSkillData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListSkillData", dto) as Promise<GalaChainResponse<SkillData[]>>;
    },
    
    // Reference Data - Backgrounds (5 methods)
    CreateBackgroundData(dto: CreateBackgroundDataDto) {
      return client.submitTransaction("CreateBackgroundData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateBackgroundData(dto: UpdateBackgroundDataDto) {
      return client.submitTransaction("UpdateBackgroundData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteBackgroundData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteBackgroundData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetBackgroundData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetBackgroundData", dto, BackgroundData) as Promise<GalaChainResponse<BackgroundData>>;
    },
    ListBackgroundData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListBackgroundData", dto) as Promise<GalaChainResponse<BackgroundData[]>>;
    },
    
    // Reference Data - Feats (5 methods)
    CreateFeatData(dto: CreateFeatDataDto) {
      return client.submitTransaction("CreateFeatData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateFeatData(dto: UpdateFeatDataDto) {
      return client.submitTransaction("UpdateFeatData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteFeatData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteFeatData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetFeatData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetFeatData", dto, FeatData) as Promise<GalaChainResponse<FeatData>>;
    },
    ListFeatData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListFeatData", dto) as Promise<GalaChainResponse<FeatData[]>>;
    },
    
    // Reference Data - Spells (5 methods)
    CreateSpellData(dto: CreateSpellDataDto) {
      return client.submitTransaction("CreateSpellData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateSpellData(dto: UpdateSpellDataDto) {
      return client.submitTransaction("UpdateSpellData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteSpellData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteSpellData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetSpellData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetSpellData", dto, SpellData) as Promise<GalaChainResponse<SpellData>>;
    },
    ListSpellData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListSpellData", dto) as Promise<GalaChainResponse<SpellData[]>>;
    }
  };
}