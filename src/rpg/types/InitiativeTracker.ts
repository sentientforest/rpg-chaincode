import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsBoolean, IsOptional, Min } from "class-validator";

/**
 * @description
 * 
 * Tracks initiative order and turn progression in combat encounters.
 * Manages whose turn it is and round advancement.
 */
export class InitiativeTracker extends ChainObject {
  public static INDEX_KEY = "RPIT";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public encounterId: string;
  
  @IsNumber()
  @Min(1)
  public currentRound: number;
  
  @IsOptional()
  @IsString()
  public currentTurnParticipant?: string; // Participant ID whose turn it is
  
  @IsNumber()
  public currentTurnIndex: number; // Index in initiative order
  
  @IsBoolean()
  public isActive: boolean; // Whether initiative is currently running
  
  @IsBoolean()
  public hasStarted: boolean; // Whether combat has begun
  
  @IsOptional()
  @IsNumber()
  public turnStartTime?: number; // When current turn started
  
  @IsOptional()
  @IsNumber()
  public roundStartTime?: number; // When current round started
  
  @IsNumber()
  public lastUpdated: number; // ctx.txUnixTime
}