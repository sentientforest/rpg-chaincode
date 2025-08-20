import { ChainObject, ChainKey } from "@gala-chain/api";
import BigNumber from "bignumber.js";

/**
 * @description
 * 
 * Represents an equipment item owned by a character.
 * Part of Phase 1 implementation - placeholder for now.
 */
export class CharacterEquipment extends ChainObject {
  public static INDEX_KEY = "RCE";
  
  @ChainKey({ position: 0 })
  public characterId: string;
  
  @ChainKey({ position: 1 })
  public equipmentId: string;
  
  public itemName: string;
  public quantity: number;
  public isEquipped: boolean;
  public containerSlot: string | undefined;
  public bulkPerItem: BigNumber;
}