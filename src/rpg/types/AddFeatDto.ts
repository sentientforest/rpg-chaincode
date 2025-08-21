import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsIn, IsNumber, Min, Max } from "class-validator";

/**
 * @description
 * 
 * DTO for adding a feat to a character.
 */
export class AddFeatDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public featName: string;
  
  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public featType: string;
  
  @IsNotEmpty()
  public source: string; // What granted this feat
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number; // Level when feat was gained
}