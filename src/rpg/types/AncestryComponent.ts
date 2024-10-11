import { ChainKey, ChainObject, StringEnumProperty } from "@gala-chain/api";
import { IsNotEmpty, IsNumber } from "class-validator";

export class AncestryComponent extends ChainObject {
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  entity: string;

  @IsNotEmpty()
  ancestry: string;

  @IsNotEmpty()
  heritage: string;
}
