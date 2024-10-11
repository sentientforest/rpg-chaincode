import { GalaChainContext, deleteChainObject, getObjectsByKeys } from "@gala-chain/chaincode";

import { ClassData } from "../types";
import { ClassDeleteDto } from "../types/ClassDeleteDto";

export async function deleteClassData(ctx: GalaChainContext, dto: ClassDeleteDto): Promise<ClassData[]> {
  const chainKeys = dto.names.map((name) => {
    return ClassData.getCompositeKeyFromParts(ClassData.INDEX_KEY, [name]);
  });

  const data: ClassData[] = await getObjectsByKeys(ctx, ClassData, chainKeys);

  for (const characterClass of data) {
    await deleteChainObject(ctx, characterClass);
  }

  return data;
}
