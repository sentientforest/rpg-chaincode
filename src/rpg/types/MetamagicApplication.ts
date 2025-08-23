import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsArray, Min, Max } from "class-validator";

/**
 * @description
 * 
 * Records metamagic feats applied to spell casting.
 * Tracks heightening, extending, and other spell modifications.
 */
export class MetamagicApplication extends ChainObject {
  public static INDEX_KEY = "RPMA";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public castingActionId: string; // Links to CastSpellAction
  
  @ChainKey({ position: 1 })
  @IsString()
  public timestamp: string; // When metamagic was applied
  
  @IsNotEmpty()
  public casterName: string;
  
  @IsNotEmpty()
  public spellName: string;
  
  @IsArray()
  public metamagicFeats: string[]; // Names of metamagic feats used
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public originalLevel: number; // Spell's base level
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public effectiveLevel: number; // Level after metamagic
  
  @IsNumber()
  public additionalSlotCost: number; // Extra spell slots used
  
  @IsString()
  public modifications: string; // Description of changes
  
  @IsArray()
  public modifiedStats: any[]; // Specific stat changes
  
  @IsNumber()
  public appliedAt: number; // ctx.txUnixTime
}