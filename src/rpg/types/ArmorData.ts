import { BigNumberIsNotNegative, BigNumberProperty, ChainKey, ChainObject } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

/**
 * @description
 *
 * Reference data for armor definitions. This represents the
 * base mechanical properties of armor available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class ArmorData extends ChainObject {
  public static INDEX_KEY = "RAR";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsIn(["unarmored", "light", "medium", "heavy"])
  public category: string;

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public price: BigNumber; // In copper pieces

  @IsNumber()
  @Min(0)
  @Max(10)
  public acBonus: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  public dexCap?: number; // Max Dex bonus

  @IsNumber()
  @Min(-5)
  @Max(0)
  public checkPenalty: number;

  @IsNumber()
  @Min(-10)
  @Max(0)
  public speedPenalty: number;

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulk: BigNumber;

  @IsIn(["cloth", "leather", "chain", "plate", "composite"])
  public group: string;

  @ArrayMinSize(0)
  public traits: string[];

  @IsNotEmpty()
  public description: string;
}
