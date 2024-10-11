import { ChainObject, createValidDTO } from "@gala-chain/api";
import {
  GalaChainContext,
  createValidChainObject,
  getObjectByKey,
  putChainObject
} from "@gala-chain/chaincode";

import {
  AncestryComponent,
  AncestryData,
  AttributesComponent,
  PlayerCharacterDto,
  PlayerCharacterEntity,
  PlayerCharacterResDto,
  TraitComponent,
  TraitData
} from "../types";

export async function createPlayerCharacter(ctx: GalaChainContext, dto: PlayerCharacterDto) {
  const identity: string = ctx.callingUser;
  const {
    name,
    ancestry,
    heritage,
    ancestryAttributeChoices,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    traits
  } = dto;

  const characterEntity: PlayerCharacterEntity = await createValidChainObject(PlayerCharacterEntity, {
    identity,
    name
  });

  const entity: string = characterEntity.getCompositeKey();

  const characterAttributes: AttributesComponent = await createValidChainObject(AttributesComponent, {
    entity,
    strength,
    dexterity,
    constitution,
    intelligence,
    wisdom,
    charisma,
    strengthPartialBoost: false,
    dexterityPartialBoost: false,
    constitutionPartialBoost: false,
    intelligencePartialBoost: false,
    wisdomPartialBoost: false,
    charismaPartialBoost: false
  });

  const ancestryKey = AncestryData.getCompositeKeyFromParts(AncestryData.INDEX_KEY, [ancestry]);

  const ancestryChoice: AncestryData = await getObjectByKey(ctx, AncestryData, ancestryKey);

  // todo: implement boost/reduce
  // todo: implement ancestry choices relevant to attribute boosts
  for (const boost of ancestryChoice.attributeBoosts) {
    characterAttributes.boost(boost);
  }

  for (const flaw of ancestryChoice.attributeFlaws) {
    characterAttributes.reduce(flaw);
  }

  const characterAncestry: AncestryComponent = await createValidChainObject(AncestryComponent, {
    entity,
    ancestry,
    heritage
  });

  const characterTraits: TraitComponent[] = [];

  for (const traitName of ancestryChoice.traits) {
    const traitData = await getObjectByKey(
      ctx,
      TraitData,
      TraitData.getCompositeKeyFromParts(TraitData.INDEX_KEY, [traitName])
    );

    const characterTrait = await createValidChainObject(TraitComponent, {
      entity,
      name: traitName
    });

    characterTraits.push(characterTrait);
  }

  await putChainObject(ctx, characterEntity);
  await putChainObject(ctx, characterAttributes);
  await putChainObject(ctx, characterAncestry);

  for (const characterTrait of characterTraits) {
    await putChainObject(ctx, characterTrait);
  }

  const response = await createValidDTO(PlayerCharacterResDto, {
    identity,
    name,
    ancestry: characterAncestry,
    attributes: characterAttributes,
    traits: characterTraits
  });

  return response;
}
