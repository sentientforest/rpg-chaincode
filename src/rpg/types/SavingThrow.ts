import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean } from "class-validator";

/**
 * @description
 * 
 * Records a saving throw attempt with all relevant details.
 * Tracks success/failure and consequences.
 */
export class SavingThrow extends ChainObject {
  public static INDEX_KEY = "RPST";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public saveId: string; // Unique identifier
  
  @IsString()
  public saveType: string; // "fortitude", "reflex", "will"
  
  @IsNumber()
  public dc: number; // Difficulty class
  
  @IsNumber()
  public rollResult: number; // D20 result
  
  @IsNumber()
  public modifier: number; // Character's save modifier
  
  @IsNumber()
  public totalResult: number; // Roll + modifier + other bonuses
  
  @IsBoolean()
  public isSuccess: boolean;
  
  @IsBoolean()
  public isCriticalSuccess: boolean; // Natural 20 or beat DC by 10+
  
  @IsBoolean()
  public isCriticalFailure: boolean; // Natural 1 or failed by 10+
  
  @IsString()
  public purpose: string; // What the save was for
  
  @IsOptional()
  @IsString()
  public sourceEffect?: string; // Spell, condition, etc. that triggered save
  
  @IsOptional()
  @IsString()
  public consequence?: string; // What happened based on result
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // If made during encounter
  
  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}