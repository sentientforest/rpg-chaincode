import { SubmitCallDTO } from "@gala-chain/api";
import { IsOptional, IsString, IsNotEmpty, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

import { AttributeModifier } from "./AttributeModifier";

/**
 * @description
 * 
 * DTO for updating background reference data.
 */
export class UpdateBackgroundDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the background to update
  
  @IsOptional()
  @IsString()
  public description?: string;
  
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeBoosts?: AttributeModifier[];
  
  @IsOptional()
  @IsString()
  public trainedSkill?: string;
  
  @IsOptional()
  @IsString()
  public loreSkill?: string;
  
  @IsOptional()
  @IsString()
  public skillFeat?: string;
  
  @IsOptional()
  @IsString()
  public category?: string;
}