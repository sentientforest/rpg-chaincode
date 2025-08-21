import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsIn, IsNotEmpty } from "class-validator";

/**
 * @description
 * 
 * Individual fact representing a character's proficiency in a specific skill.
 * Each skill proficiency is stored as a separate chain object for efficient querying.
 */
export class CharacterSkillProficiency extends ChainObject {
  public static INDEX_KEY = "RPSK";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public skillName: string;
  
  @IsIn(["untrained", "trained", "expert", "master", "legendary"])
  public proficiencyRank: string;
  
  @IsNotEmpty()
  public source: string; // "background", "class", "general", "ancestry"
}