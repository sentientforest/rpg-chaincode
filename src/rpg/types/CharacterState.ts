import { ChainObject, ChainKey } from "@gala-chain/api";

/**
 * @description
 * 
 * Represents character state data (current HP, conditions, etc.).
 * Part of Phase 1 implementation - placeholder for now.
 */
export class CharacterState extends ChainObject {
  public static INDEX_KEY = "RCS";
  
  @ChainKey({ position: 0 })
  public characterId: string;
  
  public currentHP: number;
  public temporaryHP: number;
  public conditions: string[];
  public lastUpdated: number; // timestamp
}