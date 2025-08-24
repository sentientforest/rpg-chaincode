import { Evaluate, GalaChainContext, GalaContract, Submit } from "@gala-chain/chaincode";
import { plainToInstance } from "class-transformer";
import { Info } from "fabric-contract-api";

import { version } from "../../package.json";
import { awardAchievement, checkAchievementProgress } from "./achievements";
import { generateAnalytics } from "./analytics";
import { createCampaign, startGameSession } from "./campaigns";
import {
  addCharacterClass,
  addEquipment,
  addFeat,
  addSkillProficiency,
  addSpell,
  createCharacter,
  equipItem,
  getCharacterHistory,
  getCharacterSheet,
  levelUpCharacter,
  listCharacters,
  updateCharacterState,
  validateCharacter
} from "./characters";
import {
  advanceTurn,
  applyStatusEffect,
  makeSavingThrow,
  makeSkillCheck,
  performAttack,
  startInitiative
} from "./combat";
import { advanceCrafting, startCraftingProject } from "./crafting";
import { createEncounter, rollDice } from "./encounters";
import { createSpellEffect } from "./magic";
import { createParty } from "./parties";
import {
  createArmorData,
  createBackgroundData,
  createFeatData,
  createSkillData,
  createSpellData,
  createWeaponData,
  deleteArmorData,
  deleteBackgroundData,
  deleteFeatData,
  deleteSkillData,
  deleteSpellData,
  deleteWeaponData,
  getArmorData,
  getBackgroundData,
  getFeatData,
  getSkillData,
  getSpellData,
  getWeaponData,
  listArmorData,
  listBackgroundData,
  listFeatData,
  listSkillData,
  listSpellData,
  listWeaponData,
  updateArmorData,
  updateBackgroundData,
  updateFeatData,
  updateSkillData,
  updateSpellData,
  updateWeaponData
} from "./reference";
import { castSpell } from "./spellcasting";
import { approveCharacterTransfer, initiateCharacterTransfer } from "./transfers";
import { distributeTreasure } from "./treasure";
import {
  AddEquipmentDto,
  AddFeatDto,
  AddSkillProficiencyDto,
  AddSpellDto,
  ApplyStatusEffectDto,
  ArmorData,
  BackgroundData,
  CastSpellAction,
  CastSpellDto,
  CharacterEntity,
  CharacterSheetDto,
  CombatAction,
  CreateArmorDataDto,
  CreateBackgroundDataDto,
  CreateCharacterDto,
  CreateEncounterDto,
  CreateFeatDataDto,
  CreatePartyDto,
  CreateSkillDataDto,
  CreateSpellDataDto,
  CreateWeaponDataDto,
  DeleteReferenceDataDto,
  DiceRoll,
  EquipItemDto,
  FeatData,
  GetCharacterDto,
  GetCharacterHistoryDto,
  GetReferenceDataDto,
  LevelUpCharacterDto,
  ListCharactersDto,
  ListReferenceDataDto,
  MakeSavingThrowDto,
  MakeSkillCheckDto,
  PerformAttackDto,
  RollDiceDto,
  SavingThrow,
  SkillCheck,
  SkillData,
  SpellData,
  UpdateArmorDataDto,
  UpdateBackgroundDataDto,
  UpdateCharacterStateDto,
  UpdateFeatDataDto,
  UpdateSkillDataDto,
  UpdateSpellDataDto,
  UpdateWeaponDataDto,
  ValidateCharacterDto,
  ValidationResultDto,
  WeaponData,
  CreateCampaignDto,
  StartGameSessionDto,
  DistributeTreasureDto,
  StartInitiativeDto,
  AdvanceTurnDto,
  AddCharacterClassDto,
  StartCraftingProjectDto,
  AdvanceCraftingDto,
  CreateSpellEffectDto,
  AwardAchievementDto,
  InitiateCharacterTransferDto,
  ApproveCharacterTransferDto,
  GenerateAnalyticsDto,
  ValidateCharacterRulesDto
} from "./types";
import { validateCharacterRules } from "./validation";

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
  public async ListBackgroundData(
    ctx: GalaChainContext,
    dto: ListReferenceDataDto
  ): Promise<BackgroundData[]> {
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

  // Character Creation
  @Submit({
    in: CreateCharacterDto
  })
  public async CreateCharacter(ctx: GalaChainContext, dto: CreateCharacterDto): Promise<void> {
    await createCharacter(ctx, dto);
  }

  // Character Queries
  @Evaluate({
    in: GetCharacterDto,
    out: CharacterSheetDto
  })
  public async GetCharacterSheet(ctx: GalaChainContext, dto: GetCharacterDto): Promise<CharacterSheetDto> {
    return await getCharacterSheet(ctx, dto);
  }

  @Evaluate({
    in: ListCharactersDto,
    out: CharacterEntity
  })
  public async ListCharacters(ctx: GalaChainContext, dto: ListCharactersDto): Promise<CharacterEntity[]> {
    return await listCharacters(ctx, dto);
  }

  // Equipment Management
  @Submit({
    in: AddEquipmentDto
  })
  public async AddEquipment(ctx: GalaChainContext, dto: AddEquipmentDto): Promise<void> {
    await addEquipment(ctx, dto);
  }

  @Submit({
    in: EquipItemDto
  })
  public async EquipItem(ctx: GalaChainContext, dto: EquipItemDto): Promise<void> {
    await equipItem(ctx, dto);
  }

  // Skill and Feat Management
  @Submit({
    in: AddSkillProficiencyDto
  })
  public async AddSkillProficiency(ctx: GalaChainContext, dto: AddSkillProficiencyDto): Promise<void> {
    await addSkillProficiency(ctx, dto);
  }

  @Submit({
    in: AddFeatDto
  })
  public async AddFeat(ctx: GalaChainContext, dto: AddFeatDto): Promise<void> {
    await addFeat(ctx, dto);
  }

  // Character Advancement (Phase 3)
  @Submit({
    in: LevelUpCharacterDto
  })
  public async LevelUpCharacter(ctx: GalaChainContext, dto: LevelUpCharacterDto): Promise<void> {
    await levelUpCharacter(ctx, dto);
  }

  @Submit({
    in: UpdateCharacterStateDto
  })
  public async UpdateCharacterState(ctx: GalaChainContext, dto: UpdateCharacterStateDto): Promise<void> {
    await updateCharacterState(ctx, dto);
  }

  // Spellcasting System
  @Submit({
    in: AddSpellDto
  })
  public async AddSpell(ctx: GalaChainContext, dto: AddSpellDto): Promise<void> {
    await addSpell(ctx, dto);
  }

  // Character Validation
  @Evaluate({
    in: ValidateCharacterDto,
    out: ValidationResultDto
  })
  public async ValidateCharacter(
    ctx: GalaChainContext,
    dto: ValidateCharacterDto
  ): Promise<ValidationResultDto> {
    return await validateCharacter(ctx, dto);
  }

  // Character History
  @Evaluate({
    in: GetCharacterHistoryDto
  })
  public async GetCharacterHistory(ctx: GalaChainContext, dto: GetCharacterHistoryDto) {
    return await getCharacterHistory(ctx, dto);
  }

  // Phase 4: Advanced Game Mechanics

  // Encounter System
  @Submit({
    in: CreateEncounterDto
  })
  public async CreateEncounter(ctx: GalaChainContext, dto: CreateEncounterDto): Promise<void> {
    await createEncounter(ctx, dto);
  }

  @Submit({
    in: RollDiceDto,
    out: DiceRoll
  })
  public async RollDice(ctx: GalaChainContext, dto: RollDiceDto): Promise<DiceRoll> {
    return await rollDice(ctx, dto);
  }

  // Party Management
  @Submit({
    in: CreatePartyDto
  })
  public async CreateParty(ctx: GalaChainContext, dto: CreatePartyDto): Promise<void> {
    await createParty(ctx, dto);
  }

  // Advanced Spellcasting
  @Submit({
    in: CastSpellDto,
    out: CastSpellAction
  })
  public async CastSpell(ctx: GalaChainContext, dto: CastSpellDto): Promise<CastSpellAction> {
    return await castSpell(ctx, dto);
  }

  // Campaign Management (GM only) - TEMPORARILY DISABLED
  // @Submit({
  //   in: CreateCampaignDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async CreateCampaign(ctx: GalaChainContext, dto: CreateCampaignDto): Promise<void> {
  //   await createCampaign(ctx, dto);
  // }

  // @Submit({
  //   in: StartGameSessionDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async StartGameSession(ctx: GalaChainContext, dto: StartGameSessionDto): Promise<void> {
  //   await startGameSession(ctx, dto);
  // }

  // Treasure Distribution (GM only) - TEMPORARILY DISABLED
  // @Submit({
  //   in: DistributeTreasureDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async DistributeTreasure(ctx: GalaChainContext, dto: DistributeTreasureDto): Promise<void> {
  //   await distributeTreasure(ctx, dto);
  // }

  // Phase 5: Advanced Character Features and Combat Resolution

  // Combat Actions
  @Submit({
    in: PerformAttackDto,
    out: CombatAction
  })
  public async PerformAttack(ctx: GalaChainContext, dto: PerformAttackDto): Promise<CombatAction> {
    return await performAttack(ctx, dto);
  }

  @Submit({
    in: ApplyStatusEffectDto
  })
  public async ApplyStatusEffect(ctx: GalaChainContext, dto: ApplyStatusEffectDto): Promise<void> {
    await applyStatusEffect(ctx, dto);
  }

  // Skill Checks and Saves
  @Submit({
    in: MakeSavingThrowDto,
    out: SavingThrow
  })
  public async MakeSavingThrow(ctx: GalaChainContext, dto: MakeSavingThrowDto): Promise<SavingThrow> {
    return await makeSavingThrow(ctx, dto);
  }

  @Submit({
    in: MakeSkillCheckDto,
    out: SkillCheck
  })
  public async MakeSkillCheck(ctx: GalaChainContext, dto: MakeSkillCheckDto): Promise<SkillCheck> {
    return await makeSkillCheck(ctx, dto);
  }

  // Initiative Management (GM only) - TEMPORARILY DISABLED
  // @Submit({
  //   in: StartInitiativeDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async StartInitiative(ctx: GalaChainContext, dto: StartInitiativeDto): Promise<void> {
  //   await startInitiative(ctx, dto);
  // }

  // @Submit({
  //   in: AdvanceTurnDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async AdvanceTurn(ctx: GalaChainContext, dto: AdvanceTurnDto): Promise<void> {
  //   await advanceTurn(ctx, dto);
  // }

  // Multiclass Support - TEMPORARILY DISABLED
  // @Submit({
  //   in: AddCharacterClassDto
  // })
  // public async AddCharacterClass(ctx: GalaChainContext, dto: AddCharacterClassDto): Promise<void> {
  //   await addCharacterClass(ctx, dto);
  // }

  // Crafting System - TEMPORARILY DISABLED
  // @Submit({
  //   in: StartCraftingProjectDto
  // })
  // public async StartCraftingProject(ctx: GalaChainContext, dto: StartCraftingProjectDto): Promise<void> {
  //   await startCraftingProject(ctx, dto);
  // }

  // @Submit({
  //   in: AdvanceCraftingDto
  // })
  // public async AdvanceCrafting(ctx: GalaChainContext, dto: AdvanceCraftingDto): Promise<void> {
  //   await advanceCrafting(ctx, dto);
  // }

  // Phase 6: Advanced RPG Features and System Polish

  // Advanced Spell Effects - TEMPORARILY DISABLED
  // @Submit({
  //   in: CreateSpellEffectDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async CreateSpellEffect(ctx: GalaChainContext, dto: CreateSpellEffectDto): Promise<void> {
  //   await createSpellEffect(ctx, dto);
  // }

  // Achievement System - TEMPORARILY DISABLED
  // @Submit({
  //   in: AwardAchievementDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async AwardAchievement(ctx: GalaChainContext, dto: AwardAchievementDto): Promise<void> {
  //   await awardAchievement(ctx, dto);
  // }

  // Character Transfer System - TEMPORARILY DISABLED
  // @Submit({
  //   in: InitiateCharacterTransferDto
  // })
  // public async InitiateCharacterTransfer(ctx: GalaChainContext, dto: InitiateCharacterTransferDto): Promise<void> {
  //   await initiateCharacterTransfer(ctx, dto);
  // }

  // @Submit({
  //   in: ApproveCharacterTransferDto,
  //   allowedRoles: ["GM", "ADMIN"]
  // })
  // public async ApproveCharacterTransfer(ctx: GalaChainContext, dto: ApproveCharacterTransferDto): Promise<void> {
  //   await approveCharacterTransfer(ctx, dto);
  // }

  // Analytics and Reporting (Admin only) - TEMPORARILY DISABLED
  // @Submit({
  //   in: GenerateAnalyticsDto,
  //   allowedRoles: ["ADMIN"]
  // })
  // public async GenerateAnalytics(ctx: GalaChainContext, dto: GenerateAnalyticsDto): Promise<void> {
  //   await generateAnalytics(ctx, dto);
  // }

  // Rules Validation (Evaluate only - for checking, not enforcing) - TEMPORARILY DISABLED
  // @Evaluate({
  //   in: ValidateCharacterRulesDto
  // })
  // public async ValidateCharacterRules(ctx: GalaChainContext, dto: ValidateCharacterRulesDto): Promise<any> {
  //   return await validateCharacterRules(ctx, dto);
  // }
}
