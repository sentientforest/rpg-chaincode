import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty } from "class-validator";

export class TraitComponent extends ChainObject {
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  entity: string;

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  name: string;
}