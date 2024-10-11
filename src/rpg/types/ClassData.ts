import { BigNumberIsInteger, BigNumberIsNotInfinity, BigNumberProperty, ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty } from "class-validator";
import { AttributeModifier } from "./AttributeBoost";
import { Type } from "class-transformer";
import BigNumber from "bignumber.js";

export class ClassData extends ChainObject {
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

  // todo: initial proficiencies 
  // e.g. Perception, Saving Throws, Skills, Attacks, Defenses, Class DC

  // todo: advancement by class 
}