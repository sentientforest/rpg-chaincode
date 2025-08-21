import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

/**
 * @description
 * 
 * DTO for performing a dice roll with oracle-provided randomness.
 */
export class RollDiceDto extends SubmitCallDTO {
  @IsNotEmpty()
  public rollId: string; // Unique identifier for this roll
  
  @IsString()
  public rollType: string; // "ability_check", "attack", "damage", "save", "initiative", "custom"
  
  @IsNotEmpty()
  public diceExpression: string; // e.g., "2d6+3", "1d20", "4d6kh3"
  
  @IsNumber()
  public modifier: number; // Fixed modifier to add
  
  @IsNotEmpty()
  public randomSeed: string; // Oracle-provided seed for deterministic randomness
  
  @IsOptional()
  @IsString()
  public purpose?: string; // What this roll is for
  
  @IsOptional()
  @IsString()
  public targetDC?: string; // Difficulty class if applicable
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // If rolled during an encounter
}