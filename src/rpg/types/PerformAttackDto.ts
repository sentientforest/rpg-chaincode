import { SubmitCallDTO } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from "class-validator";

/**
 * @description
 * 
 * DTO for performing an attack action in combat.
 */
export class PerformAttackDto extends SubmitCallDTO {
  @IsNotEmpty()
  public encounterId: string;
  
  @IsNotEmpty()
  public attackerId: string; // Attacker character/NPC ID
  
  @IsNotEmpty()
  public defenderId: string; // Target character/NPC ID
  
  @IsString()
  public actionType: string; // "strike", "spell_attack", "maneuver"
  
  @IsOptional()
  @IsString()
  public weaponUsed?: string; // Weapon or spell name
  
  @IsNumber()
  public attackBonus: number; // Total attack bonus
  
  @IsNumber()
  public targetAC: number; // Target's armor class
  
  @IsNotEmpty()
  public randomSeed: string; // For attack roll
  
  @IsOptional()
  @IsString()
  public damageExpression?: string; // Damage dice expression
  
  @IsOptional()
  @IsString()
  public damageType?: string; // Type of damage
  
  @IsOptional()
  @IsBoolean()
  public hasAdvantage?: boolean; // Roll twice, take higher
  
  @IsOptional()
  @IsBoolean()
  public hasDisadvantage?: boolean; // Roll twice, take lower
}