import { SubmitCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * DTO for creating feat reference data on-chain.
 * Used by admins to add new feat definitions.
 */
export class CreateFeatDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public type: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public prerequisites: string[];

  @IsNotEmpty()
  public description: string;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];

  @IsOptional()
  @IsNotEmpty()
  public frequency?: string;

  @IsOptional()
  @IsNotEmpty()
  public actions?: string;
}
