import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, Min, Max } from "class-validator";

/**
 * @description
 * 
 * Represents a class that a character has levels in.
 * Supports multiclassing with separate level tracking per class.
 */
export class CharacterClass extends ChainObject {
  public static INDEX_KEY = "RPCC";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public className: string; // Name of the class
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public classLevel: number; // Levels in this specific class
  
  @IsBoolean()
  public isPrimary: boolean; // Primary class (for multiclass dedication)
  
  @IsOptional()
  @IsString()
  public archetype?: string; // Specific archetype or subclass
  
  @IsOptional()
  @IsString()
  public dedication?: string; // Multiclass dedication feat
  
  @IsNumber()
  public gainedAtLevel: number; // Character level when this class was gained
  
  @IsOptional()
  @IsString()
  public spellcastingTradition?: string; // For spellcasting classes
  
  @IsOptional()
  @IsString()
  public keyAbility?: string; // Primary ability score for this class
  
  @IsNumber()
  public lastUpdated: number; // ctx.txUnixTime
}