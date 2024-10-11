import { ChainCallDTO } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, ValidateNested } from "class-validator";

export class TraitDeleteDto extends ChainCallDTO {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => String)
  names: string[];
}
