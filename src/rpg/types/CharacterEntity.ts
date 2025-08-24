import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsOptional } from "class-validator";

/**
 * @description
 *
 * Main character entity representing a player character.
 * This serves as the root entity in the ECS architecture.
 * Components are stored separately and referenced by the entity name.
 */
export class CharacterEntity extends ChainObject {
  public static INDEX_KEY = "RPE";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string; // Character name (must be unique per player)

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public owner: string; // Player who owns this character (UserAlias)

  @IsOptional()
  @IsNotEmpty()
  public concept?: string; // Brief character concept/description

  @IsNotEmpty()
  public createdAt: number; // ctx.txUnixTime when created

  @IsNotEmpty()
  public lastModified: number; // ctx.txUnixTime when last updated
}
