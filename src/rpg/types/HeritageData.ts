import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsOptional } from "class-validator";

export class HeritageData extends ChainObject {
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  ancestry: string;

  @ChainKey({ position: 1 })
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;
}