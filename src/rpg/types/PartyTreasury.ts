import { BigNumberIsNotNegative, BigNumberProperty, ChainKey, ChainObject } from "@gala-chain/api";
import BigNumber from "bignumber.js";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
