import {
  BigNumberIsInteger,
  BigNumberIsNotInfinity,
  BigNumberProperty,
  ChainKey,
  ChainObject
} from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

export class ClassData extends ChainObject {
  public static INDEX_KEY = "RCD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @Type(() => AttributeModifier)
  keyAttribute: AttributeModifier;

  @BigNumberProperty()
  @BigNumberIsInteger()
  @BigNumberIsNotInfinity()
  hitPointsBase: BigNumber;

  /**
   * @description
   *
   * Each trait should be a composite key string that references
   * a TraitData entry stored in on-chain World State.
   */
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => String)
  traits: string[];

  // todo: initial proficiencies
  // e.g. Perception, Saving Throws, Skills, Attacks, Defenses, Class DC

  // todo: advancement by class
}
