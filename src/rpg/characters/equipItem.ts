import { createValidChainObject } from "@gala-chain/api";
import { GalaChainContext, getObjectByKey, putChainObject } from "@gala-chain/chaincode";

import {
  EquipItemDto,
  CharacterEquipment,
  CharacterEntity
} from "../types";

export async function equipItem(
  ctx: GalaChainContext,
  dto: EquipItemDto
): Promise<void> {
  // 1. Verify character exists and caller owns it
  const characterKey = CharacterEntity.getCompositeKeyFromParts(
    CharacterEntity.INDEX_KEY,
    [dto.characterName, ctx.callingUser]
  );
  await getObjectByKey(ctx, CharacterEntity, characterKey);
  
  // 2. Get the equipment item
  const equipmentKey = CharacterEquipment.getCompositeKeyFromParts(
    CharacterEquipment.INDEX_KEY,
    [dto.characterName, dto.itemId]
  );
  const equipment = await getObjectByKey(ctx, CharacterEquipment, equipmentKey);
  
  // 3. Update equipped status
  const updatedEquipment = await createValidChainObject(CharacterEquipment, {
    ...equipment,
    isEquipped: dto.isEquipped
  });
  
  // 4. Save to chain
  await putChainObject(ctx, updatedEquipment);
}