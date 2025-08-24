import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Represents a campaign - an ongoing RPG story.
 * Manages campaign-wide settings, participants, and progression.
 */
export class CampaignEntity extends ChainObject {
  public static INDEX_KEY = "RPCA";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public campaignId: string;

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsString()
  public setting: string; // "homebrew", "pathfinder_ap", "custom"

  @IsNotEmpty()
  public gamemaster: string; // User ID of the GM

  @IsArray()
  public playerIds: string[]; // User IDs of players

  @IsArray()
  public characterIds: string[]; // Character IDs in this campaign

  @IsArray()
  public partyIds: string[]; // Party IDs participating

  @IsNumber()
  @Min(1)
  @Max(20)
  public recommendedLevel: number; // Current campaign level range

  @IsBoolean()
  public isActive: boolean;

  @IsBoolean()
  public allowsNewPlayers: boolean;

  @IsString()
  public visibility: string; // "public", "invite_only", "private"

  @IsOptional()
  @IsString()
  public currentChapter?: string; // Current story chapter/module

  @IsNumber()
  public sessionsPlayed: number;

  @IsOptional()
  @IsNumber()
  public lastSessionDate?: number; // ctx.txUnixTime of last session

  @IsNumber()
  public createdAt: number; // ctx.txUnixTime
}
