import { BigNumberIsNotNegative, BigNumberProperty, ChainKey, ChainObject } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

/**
 * @description
 *
 * Character progression data component.
 * Contains level, experience, and other progression-related information.
 * Changes infrequently (mainly on level-up).
 */
export class CharacterProgression extends ChainObject {
  public static INDEX_KEY = "RPPR";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;

  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number;

  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public experience: BigNumber;

  @IsNotEmpty()
  public ancestryName: string;

  @IsNotEmpty()
  public backgroundName: string;

  @IsNotEmpty()
  public className: string;

  @IsNumber()
  public lastLevelUp: number; // ctx.txUnixTime when last leveled up
}
