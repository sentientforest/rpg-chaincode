import { ChainKey, ChainObject, IsUserAlias } from "@gala-chain/api";
import { IsNotEmpty } from "class-validator";

/**
 * @description
 *
 * A Player Character created / controlled by the user
 * identity referenced in the `identity` property.
 */
export class PlayerCharacterEntity extends ChainObject {
  public static INDEX_KEY = "RPCE";

  @ChainKey({ position: 0 })
  @IsUserAlias()
  public identity: string;

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public name: string;
}
