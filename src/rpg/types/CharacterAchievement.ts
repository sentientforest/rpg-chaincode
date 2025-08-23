import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsArray } from "class-validator";

/**
 * @description
 * 
 * Represents achievements and milestones earned by characters.
 * Tracks memorable moments and accomplishments across campaigns.
 */
export class CharacterAchievement extends ChainObject {
  public static INDEX_KEY = "RPAC";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsString()
  public dateEarned: string; // YYYYMMDD format
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public achievementId: string;
  
  @IsNotEmpty()
  public achievementName: string;
  
  @IsString()
  public description: string;
  
  @IsString()
  public category: string; // "combat", "exploration", "social", "milestone", "special"
  
  @IsString()
  public rarity: string; // "common", "uncommon", "rare", "legendary"
  
  @IsOptional()
  @IsString()
  public campaignId?: string; // Campaign where earned
  
  @IsOptional()
  @IsString()
  public sessionId?: string; // Session where earned
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // Specific encounter if applicable
  
  @IsArray()
  public witnessedBy: string[]; // Other character IDs present
  
  @IsOptional()
  @IsString()
  public specialReward?: string; // Any special reward granted
  
  @IsBoolean()
  public isSecret: boolean; // Hidden achievement
  
  @IsBoolean()
  public isRepeatable: boolean; // Can be earned multiple times
  
  @IsOptional()
  @IsNumber()
  public progressValue?: number; // For incremental achievements
  
  @IsOptional()
  @IsNumber()
  public maxProgress?: number; // Target for incremental achievements
  
  @IsNumber()
  public earnedAt: number; // ctx.txUnixTime
}