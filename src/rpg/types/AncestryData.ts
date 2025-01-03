import {
  BigNumberIsInteger,
  BigNumberIsNotNegative,
  BigNumberProperty,
  ChainKey,
  ChainObject,
  StringEnumProperty
} from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";
import { SizeOptions } from "./SizeOptions";
import { TraitComponent } from "./TraitComponent";
import { TraitData } from "./TraitData";

/**
 * @description
 *
 * Abstract Data class. Not tied to a particular
 * entity, this entry represents general data
 * specific to a given Ancestry. It is expected to
 * initialize the default values of an
 * AncestryComponent during Character Creation.
 */
export class AncestryData extends ChainObject {
  public static INDEX_KEY = "RAD";

  /**
   * @example
   *
   * Human, Elf, Dwarf
   */
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @BigNumberProperty()
  @BigNumberIsInteger()
  @BigNumberIsNotNegative()
  hitPoints: BigNumber;

  @StringEnumProperty(SizeOptions)
  size: SizeOptions;

  @BigNumberProperty()
  @BigNumberIsInteger()
  @BigNumberIsNotNegative()
  speed: BigNumber;

  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  attributeBoosts: AttributeModifier[];

  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  attributeFlaws: AttributeModifier[];

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
}
