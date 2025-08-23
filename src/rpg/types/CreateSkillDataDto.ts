import { SubmitCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsBoolean, IsIn, IsNotEmpty, IsString } from "class-validator";

/**
 * @description
 *
 * DTO for creating skill reference data on-chain.
 * Used by admins to add new skill definitions.
 */
export class CreateSkillDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsIn(["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"])
  public keyAttribute: string;

  @IsNotEmpty()
  public description: string;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public trainedActions: string[];

  @IsBoolean()
  public hasArmorCheckPenalty: boolean;
}
