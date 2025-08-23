import { BigNumberIsNotNegative, BigNumberProperty, ChainKey, ChainObject } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Character state data component.
 * Contains current hit points, conditions, and other frequently-changing state.
 * Updates frequently during gameplay.
 */
export class CharacterState extends ChainObject {
  public static INDEX_KEY = "RPST";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public currentHP: BigNumber;

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public temporaryHP: BigNumber;

  @IsNumber()
  @Min(0)
  @Max(3)
  public heroPoints: number;

  @IsNumber()
  @Min(0)
  public focusPoints: number;

  @ArrayMinSize(0)
  @IsString({ each: true })
  public conditions: string[]; // "blinded", "frightened 1", etc.

  @IsNumber()
  public lastUpdated: number; // ctx.txUnixTime
}
