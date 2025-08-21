import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";

import { CurrencyDto } from "./CurrencyDto";

/**
 * @description
 * 
 * DTO for creating weapon reference data on-chain.
 * Used by admins to add new weapon definitions.
 */
export class CreateWeaponDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsIn(["simple", "martial", "advanced"])
  public category: string;

  @IsNotEmpty()
  public group: string; // "sword", "axe", "bow", etc.

  @ValidateNested()
  @Type(() => CurrencyDto)
  public price: CurrencyDto;

  @IsNotEmpty()
  public damage: string; // "1d8", "2d6", etc.

  @IsIn(["slashing", "piercing", "bludgeoning"])
  public damageType: string;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number; // Optional, may be "L" or "—" as special cases

  @IsOptional()
  @IsIn(["L", "—", "-"])
  public bulkSpecial?: string; // "L" for light, "—" for negligible

  @IsNumber()
  @Min(1)
  @Max(2)
  public hands: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  public range?: number; // In feet for ranged weapons

  @IsNotEmpty()
  public description: string;
}