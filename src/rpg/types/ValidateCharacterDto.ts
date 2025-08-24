import { ChainCallDTO } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

/**
 * @description
 *
 * DTO for validating character integrity and rule compliance.
 */
export class ValidateCharacterDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsOptional()
  @IsBoolean()
  public includeWarnings?: boolean; // Include non-blocking warnings

  @IsOptional()
  @IsBoolean()
  public checkRuleCompliance?: boolean; // Deep rule validation
}

/**
 * @description
 *
 * Response DTO containing validation results.
 */
export class ValidationResultDto {
  @IsBoolean()
  public isValid: boolean;

  public errors: string[]; // Blocking errors

  public warnings: string[]; // Non-blocking warnings

  public suggestions: string[]; // Optimization suggestions
}
