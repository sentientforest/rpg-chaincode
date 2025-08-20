import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

/**
 * @description
 * 
 * DTO for creating background reference data on-chain.
 * Used by admins to add new background definitions.
 */
export class CreateBackgroundDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public description: string;

  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeBoosts: AttributeModifier[];

  @IsNotEmpty()
  public trainedSkill: string;

  @IsNotEmpty()
  public loreSkill: string;

  @IsNotEmpty()
  public skillFeat: string;

  @IsNotEmpty()
  public category: string;
}