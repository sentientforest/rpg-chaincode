import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, putChainObject, getObjectByKey } from "@gala-chain/chaincode";
import BigNumber from "bignumber.js";

import {
  AddEquipmentDto,
  CharacterEquipment,
  WeaponData,
  ArmorData,
  CharacterEntity
} from "../types";

export async function addEquipment(
  ctx: GalaChainContext,
  dto: AddEquipmentDto
): Promise<void> {
  const currentTime = ctx.txUnixTime;
  const txId = ctx.stub.getTxID();
  
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(
    CharacterEntity.INDEX_KEY,
    [dto.characterName, ctx.callingUser]
  );
  await getObjectByKey(ctx, CharacterEntity, characterKey);
  
  // 2. Get item data to determine bulk
  let bulkPerItem = new BigNumber(1); // Default bulk
  
  try {
    if (dto.itemType === "weapon") {
      const weaponKey = WeaponData.getCompositeKeyFromParts(WeaponData.INDEX_KEY, [dto.itemName]);
      const weaponData = await getObjectByKey(ctx, WeaponData, weaponKey);
      bulkPerItem = weaponData.bulk;
    } else if (dto.itemType === "armor") {
      const armorKey = ArmorData.getCompositeKeyFromParts(ArmorData.INDEX_KEY, [dto.itemName]);
      const armorData = await getObjectByKey(ctx, ArmorData, armorKey);
      bulkPerItem = armorData.bulk;
    }
    // For other item types, could lookup from additional reference data
  } catch (error) {
    // If item data not found, continue with default bulk
  }
  
  // 3. Create unique item ID (deterministic)
  const itemId = `${dto.characterName}_${dto.itemName}_${txId}`;
  
  // 4. Create equipment entry
  const equipment = await createValidChainObject(CharacterEquipment, {
    entity: dto.characterName,
    itemId: itemId,
    itemName: dto.itemName,
    itemType: dto.itemType,
    quantity: new BigNumber(dto.quantity),
    isEquipped: dto.equipImmediately || false,
    bulkPerItem: bulkPerItem,
    containerSlot: dto.containerSlot
  });
  
  // 5. Save to chain
  await putChainObject(ctx, equipment);
}