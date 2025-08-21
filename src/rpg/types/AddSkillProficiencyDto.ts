import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsIn } from "class-validator";

/**
 * @description
 * 
 * DTO for adding or upgrading a skill proficiency.
 */
export class AddSkillProficiencyDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public skillName: string;
  
  @IsIn(["untrained", "trained", "expert", "master", "legendary"])
  public proficiencyRank: string;
  
  @IsNotEmpty()
  public source: string; // "background", "class", "general", "ancestry"
}