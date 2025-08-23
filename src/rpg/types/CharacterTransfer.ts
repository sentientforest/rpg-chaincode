import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsArray } from "class-validator";

/**
 * @description
 * 
 * Represents a character transfer between campaigns or worlds.
 * Enables cross-campaign play and character mobility.
 */
export class CharacterTransfer extends ChainObject {
  public static INDEX_KEY = "RPCT";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public transferId: string;
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // When transfer was initiated
  
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public characterOwner: string; // User who owns the character
  
  @IsOptional()
  @IsString()
  public sourceCampaignId?: string; // Campaign character is leaving
  
  @IsOptional()
  @IsString()
  public targetCampaignId?: string; // Campaign character is joining
  
  @IsOptional()
  @IsString()
  public sourceWorldId?: string; // World character is leaving
  
  @IsOptional()
  @IsString()
  public targetWorldId?: string; // World character is joining
  
  @IsString()
  public transferType: string; // "campaign_to_campaign", "world_to_world", "retirement"
  
  @IsString()
  public reason: string; // Why transfer is happening
  
  @IsString()
  public status: string; // "pending", "approved", "rejected", "completed"
  
  @IsArray()
  public characterData: any[]; // Snapshot of character at transfer time
  
  @IsArray()
  public approvalRequired: string[]; // User IDs who must approve
  
  @IsArray()
  public approvedBy: string[]; // User IDs who have approved
  
  @IsOptional()
  @IsString()
  public sourceGM?: string; // GM approving character leaving
  
  @IsOptional()
  @IsString()
  public targetGM?: string; // GM approving character entering
  
  @IsBoolean()
  public retainHistory: boolean; // Keep character's event history
  
  @IsBoolean()
  public retainAchievements: boolean; // Keep character's achievements
  
  @IsOptional()
  @IsString()
  public transferConditions?: string; // Special conditions for transfer
  
  @IsNumber()
  public initiatedAt: number; // ctx.txUnixTime
  
  @IsOptional()
  @IsNumber()
  public completedAt?: number; // When transfer finished
}