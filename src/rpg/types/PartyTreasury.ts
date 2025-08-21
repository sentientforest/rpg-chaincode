import { BigNumberProperty, ChainKey, ChainObject, BigNumberIsNotNegative } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsArray, IsNumber } from "class-validator";
import BigNumber from "bignumber.js";

/**
 * @description
 * 
 * Manages party shared treasury and resources.
 * Tracks collective wealth and treasure distribution.
 */
export class PartyTreasury extends ChainObject {
  public static INDEX_KEY = "RPTR";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public partyId: string;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public goldPieces: BigNumber;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public silverPieces: BigNumber;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public copperPieces: BigNumber;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public platinumPieces: BigNumber;
  
  @IsArray()
  public sharedItems: string[]; // Item IDs that belong to the party
  
  @IsArray()
  public treasureHistory: string[]; // Transaction IDs of treasure events
  
  @IsNumber()
  public lastUpdated: number; // ctx.txUnixTime
}