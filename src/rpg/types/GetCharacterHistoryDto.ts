import { ChainCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, IsBoolean } from "class-validator";

/**
 * @description
 * 
 * DTO for querying character event history.
 */
export class GetCharacterHistoryDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsOptional()
  @IsString()
  public eventType?: string; // Filter by event type
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  public limit?: number; // Max events to return
  
  @IsOptional()
  @IsString()
  public bookmark?: string; // Pagination bookmark
  
  @IsOptional()
  @IsNumber()
  public startDate?: number; // Unix timestamp for start of date range
  
  @IsOptional()
  @IsNumber()
  public endDate?: number; // Unix timestamp for end of date range
  
  @IsOptional()
  @IsBoolean()
  public validOnly?: boolean; // Only return valid events
}