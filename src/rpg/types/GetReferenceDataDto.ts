import { ChainCallDTO } from "@gala-chain/api";
import { IsNotEmpty } from "class-validator";

/**
 * @description
 * 
 * DTO for querying specific reference data items by name.
 */
export class GetReferenceDataDto extends ChainCallDTO {
  @IsNotEmpty()
  public name: string;
}