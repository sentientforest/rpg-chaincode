import { SubmitCallDTO } from "@gala-chain/api";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * @description
 *
 * DTO for creating a new party.
 */
export class CreatePartyDto extends SubmitCallDTO {
  @IsNotEmpty()
  public partyId: string;

  @IsNotEmpty()
  public name: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsString()
  public treasurePolicy: string; // "equal_split", "leader_decides", "vote", "individual"

  @IsOptional()
  @IsArray()
  public initialMembers?: string[]; // Character IDs to add immediately

  @IsOptional()
  @IsArray()
  public inviteePlayers?: string[]; // User IDs to send invitations to
}
