import { ChainKey, ChainObject } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, ValidateNested } from "class-validator";

import { AttributeModifier } from "./AttributeModifier";

/**
 * @description
 *
 * Reference data for background definitions. This represents the
 * base mechanical properties of backgrounds available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class BackgroundData extends ChainObject {
  public static INDEX_KEY = "RBD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public description: string;

  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeBoosts: AttributeModifier[]; // Usually 2: one limited, one free

  @IsNotEmpty()
  public trainedSkill: string;

  @IsNotEmpty()
  public loreSkill: string;

  @IsNotEmpty()
  public skillFeat: string;

  @IsNotEmpty()
  public category: string; // "Professional", "Social", "Combat", etc.
}
