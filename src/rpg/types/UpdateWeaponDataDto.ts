import { SubmitCallDTO } from "@gala-chain/api";
import { IsOptional, IsString, IsNotEmpty, IsNumber, Min, Max } from "class-validator";
import { Type } from "class-transformer";

import { CurrencyDto } from "./CurrencyDto";

/**
 * @description
 * 
 * DTO for updating weapon reference data.
 */
export class UpdateWeaponDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the weapon to update
  
  @IsOptional()
  @IsString()
  public category?: string;
  
  @IsOptional()
  @IsString()
  public group?: string;
  
  @IsOptional()
  @Type(() => CurrencyDto)
  public price?: CurrencyDto;
  
  @IsOptional()
  @IsString()
  public damage?: string;
  
  @IsOptional()
  @IsString()
  public damageType?: string;
  
  @IsOptional()
  @IsString({ each: true })
  public traits?: string[];
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number;
  
  @IsOptional()
  @IsString()
  public bulkSpecial?: string; // "L" for light, "—" for negligible
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(2)
  public hands?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(10)
  public range?: number;
  
  @IsOptional()
  @IsString()
  public description?: string;
}