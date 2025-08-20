import { ChainObject, ChainKey } from "@gala-chain/api";

/**
 * @description
 * 
 * Represents character progression data (level, XP, etc.).
 * Part of Phase 1 implementation - placeholder for now.
 */
export class CharacterProgression extends ChainObject {
  public static INDEX_KEY = "RCP";
  
  @ChainKey({ position: 0 })
  public characterId: string;
  
  public level: number;
  public experience: number;
  public lastLevelUp: number; // timestamp
}