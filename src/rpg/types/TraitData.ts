import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsOptional } from "class-validator";

export class TraitData extends ChainObject {
  public static INDEX_KEY = "RTD";

  @ChainKey({ position: 0 })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
