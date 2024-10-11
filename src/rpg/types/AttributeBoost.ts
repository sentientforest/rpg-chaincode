import { StringEnumProperty } from "@gala-chain/api";
import { ArrayMinSize, IsOptional, ValidateIf, ValidateNested } from "class-validator";

export enum AttributeModifierType {
  Free = "",
  Strength = "Strength",
  Dexterity = "Dexterity",
  Constitution = "Constitution",
  Intelligence = "Intelligence",
  Wisdom = "Widsom",
  Charisma = "Charisma",
  Limit = "Limit"
}

export class AttributeModifier {
  @StringEnumProperty(AttributeModifierType)
  affects: AttributeModifierType;

  @IsOptional()
  @ValidateIf((a) => a.boostType === AttributeModifierType.Limit)
  @ArrayMinSize(2)
  limitTo?: AttributeModifierType[]
}