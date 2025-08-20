import { 
  GalaChainContext, 
  getObjectsByPartialCompositeKey,
  getObjectsByPartialCompositeKeyWithPagination 
} from "@gala-chain/chaincode";

import {
  CharacterEntity,
  ListCharactersDto
} from "../types";

export async function listCharacters(
  ctx: GalaChainContext,
  dto: ListCharactersDto
): Promise<CharacterEntity[]> {
  let queryParts: string[] = [];
  
  // Build partial composite key based on filters
  if (dto.owner) {
    // Query by owner: [name, owner]
    // Since name comes first in key, we can't directly filter by owner only
    // We'll need to get all and filter in memory for now
    // In a production system, we might want a separate index by owner
  }
  
  // For now, get all characters and filter in memory
  let characters: CharacterEntity[];
  
  if (dto.bookmark || dto.limit) {
    const result = await getObjectsByPartialCompositeKeyWithPagination(
      ctx,
      CharacterEntity.INDEX_KEY,
      queryParts,
      CharacterEntity,
      dto.bookmark,
      dto.limit
    );
    characters = result.results;
  } else {
    characters = await getObjectsByPartialCompositeKey(
      ctx,
      CharacterEntity.INDEX_KEY,
      queryParts,
      CharacterEntity
    );
  }
  
  // Apply filters in memory
  let filteredCharacters = characters;
  
  if (dto.owner) {
    filteredCharacters = filteredCharacters.filter(char => char.owner === dto.owner);
  }
  
  // For ancestry and class filters, we'd need to join with progression data
  // For now, return the basic filtered list
  return filteredCharacters;
}