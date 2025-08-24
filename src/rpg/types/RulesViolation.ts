import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * Records and tracks violations of game rules.
 * Enables automated enforcement and audit trails.
 */
export class RulesViolation extends ChainObject {
  public static INDEX_KEY = "RPRV";

  @ChainKey({ position: 0 })
  @IsString()
  public timestamp: string; // Padded timestamp

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public violationId: string;

  @IsString()
  public violationType: string; // "character_creation", "advancement", "combat", "spellcasting"

  @IsString()
  public severity: string; // "warning", "error", "critical"

  @IsString()
  public ruleViolated: string; // Specific rule or constraint

  @IsString()
  public description: string; // What was violated

  @IsOptional()
  @IsString()
  public characterName?: string; // Character involved (if any)

  @IsOptional()
  @IsString()
  public campaignId?: string; // Campaign where violation occurred

  @IsOptional()
  @IsString()
  public encounterId?: string; // Encounter where violation occurred

  @IsOptional()
  @IsString()
  public transactionId?: string; // Transaction that caused violation

  @IsArray()
  public violationData: any[]; // Specific data about the violation

  @IsBoolean()
  public wasAutoFixed: boolean; // Was violation automatically corrected

  @IsOptional()
  @IsString()
  public correctionAction?: string; // What was done to fix it

  @IsBoolean()
  public requiresGMReview: boolean; // Needs manual review

  @IsOptional()
  @IsString()
  public gmNotes?: string; // GM comments on violation

  @IsBoolean()
  public isResolved: boolean;

  @IsNumber()
  public detectedAt: number; // ctx.txUnixTime

  @IsOptional()
  @IsNumber()
  public resolvedAt?: number; // When resolved
}
