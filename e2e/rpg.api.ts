import {
  ChainClient,
  CommonContractAPI,
  GalaChainResponse,
  commonContractAPI
} from "@gala-chain/api";

// Import DTOs and types for sub-tasks 0.1 + 0.2
import {
  // Reference Data - Weapons
  CreateWeaponDataDto,
  UpdateWeaponDataDto,
  DeleteReferenceDataDto,
  GetReferenceDataDto,
  ListReferenceDataDto,
  WeaponData,
  
  // Reference Data - Armor
  CreateArmorDataDto,
  UpdateArmorDataDto,
  ArmorData,
  
  // Reference Data - Skills
  CreateSkillDataDto,
  UpdateSkillDataDto,
  SkillData,
  
  // Reference Data - Backgrounds
  CreateBackgroundDataDto,
  UpdateBackgroundDataDto,
  BackgroundData,
  
  // Reference Data - Feats
  CreateFeatDataDto,
  UpdateFeatDataDto,
  FeatData,
  
  // Reference Data - Spells
  CreateSpellDataDto,
  UpdateSpellDataDto,
  SpellData,
  
  // Character CRUD - Sub-task 0.2 (7 methods)
  CreateCharacterDto,
  GetCharacterDto,
  ListCharactersDto,
  CharacterEntity,
  CharacterSheetDto,
  LevelUpCharacterDto,
  UpdateCharacterStateDto,
  ValidateCharacterDto,
  ValidationResultDto,
  GetCharacterHistoryDto,
  
  // Character Management - Sub-task 0.3 (5 methods)
  AddEquipmentDto,
  EquipItemDto,
  AddSkillProficiencyDto,
  AddFeatDto,
  AddSpellDto,
  
  // Combat + Advanced - Sub-task 0.4 (8 methods)
  CreateEncounterDto,
  RollDiceDto,
  DiceRoll,
  CreatePartyDto,
  CastSpellDto,
  CastSpellAction,
  PerformAttackDto,
  CombatAction,
  ApplyStatusEffectDto,
  MakeSavingThrowDto,
  SavingThrow,
  MakeSkillCheckDto,
  SkillCheck
} from "../src/rpg/types";

// Sub-tasks 0.1 + 0.2 + 0.3 + 0.4: Complete API interface for all RPG contract methods (50 methods total)
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
  
  // Character CRUD - Sub-task 0.2 (7 methods)
  CreateCharacter(dto: CreateCharacterDto): Promise<GalaChainResponse<void>>;
  GetCharacterSheet(dto: GetCharacterDto): Promise<GalaChainResponse<CharacterSheetDto>>;
  ListCharacters(dto: ListCharactersDto): Promise<GalaChainResponse<CharacterEntity[]>>;
  LevelUpCharacter(dto: LevelUpCharacterDto): Promise<GalaChainResponse<void>>;
  UpdateCharacterState(dto: UpdateCharacterStateDto): Promise<GalaChainResponse<void>>;
  ValidateCharacter(dto: ValidateCharacterDto): Promise<GalaChainResponse<ValidationResultDto>>;
  GetCharacterHistory(dto: GetCharacterHistoryDto): Promise<GalaChainResponse<any>>;
  
  // Character Management - Sub-task 0.3 (5 methods)
  AddEquipment(dto: AddEquipmentDto): Promise<GalaChainResponse<void>>;
  EquipItem(dto: EquipItemDto): Promise<GalaChainResponse<void>>;
  AddSkillProficiency(dto: AddSkillProficiencyDto): Promise<GalaChainResponse<void>>;
  AddFeat(dto: AddFeatDto): Promise<GalaChainResponse<void>>;
  AddSpell(dto: AddSpellDto): Promise<GalaChainResponse<void>>;
  
  // Combat + Advanced - Sub-task 0.4 (8 methods)
  CreateEncounter(dto: CreateEncounterDto): Promise<GalaChainResponse<void>>;
  RollDice(dto: RollDiceDto): Promise<GalaChainResponse<DiceRoll>>;
  CreateParty(dto: CreatePartyDto): Promise<GalaChainResponse<void>>;
  CastSpell(dto: CastSpellDto): Promise<GalaChainResponse<CastSpellAction>>;
  PerformAttack(dto: PerformAttackDto): Promise<GalaChainResponse<CombatAction>>;
  ApplyStatusEffect(dto: ApplyStatusEffectDto): Promise<GalaChainResponse<void>>;
  MakeSavingThrow(dto: MakeSavingThrowDto): Promise<GalaChainResponse<SavingThrow>>;
  MakeSkillCheck(dto: MakeSkillCheckDto): Promise<GalaChainResponse<SkillCheck>>;
}

