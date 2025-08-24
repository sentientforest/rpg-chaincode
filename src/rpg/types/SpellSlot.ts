import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * @description
 *
 * Represents spell slots for prepared casters.
 * Tracks daily spell slot usage and recovery.
 */
export class SpellSlot extends ChainObject {
  public static INDEX_KEY = "RPSS";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;

  @ChainKey({ position: 1 })
  @IsNumber()
  @Min(0)
  @Max(10)
  public spellLevel: number;

  @ChainKey({ position: 2 })
  @IsNumber()
  @Min(1)
  public slotNumber: number; // Which slot of this level

  @IsString()
  public tradition: string; // "arcane", "divine", "primal", "occult"

  @IsBoolean()
  public isUsed: boolean;

  @IsOptional()
  @IsString()
  public preparedSpell?: string; // Spell name if prepared

  @IsOptional()
  @IsString()
  public castingSource?: string; // "class", "multiclass", "item", "feat"

  @IsNumber()
  public dailyRefreshTime: number; // When slots refresh (usually dawn)

  @IsNumber()
  public lastUsed: number; // ctx.txUnixTime when last used
}
