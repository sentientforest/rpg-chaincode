import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

/**
 * @description
 *
 * DTO for updating feat reference data.
 */
export class UpdateFeatDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string; // Required to identify the feat to update

  @IsOptional()
  @IsNumber()
  @Min(1)
  public level?: number;

  @IsOptional()
  @IsString({ each: true })
  public prerequisites?: string[];

  @IsOptional()
  @IsString({ each: true })
  public traits?: string[];

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public frequency?: string;

  @IsOptional()
  @IsString()
  public actions?: string;

  @IsOptional()
  @IsString()
  public type?: string;
}
