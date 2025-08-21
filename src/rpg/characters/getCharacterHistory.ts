import { GalaChainContext, getObjectByKey, getObjectsByPartialCompositeKeyWithPagination } from "@gala-chain/chaincode";

import {
  GetCharacterHistoryDto,
  CharacterEntity,
  CharacterEvent
} from "../types";

export interface CharacterHistoryDto {
  characterName: string;
  events: CharacterEvent[];
  totalEvents: number;
  hasMore: boolean;
  bookmark?: string;
}

export async function getCharacterHistory(
  ctx: GalaChainContext,
  dto: GetCharacterHistoryDto
): Promise<CharacterHistoryDto> {
  // 1. Verify character exists and caller has access
  const characterKey = CharacterEntity.getCompositeKeyFromParts(
    CharacterEntity.INDEX_KEY,
    [dto.characterName, ctx.callingUser]
  );
  await getObjectByKey(ctx, CharacterEntity, characterKey);
  
  // 2. Set defaults for pagination
  const limit = dto.limit || 50;
  const maxLimit = 100;
  const effectiveLimit = Math.min(limit, maxLimit);
  
  // 3. Query character events with pagination
  const eventsResult = await getObjectsByPartialCompositeKeyWithPagination(
    ctx,
    CharacterEvent.INDEX_KEY,
    [dto.characterName],
    CharacterEvent,
    dto.bookmark,
    effectiveLimit + 1 // Get one extra to check if there are more
  );
  
  // 4. Filter by event type if specified
  let filteredEvents = eventsResult.results;
  
  if (dto.eventType) {
    filteredEvents = filteredEvents.filter(event => event.eventType === dto.eventType);
  }
  
  // 5. Filter by date range if specified
  if (dto.startDate || dto.endDate) {
    filteredEvents = filteredEvents.filter(event => {
      const eventTime = parseInt(event.timestamp);
      
      if (dto.startDate && eventTime < dto.startDate) {
        return false;
      }
      
      if (dto.endDate && eventTime > dto.endDate) {
        return false;
      }
      
      return true;
    });
  }
  
  // 6. Filter by validity if specified
  if (dto.validOnly !== undefined) {
    filteredEvents = filteredEvents.filter(event => event.isValid === dto.validOnly);
  }
  
  // 7. Check if there are more results
  const hasMore = filteredEvents.length > effectiveLimit;
  if (hasMore) {
    filteredEvents = filteredEvents.slice(0, effectiveLimit);
  }
  
  // 8. Sort events by timestamp (most recent first) if not already sorted
  filteredEvents.sort((a, b) => {
    const timeA = parseInt(a.timestamp);
    const timeB = parseInt(b.timestamp);
    return timeB - timeA; // Descending order (newest first)
  });
  
  return {
    characterName: dto.characterName,
    events: filteredEvents,
    totalEvents: filteredEvents.length,
    hasMore,
    bookmark: hasMore ? eventsResult.metadata?.bookmark : undefined
  };
}