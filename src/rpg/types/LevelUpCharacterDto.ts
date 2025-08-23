import { SubmitCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

/**
 * @description
 *
 * DTO for leveling up a character.
 * Handles attribute boosts, skill increases, and feat selections.
 */
export class LevelUpCharacterDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  // Level 5, 10, 15, 20 get 4 attribute boosts
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  @ArrayMinSize(0)
  public attributeBoosts: AttributeModifier[];

  // Skill increases (every level)
  @IsOptional()
  @IsString({ each: true })
  public skillIncreases?: string[]; // Skills to increase proficiency

  // General feat at odd levels
  @IsOptional()
  @IsNotEmpty()
  public generalFeat?: string;

  // Class feat at even levels (varies by class)
  @IsOptional()
  @IsNotEmpty()
  public classFeat?: string;

  // Ancestry feat at odd levels (optional)
  @IsOptional()
  @IsNotEmpty()
  public ancestryFeat?: string;
}
