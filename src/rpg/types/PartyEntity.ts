import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * Represents a party or group of characters.
 * Manages shared resources, treasury, and group activities.
 */
export class PartyEntity extends ChainObject {
  public static INDEX_KEY = "RPPA";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public partyId: string;

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsNotEmpty()
  public leader: string; // Character ID of party leader

  @IsArray()
  public memberIds: string[]; // Character IDs in the party

  @IsArray()
  public invitedPlayers: string[]; // User IDs with pending invitations

  @IsBoolean()
  public isActive: boolean;

  @IsString()
  public treasurePolicy: string; // "equal_split", "leader_decides", "vote", "individual"

  @IsOptional()
  @IsString()
  public currentCampaign?: string; // Campaign the party is participating in

  @IsNumber()
  public createdAt: number; // ctx.txUnixTime

  @IsNotEmpty()
  public createdBy: string; // User who created the party
}
