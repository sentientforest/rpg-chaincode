import { ChainCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, ValidateNested } from "class-validator";

import { TraitData } from "./TraitData";

export class TraitDto extends ChainCallDTO {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => TraitData)
  traits: TraitData[];
}
