import { ChainCallDTO } from "@gala-chain/api";
import { IsOptional, IsString, IsNumber, Min } from "class-validator";

/**
 * @description
 * 
 * DTO for listing characters with pagination and filtering.
 */
export class ListCharactersDto extends ChainCallDTO {
  @IsOptional()
  @IsString()
  public owner?: string; // Filter by owner
  
  @IsOptional()
  @IsString()
  public ancestryName?: string; // Filter by ancestry
  
  @IsOptional()
  @IsString()
  public className?: string; // Filter by class
  
  @IsOptional()
  @IsString()
  public bookmark?: string; // Pagination bookmark
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  public limit?: number; // Max results to return
}