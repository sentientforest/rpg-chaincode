import { SubmitCallDTO } from "@gala-chain/api";
import { IsOptional, IsString, IsNotEmpty, IsNumber, Min, Max } from "class-validator";

/**
 * @description
 * 
 * DTO for updating spell reference data.
 */
export class UpdateSpellDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the spell to update
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  public level?: number;
  
  @IsOptional()
  @IsString({ each: true })
  public traditions?: string[];
  
  @IsOptional()
  @IsString()
  public castingTime?: string;
  
  @IsOptional()
  @IsString({ each: true })
  public components?: string[];
  
  @IsOptional()
  @IsString()
  public range?: string;
  
  @IsOptional()
  @IsString()
  public area?: string;
  
  @IsOptional()
  @IsString()
  public duration?: string;
  
  @IsOptional()
  @IsString({ each: true })
  public traits?: string[];
  
  @IsOptional()
  @IsString()
  public description?: string;
  
  @IsOptional()
  @IsString()
  public heightening?: string;
  
  @IsOptional()
  @IsString()
  public rarity?: string;
}