import { ChainKey, ChainObject } from "@gala-chain/api";
import { ArrayMinSize, IsIn, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";

/**
 * @description
 * 
 * Reference data for spell definitions. This represents the 
 * base mechanical properties of spells available in the game.
 * Stored on-chain as reference data, not tied to specific characters.
 */
export class SpellData extends ChainObject {
  public static INDEX_KEY = "RSP";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  public level: number; // 0 for cantrips

  @ArrayMinSize(1)
  @IsIn(["arcane", "divine", "occult", "primal"], { each: true })
  public traditions: string[];

  @IsNotEmpty()
  public castingTime: string; // "1", "2", "3", "1 minute", etc.

  @ArrayMinSize(0)
  @IsIn(["material", "somatic", "verbal", "focus"], { each: true })
  public components: string[];

  @IsNotEmpty()
  public range: string; // "touch", "30 feet", "500 feet", etc.

  @IsOptional()
  @IsNotEmpty()
  public area?: string; // "10-foot burst", "30-foot cone", etc.

  @IsNotEmpty()
  public duration: string; // "instantaneous", "1 minute", "sustained", etc.

  @ArrayMinSize(0)
  public traits: string[];

  @IsNotEmpty()
  public description: string;

  @IsOptional()
  @IsNotEmpty()
  public heightening?: string; // JSON string describing heightening effects

  @IsIn(["common", "uncommon", "rare", "unique"])
  public rarity: string;
}