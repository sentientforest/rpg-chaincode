import BigNumber from "bignumber.js";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

export class AttributesDto {
  @IsNumber()
  public strength: number;

  @IsNumber()
  public dexterity: number;

  @IsNumber()
  public constitution: number;

  @IsNumber()
  public intelligence: number;

  @IsNumber()
  public wisdom: number;

  @IsNumber()
  public charisma: number;

  // Calculated modifiers
  @IsNumber()
  public strengthModifier: number;

  @IsNumber()
  public dexterityModifier: number;

  @IsNumber()
  public constitutionModifier: number;

  @IsNumber()
  public intelligenceModifier: number;

  @IsNumber()
  public wisdomModifier: number;

  @IsNumber()
  public charismaModifier: number;
}

export class CharacterStateDto {
  @IsNumber()
  public currentHP: number;

  @IsNumber()
  public maxHP: number;

  @IsNumber()
  public temporaryHP: number;

  @IsNumber()
  public heroPoints: number;

  @IsNumber()
  public focusPoints: number;

  @ArrayMinSize(0)
  public conditions: string[];
}

export class CalculatedStatsDto {
  @IsNumber()
  public armorClass: number;

  @IsNumber()
  public fortitudeSave: number;

  @IsNumber()
  public reflexSave: number;

  @IsNumber()
  public willSave: number;

  @IsNumber()
  public perception: number;

  @IsNumber()
  public initiative: number;

  @IsNumber()
  public speed: number;

  @IsNumber()
  public classDC: number;
}

export class SkillProficiencyDto {
  @IsNotEmpty()
  public skillName: string;

  @IsNotEmpty()
  public proficiencyRank: string;

  @IsNotEmpty()
  public source: string;

  @IsNumber()
  public modifier: number; // Calculated total modifier
}

export class CharacterFeatDto {
  @IsNotEmpty()
  public featName: string;

  @IsNotEmpty()
  public featType: string;

  @IsNotEmpty()
  public source: string;

  @IsNumber()
  public level: number;
}

export class EquipmentItemDto {
  @IsNotEmpty()
  public itemId: string;

  @IsNotEmpty()
  public itemName: string;

  @IsNotEmpty()
  public itemType: string;

  @IsNumber()
  public quantity: number;

  @IsNumber()
  public isEquipped: boolean;

  @IsNumber()
  public bulkPerItem: number;

  @IsOptional()
  public containerSlot?: string;
}

/**
 * @description
 *
 * Complete character sheet DTO containing all character information.
 * This aggregates data from all character components.
 */
export class CharacterSheetDto {
  // Basic Character Info
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public owner: string;

  @IsOptional()
  public concept?: string;

  // Progression Info
  @IsNumber()
  public level: number;

  @IsNotEmpty()
  public ancestryName: string;

  @IsNotEmpty()
  public backgroundName: string;

  @IsNotEmpty()
  public className: string;

  // Attributes
  @ValidateNested()
  @Type(() => AttributesDto)
  public attributes: AttributesDto;

  // Current State
  @ValidateNested()
  @Type(() => CharacterStateDto)
  public currentState: CharacterStateDto;

  // Calculated Stats
  @ValidateNested()
  @Type(() => CalculatedStatsDto)
  public calculatedStats: CalculatedStatsDto;

  // Skills (Individual Facts)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => SkillProficiencyDto)
  public skills: SkillProficiencyDto[];

  // Feats (Individual Facts)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CharacterFeatDto)
  public feats: CharacterFeatDto[];

  // Equipment (Individual Facts)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => EquipmentItemDto)
  public equipment: EquipmentItemDto[];

  // Metadata
  @IsNumber()
  public createdAt: number;

  @IsNumber()
  public lastModified: number;
}