// Complete API implementation function for all RPG contract methods (50 methods total)
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
    },
    
    // Character CRUD - Sub-task 0.2 (7 methods)
    CreateCharacter(dto: CreateCharacterDto) {
      return client.submitTransaction("CreateCharacter", dto) as Promise<GalaChainResponse<void>>;
    },
    GetCharacterSheet(dto: GetCharacterDto) {
      return client.evaluateTransaction("GetCharacterSheet", dto, CharacterSheetDto) as Promise<GalaChainResponse<CharacterSheetDto>>;
    },
    ListCharacters(dto: ListCharactersDto) {
      return client.evaluateTransaction("ListCharacters", dto) as Promise<GalaChainResponse<CharacterEntity[]>>;
    },
    LevelUpCharacter(dto: LevelUpCharacterDto) {
      return client.submitTransaction("LevelUpCharacter", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateCharacterState(dto: UpdateCharacterStateDto) {
      return client.submitTransaction("UpdateCharacterState", dto) as Promise<GalaChainResponse<void>>;
    },
    ValidateCharacter(dto: ValidateCharacterDto) {
      return client.evaluateTransaction("ValidateCharacter", dto, ValidationResultDto) as Promise<GalaChainResponse<ValidationResultDto>>;
    },
    GetCharacterHistory(dto: GetCharacterHistoryDto) {
      return client.evaluateTransaction("GetCharacterHistory", dto) as Promise<GalaChainResponse<any>>;
    },
    
    // Character Management - Sub-task 0.3 (5 methods)
    AddEquipment(dto: AddEquipmentDto) {
      return client.submitTransaction("AddEquipment", dto) as Promise<GalaChainResponse<void>>;
    },
    EquipItem(dto: EquipItemDto) {
      return client.submitTransaction("EquipItem", dto) as Promise<GalaChainResponse<void>>;
    },
    AddSkillProficiency(dto: AddSkillProficiencyDto) {
      return client.submitTransaction("AddSkillProficiency", dto) as Promise<GalaChainResponse<void>>;
    },
    AddFeat(dto: AddFeatDto) {
      return client.submitTransaction("AddFeat", dto) as Promise<GalaChainResponse<void>>;
    },
    AddSpell(dto: AddSpellDto) {
      return client.submitTransaction("AddSpell", dto) as Promise<GalaChainResponse<void>>;
    },
    
    // Combat + Advanced - Sub-task 0.4 (8 methods)
    CreateEncounter(dto: CreateEncounterDto) {
      return client.submitTransaction("CreateEncounter", dto) as Promise<GalaChainResponse<void>>;
    },
    RollDice(dto: RollDiceDto) {
      return client.submitTransaction("RollDice", dto, DiceRoll) as Promise<GalaChainResponse<DiceRoll>>;
    },
    CreateParty(dto: CreatePartyDto) {
      return client.submitTransaction("CreateParty", dto) as Promise<GalaChainResponse<void>>;
    },
    CastSpell(dto: CastSpellDto) {
      return client.submitTransaction("CastSpell", dto, CastSpellAction) as Promise<GalaChainResponse<CastSpellAction>>;
    },
    PerformAttack(dto: PerformAttackDto) {
      return client.submitTransaction("PerformAttack", dto, CombatAction) as Promise<GalaChainResponse<CombatAction>>;
    },
    ApplyStatusEffect(dto: ApplyStatusEffectDto) {
      return client.submitTransaction("ApplyStatusEffect", dto) as Promise<GalaChainResponse<void>>;
    },
    MakeSavingThrow(dto: MakeSavingThrowDto) {
      return client.submitTransaction("MakeSavingThrow", dto, SavingThrow) as Promise<GalaChainResponse<SavingThrow>>;
    },
    MakeSkillCheck(dto: MakeSkillCheckDto) {
      return client.submitTransaction("MakeSkillCheck", dto, SkillCheck) as Promise<GalaChainResponse<SkillCheck>>;
    }
  };
}