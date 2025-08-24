import { SubmitCallDTO } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty } from "class-validator";

/**
 * @description
 *
 * DTO for equipping/unequipping an item.
 */
export class EquipItemDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public itemId: string; // Specific item instance

  @IsBoolean()
  public isEquipped: boolean; // true to equip, false to unequip
}
