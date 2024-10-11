import { ChainCallDTO, IsUserAlias } from "@gala-chain/api";
import { Type } from "class-transformer";
import { ArrayMinSize, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from "class-validator";

import { AncestryComponent } from "./AncestryComponent";
import { AncestryData } from "./AncestryData";
import { AttributesComponent } from "./AttributesComponent";
import { TraitComponent } from "./TraitComponent";
import { TraitData } from "./TraitData";

export class PlayerCharacterResDto extends ChainCallDTO {
  @IsUserAlias()
  public identity: string;

  @IsNotEmpty()
  public name: string;

  @ValidateNested()
  @Type(() => AncestryComponent)
  ancestry: AncestryComponent;

  @ValidateNested()
  @Type(() => AttributesComponent)
  attributes: AttributesComponent;

  /**
   * @description
   *
   * Specify traits by `name` property. Chaincode will
   * handle generation of composite keys.
   */
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => TraitComponent)
  traits: TraitComponent[];
}
