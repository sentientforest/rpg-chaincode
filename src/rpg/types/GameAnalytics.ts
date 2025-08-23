import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from "class-validator";

/**
 * @description
 * 
 * Aggregated analytics and reporting data for campaigns and characters.
 * Provides insights into gameplay patterns and system usage.
 */
export class GameAnalytics extends ChainObject {
  public static INDEX_KEY = "RPGA";
  
  @ChainKey({ position: 0 })
  @IsString()
  public reportDate: string; // YYYYMMDD format
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public reportId: string;
  
  @IsString()
  public reportType: string; // "daily", "weekly", "monthly", "campaign", "character"
  
  @IsOptional()
  @IsString()
  public scopeId?: string; // Campaign/Character ID if specific scope
  
  @IsNumber()
  public totalSessions: number;
  
  @IsNumber()
  public totalEncounters: number;
  
  @IsNumber()
  public totalCombatActions: number;
  
  @IsNumber()
  public totalSpellsCast: number;
  
  @IsNumber()
  public totalDiceRolls: number;
  
  @IsNumber()
  public averageSessionLength: number; // In minutes
  
  @IsNumber()
  public activeCharacters: number;
  
  @IsNumber()
  public newCharactersCreated: number;
  
  @IsNumber()
  public charactersLeveledUp: number;
  
  @IsArray()
  public mostPopularClasses: string[];
  
  @IsArray()
  public mostPopularSpells: string[];
  
  @IsArray()
  public mostUsedSkills: string[];
  
  @IsNumber()
  public totalTreasureDistributed: number; // In gold value
  
  @IsNumber()
  public achievementsEarned: number;
  
  @IsNumber()
  public rulesViolationsDetected: number;
  
  @IsArray()
  public topPerformingCampaigns: string[]; // By activity
  
  @IsNumber()
  public generatedAt: number; // ctx.txUnixTime
}