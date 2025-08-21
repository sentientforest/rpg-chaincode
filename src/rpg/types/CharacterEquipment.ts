import { 
  BigNumberIsNotNegative, 
  BigNumberIsPositive, 
  BigNumberProperty, 
  ChainKey, 
  ChainObject 
} from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { IsBoolean, IsNotEmpty, IsOptional } from "class-validator";

/**
 * @description
 * 
 * Individual fact representing an equipment item owned by a character.
 * Each equipment item is stored as a separate chain object for efficient querying.
 */
export class CharacterEquipment extends ChainObject {
  public static INDEX_KEY = "RPEQ";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public itemId: string; // UUID for item instance
  
  @IsNotEmpty()
  public itemName: string;
  
  @IsNotEmpty()
  public itemType: string; // "weapon", "armor", "gear", "consumable"
  
  @BigNumberProperty()
  @BigNumberIsPositive()
  public quantity: BigNumber;
  
  @IsBoolean()
  public isEquipped: boolean;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulkPerItem: BigNumber;
  
  @IsOptional()
  @IsNotEmpty()
  public containerSlot?: string; // "backpack", "belt pouch", etc.
}