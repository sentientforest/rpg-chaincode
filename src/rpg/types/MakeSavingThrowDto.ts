import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * DTO for making a saving throw.
 */
export class MakeSavingThrowDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public saveId: string; // Unique identifier

  @IsString()
  public saveType: string; // "fortitude", "reflex", "will"

  @IsNumber()
  public dc: number; // Difficulty class

  @IsNumber()
  public modifier: number; // Character's save modifier

  @IsNotEmpty()
  public randomSeed: string; // For the d20 roll

  @IsString()
  public purpose: string; // What the save is for

  @IsOptional()
  @IsString()
  public sourceEffect?: string; // What triggered the save

  @IsOptional()
  @IsString()
  public encounterId?: string; // If made during encounter
}
