import { ChainKey, ChainObject, ValidationFailedError } from "@gala-chain/api";
import { Exclude } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

import { AttributeModifier, AttributeModifierType } from "./AttributeModifier";

/**
 * @description
 *
 * Attributes that describe the referenced `entity`.
 * The `entity` attribute should be a composite chain key
 * string of an entity that exists in the on-chain
 * World State.
 */
export class AttributesComponent extends ChainObject {
  public static INDEX_KEY = "RPAT";
  
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
   * @param modifier
   * @param modifies
   */
  @Exclude()
  public boost(modifier: AttributeModifier, modifies: AttributeModifierType) {
    if (
      modifier.affects !== modifies &&
      modifier.affects !== AttributeModifierType.Free &&
      !(modifier.affects == AttributeModifierType.Limit && modifier.limitTo?.includes(modifies))
    ) {
      throw new ValidationFailedError(
        `Attempted to boost attribute ${modifies} with modifier ${modifier.affects} ` +
          `${Array.isArray(modifier.limitTo) ? modifier.limitTo.join(", ") : ""}`
      );
    }

    if (modifies === AttributeModifierType.Strength) {
      if (this.strength < 14) {
        this.strength = this.strength + 1;
      } else if (this.strengthPartialBoost) {
        this.strength = this.strength + 1;
        this.strengthPartialBoost = false;
      } else {
        this.strengthPartialBoost = true;
      }
    } else if (modifies === AttributeModifierType.Dexterity) {
      if (this.dexterity < 14) {
        this.dexterity = this.dexterity + 1;
      } else if (this.dexterityPartialBoost) {
        this.dexterity = this.dexterity + 1;
        this.dexterityPartialBoost = false;
      } else {
        this.dexterityPartialBoost = true;
      }
    } else if (modifies === AttributeModifierType.Constitution) {
      if (this.constitution < 14) {
        this.constitution = this.constitution + 1;
      } else if (this.constitutionPartialBoost) {
        this.constitution = this.constitution + 1;
        this.constitutionPartialBoost = false;
      } else {
        this.constitutionPartialBoost = true;
      }
    } else if (modifies === AttributeModifierType.Intelligence) {
      if (this.intelligence < 14) {
        this.intelligence = this.intelligence + 1;
      } else if (this.intelligencePartialBoost) {
        this.intelligence = this.intelligence + 1;
        this.intelligencePartialBoost = false;
      } else {
        this.intelligencePartialBoost = true;
      }
    } else if (modifies === AttributeModifierType.Wisdom) {
      if (this.wisdom < 14) {
        this.wisdom = this.wisdom + 1;
      } else if (this.wisdomPartialBoost) {
        this.wisdom = this.wisdom + 1;
        this.wisdomPartialBoost = false;
      } else {
        this.wisdomPartialBoost = true;
      }
    } else if (modifies === AttributeModifierType.Charisma) {
      if (this.charisma < 14) {
        this.charisma = this.charisma + 1;
      } else if (this.charismaPartialBoost) {
        this.charisma = this.charisma + 1;
        this.charismaPartialBoost = false;
      } else {
        this.charismaPartialBoost = true;
      }
    } else {
      throw new ValidationFailedError(
        `Attempted to boost attribute with unsupported AttributeModifierType: ${modifies}`
      );
    }
  }

  /**
   * @description
   *
   * Apply an Attribute Flaw to this Entity's Attributes
   *
   * @param modifier
   * @param modifies
   */
  @Exclude()
  public reduce(modifier: AttributeModifier, modifies: AttributeModifierType) {
    if (
      modifier.affects !== modifies &&
      modifier.affects !== AttributeModifierType.Free &&
      !(modifier.affects == AttributeModifierType.Limit && modifier.limitTo?.includes(modifies))
    ) {
      throw new ValidationFailedError(
        `Attempted to reduce attribute ${modifies} with modifier ${modifier.affects} ` +
          `${Array.isArray(modifier.limitTo) ? modifier.limitTo.join(", ") : ""}`
      );
    }

    if (modifies === AttributeModifierType.Strength) {
      if (this.strength < 14) {
        this.strength = this.strength - 1;
      } else if (this.strengthPartialBoost) {
        this.strengthPartialBoost = false;
      } else {
        this.strength = this.strength - 1;
        this.strengthPartialBoost = this.strength >= 14;
      }
    } else if (modifies === AttributeModifierType.Dexterity) {
      if (this.dexterity < 14) {
        this.dexterity = this.dexterity - 1;
      } else if (this.dexterityPartialBoost) {
        this.dexterityPartialBoost = false;
      } else {
        this.dexterity = this.dexterity - 1;
        this.dexterityPartialBoost = this.dexterity >= 14;
      }
    } else if (modifies === AttributeModifierType.Constitution) {
      if (this.constitution < 14) {
        this.constitution = this.constitution - 1;
      } else if (this.constitutionPartialBoost) {
        this.constitutionPartialBoost = false;
      } else {
        this.constitution = this.constitution - 1;
        this.constitutionPartialBoost = this.constitution >= 14;
      }
    } else if (modifies === AttributeModifierType.Intelligence) {
      if (this.intelligence < 14) {
        this.intelligence = this.intelligence - 1;
      } else if (this.intelligencePartialBoost) {
        this.intelligencePartialBoost = false;
      } else {
        this.intelligence = this.intelligence - 1;
        this.intelligencePartialBoost = this.intelligence >= 14;
      }
    } else if (modifies === AttributeModifierType.Wisdom) {
      if (this.wisdom < 14) {
        this.wisdom = this.wisdom - 1;
      } else if (this.wisdomPartialBoost) {
        this.wisdomPartialBoost = false;
      } else {
        this.wisdom = this.wisdom - 1;
        this.wisdomPartialBoost = this.wisdom >= 14;
      }
    } else if (modifies === AttributeModifierType.Charisma) {
      if (this.charisma < 14) {
        this.charisma = this.charisma - 1;
      } else if (this.charismaPartialBoost) {
        this.charisma = this.charisma - 1;
        this.charismaPartialBoost = false;
      } else {
        this.charismaPartialBoost = this.charisma >= 14;
      }
    } else {
      throw new ValidationFailedError(
        `Attempted to reduce attribute with unsupported AttributeModifierType: ${modifies}`
      );
    }
  }
}
