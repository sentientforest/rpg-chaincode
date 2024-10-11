import { GalaChainContext, createValidChainObject, putChainObject } from "@gala-chain/chaincode";

import { ClassData } from "../types";
import { ClassDto } from "../types";

export async function saveClassData(ctx: GalaChainContext, dto: ClassDto): Promise<ClassData> {
  for (const trait of dto.traits) {
    await putChainObject(ctx, trait);
  }

  const classData = await createValidChainObject(ClassData, {
    ...dto,
    traits: dto.traits.map((t) => t.getCompositeKey())
  });

  await putChainObject(ctx, classData);

  return classData;
}
