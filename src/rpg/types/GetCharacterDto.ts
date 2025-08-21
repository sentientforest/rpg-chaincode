import { ChainCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * @description
 * 
 * DTO for querying a specific character by name.
 */
export class GetCharacterDto extends ChainCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsOptional()
  @IsNotEmpty()
  public owner?: string; // Optional filter by owner
}