import { SubmitCallDTO } from "@gala-chain/api";
import { IsIn, IsNotEmpty } from "class-validator";

/**
 * @description
 *
 * DTO for deleting reference data items.
 * Used by admins to remove obsolete or incorrect reference data.
 */
export class DeleteReferenceDataDto extends SubmitCallDTO {
  @IsIn(["ancestry", "background", "weapon", "armor", "skill", "feat", "spell", "trait", "heritage"])
  public dataType: string;

  @IsNotEmpty()
  public name: string;
}
