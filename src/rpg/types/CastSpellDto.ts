import { SubmitCallDTO } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * DTO for casting a spell.
 */
export class CastSpellDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public spellName: string;

  @IsString()
  public tradition: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  public castAtLevel: number; // Level to cast the spell at

  @IsString()
  public castingSource: string; // "prepared", "spontaneous", "item", "scroll"

  @IsOptional()
  @IsString()
  public encounterId?: string; // If cast during encounter

  @IsOptional()
  @IsArray()
  public targets?: string[]; // Target participant IDs

  @IsOptional()
  @IsNumber()
  public spellSlotUsed?: number; // Which spell slot to consume

  @IsOptional()
  @IsString()
  public randomSeed?: string; // For any random effects
}
