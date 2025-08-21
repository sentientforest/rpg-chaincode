import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, Min, Max, IsIn } from "class-validator";

/**
 * @description
 * 
 * DTO for adding a spell to a character's spell list.
 */
export class AddSpellDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public spellName: string;
  
  @IsIn(["arcane", "divine", "occult", "primal"])
  public tradition: string;
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public spellLevel: number;
  
  @IsIn(["known", "prepared", "spontaneous"])
  public castingType: string;
  
  @IsNotEmpty()
  public source: string; // What granted this spell
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public gainedAtLevel: number;
}