import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, Min } from "class-validator";

/**
 * @description
 * 
 * Represents an action taken during an encounter.
 * Creates an audit trail of all encounter events.
 */
export class EncounterAction extends ChainObject {
  public static INDEX_KEY = "RPEA";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public encounterId: string;
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp for ordering
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public txId: string; // Transaction ID for uniqueness
  
  @IsNotEmpty()
  public actingParticipant: string; // Who performed the action
  
  @IsString()
  public actionType: string; // "attack", "spell", "move", "skill_check", "initiative", "gm_action"
  
  @IsNotEmpty()
  public description: string; // Human-readable description
  
  @IsOptional()
  @IsString()
  public targetParticipant?: string; // Target of the action (if any)
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public roundNumber?: number; // Combat round when action occurred
  
  @IsOptional()
  @IsArray()
  public diceRolls?: number[]; // Dice results for this action
  
  @IsOptional()
  @IsNumber()
  public totalResult?: number; // Final result including modifiers
  
  @IsOptional()
  @IsString()
  public outcome?: string; // "success", "failure", "critical_success", "critical_failure"
  
  @IsOptional()
  public actionData?: any; // Additional structured data about the action
  
  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}