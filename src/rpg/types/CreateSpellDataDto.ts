import { SubmitCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * DTO for creating spell reference data on-chain.
 * Used by admins to add new spell definitions.
 */
export class CreateSpellDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  public level: number;

  @ArrayMinSize(1)
  @IsIn(["arcane", "divine", "occult", "primal"], { each: true })
  public traditions: string[];

  @IsNotEmpty()
  public castingTime: string;

  @ArrayMinSize(0)
  @IsIn(["material", "somatic", "verbal", "focus"], { each: true })
  public components: string[];

  @IsNotEmpty()
  public range: string;

  @IsOptional()
  @IsNotEmpty()
  public area?: string;

  @IsNotEmpty()
  public duration: string;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];

  @IsNotEmpty()
  public description: string;

  @IsOptional()
  @IsNotEmpty()
  public heightening?: string;

  @IsIn(["common", "uncommon", "rare", "unique"])
  public rarity: string;
}
