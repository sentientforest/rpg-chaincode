import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsIn, IsNotEmpty, IsNumber } from "class-validator";

/**
 * @description
 *
 * Individual fact representing a feat possessed by a character.
 * Each feat is stored as a separate chain object for efficient querying.
 */
export class CharacterFeat extends ChainObject {
  public static INDEX_KEY = "RPFT";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public featName: string;

  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public featType: string;

  @IsNotEmpty()
  public source: string; // Which granted this feat

  @IsNumber()
  public level: number; // Level when feat was gained
}
