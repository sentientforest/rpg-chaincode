import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Represents a combat action with attack rolls, damage, and resolution.
 * Handles strikes, spell attacks, and other combat maneuvers.
 */
export class CombatAction extends ChainObject {
  public static INDEX_KEY = "RPCO";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public encounterId: string;

  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // Padded timestamp

  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public actionId: string; // Unique action identifier

  @IsNotEmpty()
  public attackerId: string; // Character or NPC performing the action

  @IsNotEmpty()
  public defenderId: string; // Target of the action

  @IsString()
  public actionType: string; // "strike", "spell_attack", "maneuver", "grapple", "trip"

  @IsOptional()
  @IsString()
  public weaponUsed?: string; // Weapon ID if applicable

  @IsNumber()
  public attackRoll: number; // D20 + modifiers

  @IsNumber()
  public attackBonus: number; // Total bonus applied to attack

  @IsNumber()
  public targetAC: number; // Target's armor class

  @IsBoolean()
  public isHit: boolean; // Whether attack hit

  @IsBoolean()
  public isCritical: boolean; // Critical hit/miss

  @IsOptional()
  @IsArray()
  public damageRolls?: number[]; // Individual damage dice

  @IsOptional()
  @IsNumber()
  public totalDamage?: number; // Total damage dealt

  @IsOptional()
  @IsString()
  public damageType?: string; // "slashing", "piercing", "bludgeoning", "fire", etc.

  @IsOptional()
  @IsNumber()
  public damageReduction?: number; // Resistance/immunity reduction

  @IsOptional()
  @IsNumber()
  public finalDamage?: number; // Damage after all modifiers

  @IsOptional()
  @IsArray()
  public appliedEffects?: string[]; // Status effects applied

  @IsNumber()
  public roundNumber: number; // Combat round

  @IsNumber()
  public performedAt: number; // ctx.txUnixTime
}
