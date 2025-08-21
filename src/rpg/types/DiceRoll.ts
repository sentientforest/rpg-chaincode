import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsArray, IsOptional, Min, Max } from "class-validator";

/**
 * @description
 * 
 * Represents a dice roll with cryptographically secure randomness.
 * Uses oracle-provided seed for deterministic results across peers.
 */
export class DiceRoll extends ChainObject {
  public static INDEX_KEY = "RPDR";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public rollId: string; // Unique identifier for this roll
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp
  
  @IsNotEmpty()
  public roller: string; // Who initiated the roll
  
  @IsString()
  public rollType: string; // "ability_check", "attack", "damage", "save", "initiative", "custom"
  
  @IsString()
  public diceExpression: string; // e.g., "2d6+3", "1d20", "4d6kh3"
  
  @IsArray()
  public individualRolls: number[]; // Raw die results
  
  @IsNumber()
  public modifier: number; // Fixed modifier added to roll
  
  @IsNumber()
  public totalResult: number; // Final calculated result
  
  @IsNotEmpty()
  public randomSeed: string; // Oracle-provided seed for deterministic randomness
  
  @IsOptional()
  @IsString()
  public purpose?: string; // What this roll was for
  
  @IsOptional()
  @IsString()
  public targetDC?: string; // Difficulty class if applicable
  
  @IsOptional()
  @IsString()
  public outcome?: string; // "success", "failure", "critical_success", "critical_failure"
  
  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}