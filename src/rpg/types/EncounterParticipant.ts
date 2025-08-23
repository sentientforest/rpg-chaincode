import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Represents a participant in an encounter (character or NPC).
 * Tracks initiative, conditions, and encounter-specific state.
 */
export class EncounterParticipant extends ChainObject {
  public static INDEX_KEY = "RPEP";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public encounterId: string;

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public participantId: string; // Character ID or NPC ID

  @IsString()
  public participantType: string; // "character", "npc", "hazard"

  @IsOptional()
  @IsString()
  public name?: string; // Display name if different from character name

  @IsNumber()
  @Min(-10)
  @Max(50)
  public initiative: number;

  @IsNumber()
  @Min(0)
  public initiativeBonus: number; // For tie-breaking and calculations

  @IsBoolean()
  public isActive: boolean; // Currently participating

  @IsBoolean()
  public isDefeated: boolean; // Knocked out, fled, etc.

  @IsOptional()
  @IsNumber()
  public currentHP?: number; // Override for NPCs/monsters

  @IsOptional()
  @IsNumber()
  public maxHP?: number; // Override for NPCs/monsters

  @IsString()
  public teamId: string; // "players", "enemies", "neutral", custom team

  @IsOptional()
  @IsString()
  public notes?: string; // GM notes about this participant
}
