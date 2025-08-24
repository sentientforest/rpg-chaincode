import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * Records a skill check attempt with all relevant details.
 * Tracks secret checks, aid bonuses, and circumstances.
 */
export class SkillCheck extends ChainObject {
  public static INDEX_KEY = "RPSC";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;

  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp

  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public checkId: string; // Unique identifier

  @IsString()
  public skillName: string; // "athletics", "perception", "stealth", etc.

  @IsOptional()
  @IsString()
  public action?: string; // Specific action taken ("climb", "hide", "recall knowledge")

  @IsOptional()
  @IsNumber()
  public dc?: number; // Difficulty class (may be secret)

  @IsNumber()
  public rollResult: number; // D20 result

  @IsNumber()
  public skillModifier: number; // Character's skill modifier

  @IsOptional()
  @IsNumber()
  public circumstanceBonus?: number; // Situational modifiers

  @IsOptional()
  @IsNumber()
  public itemBonus?: number; // Equipment bonuses

  @IsNumber()
  public totalResult: number; // Final result after all modifiers

  @IsOptional()
  @IsBoolean()
  public isSuccess?: boolean; // May be unknown if DC is secret

  @IsOptional()
  @IsString()
  public degreeOfSuccess?: string; // "critical_failure", "failure", "success", "critical_success"

  @IsBoolean()
  public isSecret: boolean; // Whether result is known to player

  @IsOptional()
  @IsString()
  public assistedBy?: string; // Character providing aid

  @IsString()
  public purpose: string; // What the check was attempting

  @IsOptional()
  @IsString()
  public outcome?: string; // What happened as a result

  @IsOptional()
  @IsString()
  public encounterId?: string; // If made during encounter

  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}
