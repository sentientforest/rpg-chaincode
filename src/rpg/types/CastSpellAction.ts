import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, IsBoolean, Min, Max } from "class-validator";

/**
 * @description
 * 
 * Records a spell being cast with all relevant details.
 * Tracks spell usage, targets, and outcomes.
 */
export class CastSpellAction extends ChainObject {
  public static INDEX_KEY = "RPCS";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public txId: string;
  
  @IsNotEmpty()
  public spellName: string;
  
  @IsString()
  public tradition: string;
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public castAtLevel: number; // Level the spell was cast at
  
  @IsString()
  public castingSource: string; // "prepared", "spontaneous", "item", "scroll"
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // If cast during encounter
  
  @IsOptional()
  @IsArray()
  public targets?: string[]; // Target participant IDs
  
  @IsOptional()
  @IsArray()
  public diceRolls?: number[]; // Attack rolls, damage rolls, etc.
  
  @IsOptional()
  @IsString()
  public outcome?: string; // "success", "failure", "partial"
  
  @IsOptional()
  @IsNumber()
  public damageDealt?: number; // Total damage if applicable
  
  @IsOptional()
  @IsNumber()
  public healingDone?: number; // Total healing if applicable
  
  @IsOptional()
  @IsArray()
  public appliedConditions?: string[]; // Conditions applied to targets
  
  @IsOptional()
  @IsNumber()
  public spellSlotUsed?: number; // Which spell slot was consumed
  
  @IsBoolean()
  public wasCounterspelled: boolean;
  
  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}