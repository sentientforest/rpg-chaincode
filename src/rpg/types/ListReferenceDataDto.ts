import { ChainCallDTO } from "@gala-chain/api";
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

/**
 * @description
 * 
 * DTO for listing reference data with pagination support.
 */
export class ListReferenceDataDto extends ChainCallDTO {
  @IsOptional()
  @IsString()
  public bookmark?: string; // Pagination bookmark

  @IsOptional()
  @IsNumber()
  @Min(1)
  public limit?: number; // Max results to return
}