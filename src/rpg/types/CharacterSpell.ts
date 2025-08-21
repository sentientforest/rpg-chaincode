import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, Min, Max, IsIn } from "class-validator";

/**
 * @description
 * 
 * Individual fact representing a spell known/prepared by a character.
 * Each spell is stored as a separate chain object for efficient querying.
 */
export class CharacterSpell extends ChainObject {
  public static INDEX_KEY = "RPSP";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public spellName: string;
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public tradition: string; // "arcane", "divine", "occult", "primal"
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public spellLevel: number; // 0 for cantrips
  
  @IsIn(["known", "prepared", "spontaneous"])
  public castingType: string;
  
  @IsNotEmpty()
  public source: string; // "class", "feat", "item", etc.
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public gainedAtLevel: number; // When this spell was gained
}