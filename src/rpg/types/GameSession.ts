import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * Represents a game session within a campaign.
 * Tracks session details, participants, and outcomes.
 */
export class GameSession extends ChainObject {
  public static INDEX_KEY = "RPGS";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public campaignId: string;

  @ChainKey({ position: 1 })
  @IsString()
  public sessionDate: string; // YYYYMMDD format for easy sorting

  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public sessionId: string; // Unique session identifier

  @IsOptional()
  @IsString()
  public title?: string; // Session title/name

  @IsOptional()
  @IsString()
  public summary?: string; // What happened in this session

  @IsArray()
  public participantCharacters: string[]; // Character IDs who participated

  @IsArray()
  public participantPlayers: string[]; // User IDs who participated

  @IsArray()
  public encountersRun: string[]; // Encounter IDs from this session

  @IsOptional()
  @IsNumber()
  public experienceAwarded?: number; // Total XP awarded this session

  @IsOptional()
  @IsString()
  public treasureAwarded?: string; // Description of treasure gained

  @IsBoolean()
  public wasCompleted: boolean; // Did session finish normally

  @IsNumber()
  public sessionLength: number; // Duration in minutes

  @IsNumber()
  public startedAt: number; // ctx.txUnixTime when session began

  @IsOptional()
  @IsNumber()
  public endedAt?: number; // ctx.txUnixTime when session ended

  @IsNotEmpty()
  public gamemaster: string; // User ID of GM for this session
}
