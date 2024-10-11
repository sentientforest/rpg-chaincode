import {
  BigNumberIsInteger,
  BigNumberIsNotNegative,
  BigNumberProperty,
  ChainCallDTO,
  StringEnumProperty
} from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";
import { HeritageData } from "./HeritageData";
import { SizeOptions } from "./SizeOptions";
import { TraitData } from "./TraitData";

export class AncestryDto extends ChainCallDTO {
  /**
   * @example
   *
   * Human, Elf, Dwarf
   */
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

  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => TraitData)
  traits: TraitData[];

  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => HeritageData)
  heritageOptions: HeritageData[];
}
