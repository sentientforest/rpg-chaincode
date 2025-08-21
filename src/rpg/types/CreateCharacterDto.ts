import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

/**
 * @description
 * 
 * DTO for creating a new player character.
 * Contains all the basic information needed for character creation.
 */
export class CreateCharacterDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsOptional()
  @IsNotEmpty()
  public concept?: string;
  
  @IsNotEmpty()
  public ancestryName: string;
  
  @IsNotEmpty()
  public backgroundName: string;
  
  @IsNotEmpty()
  public className: string;
  
  // Starting attribute array (before racial/background modifiers)
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  @ArrayMinSize(4) // 4 attribute boosts for starting character
  public attributeBoosts: AttributeModifier[];
  
  @IsOptional()
  @IsString({ each: true })
  public startingFeats?: string[]; // Optional starting feats beyond the automatic ones
}