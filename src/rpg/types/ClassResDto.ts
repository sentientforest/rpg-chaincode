import { BigNumberIsInteger, BigNumberIsNotInfinity, BigNumberProperty, ChainCallDTO } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";
import { TraitData } from "./TraitData";

export class ClassResDto extends ChainCallDTO {
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
  @Type(() => TraitData)
  traits: TraitData[];

  // todo: initial proficiencies
}
