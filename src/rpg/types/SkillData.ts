import { ChainKey, ChainObject } from "@gala-chain/api";
import { ArrayMinSize, IsBoolean, IsIn, IsNotEmpty } from "class-validator";

/**
 * @description
 * 
 * Reference data for skill definitions. This represents the 
 * base mechanical properties of skills available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class SkillData extends ChainObject {
  public static INDEX_KEY = "RSD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsIn(["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"])
  public keyAttribute: string;

  @IsNotEmpty()
  public description: string;

  @ArrayMinSize(0)
  public trainedActions: string[]; // Actions requiring training

  @IsBoolean()
  public hasArmorCheckPenalty: boolean;
}