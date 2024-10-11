import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";
import { AttributeModifier } from "./AttributeBoost";
import { Exclude } from "class-transformer";

/**
 * @description
 * 
 * Attributes that describe the referenced `entity`. 
 * The `entity` attribute should be a composite chain key 
 * string of an entity that exists in the on-chain 
 * World State. 
 */
export class AttributesComponent extends ChainObject {
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  entity: string;

  @IsNumber()
  strength: number;

  @IsNumber()
  dexterity: number;

  @IsNumber()
  constitution: number;

  @IsNumber()
  intelligence: number;

  @IsNumber()
  wisdom: number;

  @IsNumber()
  charisma: number;

  @IsBoolean()
  strengthPartialBoost: boolean;

  @IsBoolean()
  dexterityPartialBoost: boolean;

  @IsBoolean()
  constitutionPartialBoost: boolean;

  @IsBoolean()
  intelligencePartialBoost: boolean;

  @IsBoolean()
  wisdomPartialBoost: boolean;

  @IsBoolean()
  charismaPartialBoost: boolean;

  /**
   * @description
   * 
   * Apply an Attribute Boost to this Entity's Attributes.
   * 
   * @param attribute 
   */
  @Exclude()
  boost(attribute: AttributeModifier) {
    // todo: implement 
  }

  /**
   * @description
   * 
   * Apply an Attribute Flaw to this Entity's Attributes
   * 
   * @param attribute 
   */
  @Exclude()
  reduce(attribute: AttributeModifier) {
    // todo: implement
  }
}