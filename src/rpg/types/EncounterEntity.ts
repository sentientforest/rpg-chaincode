import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Encounter entity representing a combat or social encounter.
 * Contains basic encounter information and state.
 */
export class EncounterEntity extends ChainObject {
  public static INDEX_KEY = "RPEN";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public campaignId: string; // Campaign this encounter belongs to

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public encounterId: string; // Unique encounter identifier

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsString()
  public encounterType: string; // "combat", "social", "exploration", "puzzle"

  @IsNumber()
  @Min(1)
  @Max(25)
  public level: number; // Encounter level/difficulty

  @IsString()
  public status: string; // "pending", "active", "completed", "paused"

  @IsArray()
  public participantIds: string[]; // Character IDs participating

  @IsNumber()
  public createdAt: number; // ctx.txUnixTime

  @IsOptional()
  @IsNumber()
  public startedAt?: number; // When encounter became active

  @IsOptional()
  @IsNumber()
  public completedAt?: number; // When encounter finished

  @IsNotEmpty()
  public gamemaster: string; // User who created/manages encounter
}
