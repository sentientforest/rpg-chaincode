import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

import { CurrencyDto } from "./CurrencyDto";

/**
 * @description
 *
 * DTO for updating armor reference data.
 */
export class UpdateArmorDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the armor to update

  @IsOptional()
  @IsString()
  public category?: string;

  @IsOptional()
  @Type(() => CurrencyDto)
  public price?: CurrencyDto;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public acBonus?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public dexCap?: number;

  @IsOptional()
  @IsNumber()
  public checkPenalty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public speedPenalty?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number;

  @IsOptional()
  @IsString()
  public bulkSpecial?: string; // "L" for light, "—" for negligible

  @IsOptional()
  @IsString()
  public group?: string;

  @IsOptional()
  @IsString({ each: true })
  public traits?: string[];

  @IsOptional()
  @IsString()
  public description?: string;
}
