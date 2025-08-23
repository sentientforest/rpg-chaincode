import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsBoolean, Min } from "class-validator";

/**
 * @description
 * 
 * Represents a persistent spell effect in the game world.
 * Tracks area effects, persistent spells, and environmental magic.
 */
export class SpellEffect extends ChainObject {
  public static INDEX_KEY = "RPEF";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public effectId: string; // Unique effect identifier
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // When effect was created
  
  @IsNotEmpty()
  public spellName: string; // Spell that created this effect
  
  @IsNotEmpty()
  public casterId: string; // Character who cast the spell
  
  @IsString()
  public effectType: string; // "area", "persistent", "environmental", "triggered"
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // Encounter where effect exists
  
  @IsOptional()
  @IsString()
  public campaignId?: string; // Campaign where effect exists
  
  @IsOptional()
  @IsNumber()
  public duration?: number; // Duration in rounds/hours (-1 for permanent)
  
  @IsOptional()
  @IsNumber()
  public remainingDuration?: number; // Time remaining
  
  @IsString()
  public areaType: string; // "point", "burst", "emanation", "cone", "line"
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public areaSize?: number; // Size in feet/squares
  
  @IsOptional()
  @IsString()
  public centerPoint?: string; // Coordinates or description
  
  @IsArray()
  public affectedTargets: string[]; // Currently affected participants
  
  @IsOptional()
  @IsNumber()
  public saveDC?: number; // Save DC for effects
  
  @IsOptional()
  @IsString()
  public saveType?: string; // Type of save required
  
  @IsString()
  public description: string; // Effect description
  
  @IsBoolean()
  public isActive: boolean;
  
  @IsBoolean()
  public requiresConcentration: boolean;
  
  @IsOptional()
  @IsString()
  public triggerCondition?: string; // For triggered effects
  
  @IsNumber()
  public createdAt: number; // ctx.txUnixTime
}