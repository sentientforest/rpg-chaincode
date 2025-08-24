import { ChainCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from "class-validator";

export class CreateCampaignDto extends ChainCallDTO {
  @IsNotEmpty()
  public campaignId: string;

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  public description?: string;

  @IsNotEmpty()
  public setting: string; // "homebrew", "pathfinder_ap", "custom"

  @IsNumber()
  public recommendedLevel: number;

  @IsBoolean()
  public allowsNewPlayers: boolean;

  @IsNotEmpty()
  public visibility: string; // "public", "invite_only", "private"

  @ArrayMinSize(0)
  @IsOptional()
  public initialPlayers?: string[]; // User IDs to add immediately
}

export class StartGameSessionDto extends ChainCallDTO {
  @IsNotEmpty()
  public campaignId: string;

  @IsNotEmpty()
  public sessionId: string;

  @IsOptional()
  public title?: string;

  @ArrayMinSize(1)
  public participantCharacters: string[]; // Character IDs participating

  @ArrayMinSize(1)
  public participantPlayers: string[]; // User IDs participating
}

export class DistributeTreasureDto extends ChainCallDTO {
  @IsNotEmpty()
  public distributionId: string;

  @IsNotEmpty()
  public campaignId: string;

  @IsNotEmpty()
  public source: string; // encounter, quest, treasure_hoard

  @IsNumber()
  public goldValue: number;

  public currencyBreakdown: any; // { gold: number, silver: number, copper: number }

  @ArrayMinSize(1)
  public recipients: string[]; // Character names

  @IsNotEmpty()
  public distributionMethod: string; // "equal", "weighted", "manual"

  @IsOptional()
  public weights?: Record<string, number>; // For weighted distribution

  @IsOptional()
  public manualAmounts?: Record<string, number>; // For manual distribution
}

export class StartInitiativeDto extends ChainCallDTO {
  @IsNotEmpty()
  public encounterId: string;

  @ArrayMinSize(1)
  public participants: string[]; // Character names or creature IDs
}

export class AdvanceTurnDto extends ChainCallDTO {
  @IsNotEmpty()
  public encounterId: string;

  @IsNotEmpty()
  public currentTurnId: string;
}

export class AddCharacterClassDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public className: string;

  @IsOptional()
  public dedicationFeat?: string;
}

export class StartCraftingProjectDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public projectId: string;

  @IsNotEmpty()
  public itemName: string;

  @IsNotEmpty()
  public itemType: string; // weapon, armor, consumable, etc.

  @IsNumber()
  public itemLevel: number;

  @IsNotEmpty()
  public craftingSkill: string; // Crafting, Alchemy, etc.

  @IsNumber()
  public baseDC: number;

  @IsNumber()
  public totalWorkDays: number;

  @IsNumber()
  public costInCopper: number;
}

export class AdvanceCraftingDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public projectId: string;

  @IsNumber()
  public daysWorked: number;

  public materialsUsed: any; // { material: string, quantity: number }[]

  @IsNumber()
  public skillCheckResult: number;

  @IsNotEmpty()
  public randomSeed: string;
}

export class CreateSpellEffectDto extends ChainCallDTO {
  @IsNotEmpty()
  public effectId: string;

  @IsNotEmpty()
  public castingActionId: string;

  @IsNotEmpty()
  public casterId: string; // Character name

  @IsNotEmpty()
  public effectType: string; // persistent, instant, triggered

  @IsNotEmpty()
  public spellName: string;

  @IsNumber()
  public spellLevel: number;

  @IsOptional()
  public duration?: number; // In rounds, 0 for permanent

  @IsOptional()
  public targetLocation?: string; // For area effects
}

export class AwardAchievementDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public achievementId: string;

  @IsNotEmpty()
  public achievementName: string;

  @IsOptional()
  public description?: string;

  @IsNotEmpty()
  public category: string; // combat, exploration, social, etc.

  @IsNotEmpty()
  public rarity: string; // common, uncommon, rare, legendary

  @IsOptional()
  public notes?: string;
}

export class InitiateCharacterTransferDto extends ChainCallDTO {
  @IsNotEmpty()
  public transferId: string;

  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public fromCampaignId: string;

  @IsNotEmpty()
  public toCampaignId: string;

  @IsNotEmpty()
  public transferType: string; // permanent, temporary, copy

  @IsOptional()
  public reason?: string;

  @IsBoolean()
  public retainHistory: boolean;

  @IsBoolean()
  public retainAchievements: boolean;
}

export class ApproveCharacterTransferDto extends ChainCallDTO {
  @IsNotEmpty()
  public transferId: string;

  @IsNotEmpty()
  public approval: string; // "approved", "rejected"

  @IsOptional()
  public notes?: string;
}

export class GenerateAnalyticsDto extends ChainCallDTO {
  @IsNotEmpty()
  public reportType: string;

  @IsOptional()
  public campaignId?: string;

  @IsOptional()
  public startDate?: string; // ISO date string

  @IsOptional()
  public endDate?: string; // ISO date string
}

export class ValidateCharacterRulesDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsOptional()
  public campaignId?: string;

  @IsOptional()
  public encounterId?: string;

  @IsOptional()
  public transactionId?: string;

  @IsNotEmpty()
  public action: string;

  public data: any; // Required but can be any type
}