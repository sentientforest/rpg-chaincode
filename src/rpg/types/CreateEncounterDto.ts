import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsArray, Min, Max } from "class-validator";

/**
 * @description
 * 
 * DTO for creating a new encounter.
 */
export class CreateEncounterDto extends SubmitCallDTO {
  @IsNotEmpty()
  public campaignId: string;
  
  @IsNotEmpty()
  public encounterId: string;
  
  @IsNotEmpty()
  public name: string;
  
  @IsOptional()
  @IsString()
  public description?: string;
  
  @IsString()
  public encounterType: string; // "combat", "social", "exploration", "puzzle"
  
  @IsNumber()
  @Min(1)
  @Max(25)
  public level: number;
  
  @IsOptional()
  @IsArray()
  public initialParticipants?: string[]; // Character IDs to add immediately
}