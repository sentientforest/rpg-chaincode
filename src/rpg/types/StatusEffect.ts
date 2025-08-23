import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, Min } from "class-validator";

/**
 * @description
 * 
 * Represents an active status effect or condition on a character.
 * Tracks duration, intensity, and source of effects.
 */
export class StatusEffect extends ChainObject {
  public static INDEX_KEY = "RPSE";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public effectId: string; // Unique identifier for this effect instance
  
  @IsString()
  public effectName: string; // "frightened", "poisoned", "fatigued", "blessed", etc.
  
  @IsString()
  public effectType: string; // "condition", "spell", "disease", "curse", "enhancement"
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  public intensity?: number; // For effects with levels (frightened 2, drained 3, etc.)
  
  @IsOptional()
  @IsNumber()
  public duration?: number; // Duration in rounds, -1 for permanent
  
  @IsOptional()
  @IsNumber()
  public remainingDuration?: number; // Rounds remaining
  
  @IsOptional()
  @IsString()
  public source?: string; // What caused this effect (spell name, weapon, etc.)
  
  @IsOptional()
  @IsString()
  public sourceId?: string; // ID of the source (character, spell, item)
  
  @IsOptional()
  @IsString()
  public description?: string; // Effect description and rules
  
  @IsBoolean()
  public isActive: boolean;
  
  @IsBoolean()
  public isHidden: boolean; // Hidden from other players
  
  @IsOptional()
  @IsString()
  public endCondition?: string; // How the effect ends ("save", "time", "dispel", "manual")
  
  @IsOptional()
  @IsNumber()
  public saveDC?: number; // DC for saving throws to end effect
  
  @IsOptional()
  @IsString()
  public saveType?: string; // "fortitude", "reflex", "will"
  
  @IsNumber()
  public appliedAt: number; // ctx.txUnixTime when effect was applied
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // Encounter where effect was applied
}