import { SubmitCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * DTO for updating character state (HP, conditions, hero points, etc.).
 */
export class UpdateCharacterStateDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public currentHP?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public temporaryHP?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(3)
  public heroPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public focusPoints?: number;

  @IsOptional()
  @ArrayMinSize(0)
  @IsString({ each: true })
  public conditions?: string[]; // Add/replace conditions

  @IsOptional()
  @IsString({ each: true })
  public removeConditions?: string[]; // Conditions to remove
}
