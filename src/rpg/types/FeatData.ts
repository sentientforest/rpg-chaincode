import { ChainKey, ChainObject } from "@gala-chain/api";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

/**
 * @description
 * 
 * Reference data for feat definitions. This represents the 
 * base mechanical properties of feats available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class FeatData extends ChainObject {
  public static INDEX_KEY = "RFD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public type: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number; // Minimum level required

  @ArrayMinSize(0)
  public prerequisites: string[]; // Other requirements

  @IsNotEmpty()
  public description: string;

  @ArrayMinSize(0)
  public traits: string[];

  @IsOptional()
  @IsNotEmpty()
  public frequency?: string; // "once per day", "at will", etc.

  @IsOptional()
  @IsNotEmpty()
  public actions?: string; // "1", "2", "3", "reaction", "free"
}