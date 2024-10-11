import { ChainCallDTO } from "@gala-chain/api";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

export class PlayerCharacterDto extends ChainCallDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  ancestry: string;

  @IsOptional()
  @IsNotEmpty()
  heritage: string;

  /**
   * @description
   *
   * Some ancestries proivde attribute choices -
   * e.g. a "Free" attribute boost, or a choice
   * between two options (Strength OR Constitution).
   *
   */
  @IsOptional()
  @ArrayMinSize(0)
  ancestryAttributeChoices?: AttributeModifier[];

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

  /**
   * @description
   *
   * Specify traits by `name` property. Chaincode will
   * handle generation of composite keys.
   */
  @ArrayMinSize(0)
  traits: string[];
}
