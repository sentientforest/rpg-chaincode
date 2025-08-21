import {
  BigNumberIsNotNegative,
  BigNumberProperty,
  ChainKey,
  ChainObject
} from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

/**
 * @description
 * 
 * Reference data for weapon definitions. This represents the 
 * base mechanical properties of weapons available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class WeaponData extends ChainObject {
  public static INDEX_KEY = "RWD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsIn(["simple", "martial", "advanced"])
  public category: string;

  @IsNotEmpty()
  public group: string; // "sword", "axe", "bow", etc.

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public price: BigNumber; // In copper pieces

  @IsNotEmpty()
  public damage: string; // "1d8", "2d6", etc.

  @IsIn(["slashing", "piercing", "bludgeoning"])
  public damageType: string;

  @ArrayMinSize(0)
  public traits: string[];

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulk: BigNumber; // 0 = negligible, 0.1 = light, 1+ = normal

  @IsNumber()
  @Min(1)
  @Max(2)
  public hands: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  public range?: number; // In feet for ranged weapons

  @IsNotEmpty()
  public description: string;
}