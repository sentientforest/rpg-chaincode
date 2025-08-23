import { SubmitCallDTO } from "@gala-chain/api";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from "class-validator";

/**
 * @description
 *
 * DTO for adding equipment to a character.
 */
export class AddEquipmentDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;

  @IsNotEmpty()
  public itemName: string; // Reference to weapon/armor/gear data

  @IsNotEmpty()
  public itemType: string; // "weapon", "armor", "gear", "consumable"

  @IsNumber()
  @Min(1)
  public quantity: number;

  @IsOptional()
  @IsBoolean()
  public equipImmediately?: boolean; // Auto-equip if possible

  @IsOptional()
  @IsNotEmpty()
  public containerSlot?: string; // "backpack", "belt pouch", etc.
}
