import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

/**
 * @description
 * 
 * DTO for making a skill check.
 */
export class MakeSkillCheckDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public checkId: string; // Unique identifier
  
  @IsString()
  public skillName: string; // Skill being used
  
  @IsOptional()
  @IsString()
  public action?: string; // Specific action
  
  @IsOptional()
  @IsNumber()
  public dc?: number; // Difficulty class (may be secret)
  
  @IsNumber()
  public skillModifier: number; // Character's skill modifier
  
  @IsNotEmpty()
  public randomSeed: string; // For the d20 roll
  
  @IsOptional()
  @IsNumber()
  public circumstanceBonus?: number; // Situational modifiers
  
  @IsOptional()
  @IsNumber()
  public itemBonus?: number; // Equipment bonuses
  
  @IsOptional()
  @IsBoolean()
  public isSecret?: boolean; // Whether result is known
  
  @IsOptional()
  @IsString()
  public assistedBy?: string; // Character providing aid
  
  @IsString()
  public purpose: string; // What the check is for
  
  @IsOptional()
  @IsString()
  public encounterId?: string; // If made during encounter
}