import { BigNumberProperty, ChainKey, ChainObject, BigNumberIsNotNegative } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsArray, IsNumber, IsOptional } from "class-validator";
import BigNumber from "bignumber.js";

/**
 * @description
 * 
 * Records distribution of treasure from encounters or sessions.
 * Tracks how treasure was divided among participants.
 */
export class TreasureDistribution extends ChainObject {
  public static INDEX_KEY = "RPTD";
  
  @ChainKey({ position: 0 })
  @IsString()
  public timestamp: string; // Padded timestamp
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public distributionId: string; // Unique identifier
  
  @IsString()
  public source: string; // "encounter", "session", "gm_award", "found"
  
  @IsOptional()
  @IsString()
  public sourceId?: string; // Encounter ID, Session ID, etc.
  
  @IsArray()
  public recipients: string[]; // Character IDs receiving treasure
  
  @IsOptional()
  @IsString()
  public partyId?: string; // Party that received treasure
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public totalGoldValue: BigNumber; // Total value in gold pieces
  
  @IsArray()
  public currencyDistribution: any[]; // Specific currency amounts per recipient
  
  @IsArray()
  public itemsDistributed: string[]; // Item IDs that were distributed
  
  @IsOptional()
  @IsString()
  public distributionMethod?: string; // "equal", "roll", "assigned", "vote"
  
  @IsOptional()
  @IsString()
  public notes?: string; // Additional notes about distribution
  
  @IsNumber()
  public distributedAt: number; // ctx.txUnixTime
  
  @IsNotEmpty()
  public distributedBy: string; // User who performed distribution
}