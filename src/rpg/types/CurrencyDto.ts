import { IsNumber, IsOptional, Min } from "class-validator";

/**
 * @description
 * 
 * DTO for representing currency amounts in various denominations.
 * Used for equipment pricing and other monetary values.
 */
export class CurrencyDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  public platinum?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public gold?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public silver?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  public copper?: number;
}