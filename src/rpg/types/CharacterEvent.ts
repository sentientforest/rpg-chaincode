import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsOptional, IsBoolean } from "class-validator";

/**
 * @description
 * 
 * Immutable event record for character history.
 * Tracks all character changes for audit trail and rollback capability.
 */
export class CharacterEvent extends ChainObject {
  public static INDEX_KEY = "RPEV";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string; // Character name
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public timestamp: string; // Padded txUnixTime for sorting
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public txId: string; // Transaction ID for uniqueness
  
  @IsNotEmpty()
  public eventType: string; // "level_up", "equipment_change", "state_update", etc.
  
  @IsNotEmpty()
  public description: string; // Human-readable description
  
  @IsOptional()
  public eventData?: any; // Type-specific event data
  
  @IsBoolean()
  public isValid: boolean; // Whether this event is still valid
  
  @IsNotEmpty()
  public triggeredBy: string; // UserAlias who triggered the event
}