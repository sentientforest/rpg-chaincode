import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

import { CurrencyDto } from "./CurrencyDto";

/**
 * @description
 * 
 * DTO for creating armor reference data on-chain.
 * Used by admins to add new armor definitions.
 */
export class CreateArmorDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsIn(["unarmored", "light", "medium", "heavy"])
  public category: string;

  @ValidateNested()
  @Type(() => CurrencyDto)
  public price: CurrencyDto;

  @IsNumber()
  @Min(0)
  @Max(10)
  public acBonus: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  public dexCap?: number;

  @IsNumber()
  @Min(-5)
  @Max(0)
  public checkPenalty: number;

  @IsNumber()
  @Min(-10)
  @Max(0)
  public speedPenalty: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number;

  @IsOptional()
  @IsIn(["L", "—", "-"])
  public bulkSpecial?: string;

  @IsIn(["cloth", "leather", "chain", "plate", "composite"])
  public group: string;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];

  @IsNotEmpty()
  public description: string;
}