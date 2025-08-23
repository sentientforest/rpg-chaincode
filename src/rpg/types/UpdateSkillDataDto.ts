import { SubmitCallDTO } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * DTO for updating skill reference data.
 */
export class UpdateSkillDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the skill to update

  @IsOptional()
  @IsString()
  public keyAttribute?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString({ each: true })
  public trainedActions?: string[];

  @IsOptional()
  @IsBoolean()
  public hasArmorCheckPenalty?: boolean;
}
