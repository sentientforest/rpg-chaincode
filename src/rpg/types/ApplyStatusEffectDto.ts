import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min } from "class-validator";

/**
 * @description
 * 
 * DTO for applying a status effect or condition to a character.
 */
export class ApplyStatusEffectDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public effectId: string; // Unique identifier for this effect instance
  
  @IsString()
  public effectName: string; // "frightened", "poisoned", etc.
  
  @IsString()
  public effectType: string; // "condition", "spell", "disease", "curse"
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  public intensity?: number; // Effect level/intensity
  
  @IsOptional()
  @IsNumber()
  public duration?: number; // Duration in rounds, -1 for permanent
  
  @IsOptional()
  @IsString()
  public source?: string; // What caused this effect
  
  @IsOptional()
  @IsString()
  public sourceId?: string; // ID of the source
  
  @IsOptional()
  @IsString()
  public description?: string; // Effect description
  
  @IsOptional()
  @IsBoolean()
  public isHidden?: boolean; // Hidden from other players
  
  @IsOptional()
  @IsString()
  public endCondition?: string; // How the effect ends
  
  @IsOptional()
  @IsNumber()
  public saveDC?: number; // DC for saves to end effect
  
  @IsOptional()
  @IsString()
  public saveType?: string; // Type of save required
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // If applied during encounter
}