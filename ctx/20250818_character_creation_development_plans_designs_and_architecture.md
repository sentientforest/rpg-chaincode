# Character Creation Development Plans, Designs, and Architecture
**Date:** August 18, 2025  
**Status:** Architecture & Development Planning  
**Objective:** Complete character creation system implementation on GalaChain

## Executive Summary

This document outlines the comprehensive development plan for implementing a complete character creation system for the RPG chaincode on GalaChain. Based on the analysis of Pathfinder RPG mechanics and current implementation status, we identify critical gaps and propose an iterative development approach following blockchain best practices.

## Current State Analysis

### What's Implemented
1. **Basic Character Entity** (`PlayerCharacterEntity`)
   - Minimal structure with identity and name only
   - Uses chain keys for player identity + character name

2. **Component System Started**
   - `AttributesComponent` - Basic attribute tracking
   - `AncestryComponent` - Basic ancestry/heritage tracking
   - `TraitComponent` - Basic trait tracking

3. **Data Management Functions**
   - Basic CRUD for ancestry, class, and trait data
   - Simple character creation function (incomplete)

### Critical Gaps
1. **No Character Creation Workflow** - Missing the 10-step creation process
2. **No Background System** - Backgrounds not implemented
3. **No Class System** - Classes not implemented beyond data storage
4. **No Skills System** - Skills completely missing
5. **No Feats System** - Feats not implemented
6. **No Equipment System** - Equipment/inventory not implemented
7. **No Spellcasting System** - Spells not implemented
8. **No Proficiency System** - Proficiency ranks not tracked
9. **No Level/Advancement System** - Character progression missing
10. **No Validation System** - Rule validation incomplete
11. **Data Modeling Issues** - Current code mixes update frequencies and lacks individual facts for collections

### Data Modeling Problems Identified
1. **Array Anti-Pattern** - Original plan used arrays instead of individual ChainObjects
2. **Mixed Update Frequencies** - Level (rare) and current HP (frequent) in same object
3. **Missing Collections** - No way to handle multiple ancestry feats, skills, equipment items
4. **Inefficient Queries** - Can't leverage partial composite key queries effectively

## Data Architecture Design

### Core Principle: Facts, Not Objects

Following GalaChain best practices, we model character data as distributed facts rather than monolithic objects. **Key insight: Replace arrays with individual ChainObjects that can be queried via partial composite keys.**

This approach provides:
- Better query flexibility
- Reduced MVCC conflicts  
- Improved scalability
- Clear audit trails
- Separation of frequently vs infrequently updated data

### Chain Key Design Strategy

Following the existing RPG codebase pattern: Use `entity` (character composite key) as position 0, then specific identifiers.

#### Character Core Identity (Immutable)
```typescript
// Extends existing PlayerCharacterEntity pattern
class PlayerCharacterEntity extends ChainObject {
  public static INDEX_KEY = "RPCE";
  
  @ChainKey({ position: 0 })
  @IsUserAlias()
  public identity: string; // Player identity
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public name: string; // Character name
  
  // Immutable core data
  public characterId: string; // UUID for internal reference
  public createdAt: number;
  public concept: string;
}
```

#### Character Level/Progression (Infrequently Updated)
```typescript
// Separate from frequently-changing data
class CharacterProgression extends ChainObject {
  public static INDEX_KEY = "RPCP";
  
  @ChainKey({ position: 0 })
  public entity: string; // Character composite key
  
  // Level progression data (changes rarely)
  public level: number;
  public experiencePoints: BigNumber;
  public hitPointsMax: BigNumber;
  public ancestryBonus: number; // HP from ancestry
  public classBonus: number;    // HP from class levels
}
```

#### Character Current State (Frequently Updated)
```typescript
// Separate object for frequently changing data
class CharacterState extends ChainObject {
  public static INDEX_KEY = "RPCS";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  // Current state (changes frequently)
  public hitPointsCurrent: BigNumber;
  public temporaryHP: BigNumber;
  public heroPoints: number;
  public focusPoints: number;
  public lastUpdated: number;
}
```

#### Individual Facts Pattern (Following TraitComponent)
```typescript
// Ancestry Feat - Individual Fact (Not Array)
class CharacterAncestryFeat extends ChainObject {
  public static INDEX_KEY = "RCAF";
  
  @ChainKey({ position: 0 })
  public entity: string; // Character composite key
  
  @ChainKey({ position: 1 })
  public featName: string; // Specific feat
  
  // Additional feat data if needed
  public source: string; // "ancestry" | "heritage" | "general"
}

// Class Feature - Individual Fact
class CharacterClassFeature extends ChainObject {
  public static INDEX_KEY = "RCCF";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public featureName: string;
  
  // Feature metadata
  public className: string;
  public level: number;
  public isActive: boolean;
}

// Skill Training - Individual Fact  
class CharacterSkillTraining extends ChainObject {
  public static INDEX_KEY = "RCST";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public skillName: string;
  
  // Skill data
  public proficiencyRank: string; // "untrained" | "trained" | "expert" | "master" | "legendary"
  public source: string; // "background" | "class" | "general"
}

// Active Condition - Individual Fact
class CharacterCondition extends ChainObject {
  public static INDEX_KEY = "RCCO";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public conditionName: string;
  
  @ChainKey({ position: 2 }) // Support multiple instances
  public instanceId: string;
  
  // Condition data
  public severity?: number;
  public duration?: number;
  public source: string;
  public appliedAt: number;
}

// Equipment Item - Individual Fact
class CharacterEquipment extends ChainObject {
  public static INDEX_KEY = "RCEQ";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public itemId: string; // Unique item instance
  
  // Item data
  public itemName: string;
  public itemType: string;
  public quantity: BigNumber;
  public isEquipped: boolean;
  public containerSlot?: string;
}
```

#### Class Information (Follows Existing Component Pattern)
```typescript
// Keep similar to existing AncestryComponent pattern
class ClassComponent extends ChainObject {
  public static INDEX_KEY = "RCLA";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 }) // Support multiclass
  public classIndex: string; // "0" for primary, "1" for secondary, etc.
  
  // Class selection data
  public className: string;
  public classLevel: number;
  public subclass?: string;
  public keyAttribute: string;
}
```

#### Event History (Immutable Facts)
```typescript
// Character Creation Event
class CharacterCreationEvent extends ChainObject {
  public static INDEX_KEY = "RCCE";
  
  @ChainKey({ position: 0 })
  public entity: string; // Character composite key
  
  @ChainKey({ position: 1 })
  public timestamp: string; // ctx.txUnixTime for determinism
  
  @ChainKey({ position: 2 })
  public stepNumber: string; // "01", "02", etc.
  
  // Event data
  public stepType: string;
  public stepData: any;
  public isValid: boolean;
  public txId: string;
}

// Character Advancement Event
class CharacterAdvancementEvent extends ChainObject {
  public static INDEX_KEY = "RCAE";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public level: string; // Padded: "01", "02", etc.
  
  @ChainKey({ position: 2 })
  public timestamp: string;
  
  // Advancement data
  public advancementType: string; // "level_up" | "feat_selection" | "skill_increase"
  public choices: any;
  public txId: string;
}

// Character Creation State (Mutable)
class CharacterCreationState extends ChainObject {
  public static INDEX_KEY = "RCCS";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  // Current creation progress
  public currentStep: number;
  public completedSteps: number[]; // Steps that are complete
  public isComplete: boolean;
  public validationErrors: string[];
  public lastUpdated: number;
}
```

## Development Iterations

### Phase 1: Foundation (Week 1)
**Goal:** Establish core data structures and basic character creation

#### Iteration 1.1: Data Model Foundation
- [ ] Implement all ChainObject classes with proper chain keys
- [ ] Create comprehensive DTOs for all operations
- [ ] Implement validation decorators
- [ ] Create unit tests for all data models

#### Iteration 1.2: Character Creation State Machine
- [ ] Implement `CharacterCreationState` to track progress
- [ ] Create state transition logic
- [ ] Implement validation at each step
- [ ] Support flexible step ordering

#### Iteration 1.3: Contract Methods - Core
- [ ] `StartCharacterCreation` - Initialize creation process
- [ ] `SaveCreationProgress` - Persist partial state
- [ ] `LoadCreationProgress` - Resume creation
- [ ] `ValidateCreationStep` - Check rule compliance

### Phase 2: Character Components (Week 2)
**Goal:** Implement ancestry, background, and attributes

#### Iteration 2.1: Ancestry System
- [ ] Implement ancestry data loader from JSON
- [ ] Create heritage selection logic
- [ ] Implement ancestry feat selection
- [ ] Apply ancestry modifiers correctly

#### Iteration 2.2: Background System
- [ ] Implement background data loader
- [ ] Create skill training logic
- [ ] Handle skill overlap resolution
- [ ] Apply background modifiers

#### Iteration 2.3: Attribute System
- [ ] Implement boost/flaw application
- [ ] Handle partial boosts correctly
- [ ] Validate attribute ranges
- [ ] Calculate derived modifiers

### Phase 3: Classes and Skills (Week 3)
**Goal:** Implement class selection and skill system

#### Iteration 3.1: Class System
- [ ] Implement class data loader
- [ ] Create class selection logic
- [ ] Apply class proficiencies
- [ ] Handle subclass choices

#### Iteration 3.2: Skills System
- [ ] Implement skill proficiency tracking
- [ ] Create skill training logic
- [ ] Calculate skill modifiers
- [ ] Implement skill increases

#### Iteration 3.3: Proficiency System
- [ ] Create proficiency rank tracking
- [ ] Implement proficiency calculations
- [ ] Apply to weapons, armor, saves
- [ ] Handle class DC calculations

### Phase 4: Feats and Equipment (Week 4)
**Goal:** Complete character capabilities

#### Iteration 4.1: Feats System
- [ ] Implement feat data structures
- [ ] Create feat selection logic
- [ ] Validate prerequisites
- [ ] Apply feat effects

#### Iteration 4.2: Equipment System
- [ ] Implement inventory management
- [ ] Create equipment purchase logic
- [ ] Calculate bulk and encumbrance
- [ ] Apply equipment modifiers

#### Iteration 4.3: Currency System
- [ ] Implement currency tracking
- [ ] Create conversion logic
- [ ] Handle starting wealth
- [ ] Support treasure/loot

### Phase 5: Spellcasting (Week 5)
**Goal:** Implement magic system

#### Iteration 5.1: Spell Data
- [ ] Implement spell data structures
- [ ] Create spell list management
- [ ] Handle tradition restrictions
- [ ] Support spell components

#### Iteration 5.2: Spellcasting Mechanics
- [ ] Implement spell slots/points
- [ ] Create spell preparation logic
- [ ] Handle spontaneous casting
- [ ] Support focus spells

#### Iteration 5.3: Spell Effects
- [ ] Implement spell DC calculations
- [ ] Create spell attack modifiers
- [ ] Handle spell durations
- [ ] Support metamagic

### Phase 6: Character Finalization (Week 6)
**Goal:** Complete character creation and validation

#### Iteration 6.1: Final Calculations
- [ ] Calculate all derived statistics
- [ ] Implement AC calculations
- [ ] Create save calculations
- [ ] Handle speed/movement

#### Iteration 6.2: Validation System
- [ ] Comprehensive rule validation
- [ ] Create validation report
- [ ] Handle edge cases
- [ ] Ensure consistency

#### Iteration 6.3: Character Sheet
- [ ] Generate complete character sheet
- [ ] Create export formats
- [ ] Implement character queries
- [ ] Support character updates

## Contract Interface Design

### Character Creation Contract
```typescript
export class CharacterCreationContract extends GalaContract {
  
  @Submit()
  async StartCharacterCreation(
    ctx: GalaChainContext,
    dto: StartCharacterCreationDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async SelectAncestryAndHeritage(
    ctx: GalaChainContext,
    dto: SelectAncestryDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async SelectBackground(
    ctx: GalaChainContext,
    dto: SelectBackgroundDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async SelectClass(
    ctx: GalaChainContext,
    dto: SelectClassDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async ApplyAttributeBoosts(
    ctx: GalaChainContext,
    dto: ApplyAttributeBoostsDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async SelectSkills(
    ctx: GalaChainContext,
    dto: SelectSkillsDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async SelectFeats(
    ctx: GalaChainContext,
    dto: SelectFeatsDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async PurchaseEquipment(
    ctx: GalaChainContext,
    dto: PurchaseEquipmentDto
  ): Promise<CharacterCreationStateDto>;
  
  @Submit()
  async FinalizeCharacter(
    ctx: GalaChainContext,
    dto: FinalizeCharacterDto
  ): Promise<CharacterCompleteDto>;
  
  @Evaluate()
  async GetCharacterCreationState(
    ctx: GalaChainContext,
    dto: GetCreationStateDto
  ): Promise<CharacterCreationStateDto>;
  
  @Evaluate()
  async ValidateCharacterCreation(
    ctx: GalaChainContext,
    dto: ValidateCreationDto
  ): Promise<ValidationResultDto>;
}
```

## Query Patterns

### Essential Queries
1. **Get All Characters for Player**
   ```typescript
   getObjectsByPartialCompositeKey(ctx, "RPCI", [playerAlias])
   ```

2. **Get Character Current State**
   ```typescript
   getObjectsByPartialCompositeKey(ctx, "RPCS", [playerAlias, characterId])
   ```

3. **Get Character Creation History**
   ```typescript
   getObjectsByPartialCompositeKey(ctx, "RPCE", [playerAlias, characterId])
   ```

4. **Get Character Components**
   ```typescript
   // Parallel queries for all components
   Promise.all([
     getObjectByKey(ctx, CharacterAncestry, ...),
     getObjectByKey(ctx, CharacterBackground, ...),
     getObjectsByPartialCompositeKey(ctx, "RPCC", [playerAlias, characterId])
   ])
   ```

## Testing Strategy

### Unit Tests
- Data model validation
- Business logic functions
- Calculation accuracy
- Rule validation

### Integration Tests
- Complete character creation flow
- State transitions
- Multi-step transactions
- Concurrent operations

### E2E Tests
- Full character creation scenarios
- Edge cases and error paths
- Performance testing
- Load testing

## Performance Considerations

### Optimization Strategies
1. **Individual Facts Pattern** - Each business fact is a separate ChainObject, reducing MVCC conflicts
2. **Batch Operations** - Combine related writes in single transactions
3. **Separation of Concerns** - Frequently updated data (current HP) separate from rarely updated (level)
4. **Efficient Queries** - Use partial composite key queries for collections
5. **Parallel Loading** - Load related data concurrently using Promise.all

### Gas Optimization
1. **Minimal State Changes** - Only update what actually changed
2. **Batch Writes** - Group related putChainObject calls
3. **Reference Data Off-Chain** - Store complex rule data in JSON files
4. **Efficient Chain Keys** - Design keys for common query patterns
5. **Avoid Large Objects** - Individual facts prevent large object updates

## Security Considerations

### Access Control
1. **Player Ownership** - Only owner can modify character
2. **GM Permissions** - Special permissions for game masters
3. **Data Validation** - Comprehensive input validation
4. **Rate Limiting** - Prevent spam/abuse

### Data Integrity
1. **Immutable History** - Creation events never modified
2. **Version Control** - Track all state changes
3. **Consistency Checks** - Validate data relationships
4. **Backup Strategy** - Support data recovery

## Next Steps

### Immediate Actions (This Week)
1. **Refactor Existing Code** - Update current component pattern to follow individual facts
2. **Implement Missing Components** - Add Background, Class, Skill components
3. **Create Individual Facts Objects** - Implement CharacterAncestryFeat, CharacterSkillTraining, etc.
4. **Update Character Creation Logic** - Modify to use new fact-based approach

### Short-term Goals (Month 1)
1. **Complete Core Data Model** - All individual facts implemented
2. **Implement Character Creation Workflow** - 10-step process with validation
3. **Add Missing Systems** - Background, skills, feats, equipment
4. **Comprehensive Testing** - Unit and integration tests

### Long-term Vision (Quarter)
1. **Character Advancement** - Level up mechanics
2. **Spellcasting System** - Full magic implementation
3. **Combat Mechanics** - Attack rolls, damage, conditions
4. **Campaign Management** - GM tools and character interactions

## Conclusion

This revised development plan properly follows GalaChain best practices by:

1. **Individual Facts Pattern** - Replacing arrays with separate ChainObjects following the existing TraitComponent pattern
2. **Separation of Concerns** - Splitting frequently updated (current HP) from infrequently updated (level) data
3. **Optimized Chain Keys** - Using entity-based keys for efficient partial composite key queries
4. **Performance Focus** - Minimizing MVCC conflicts and enabling parallel data loading

The approach builds upon the existing RPG codebase patterns while addressing the identified gaps in character creation workflow, skills, equipment, and other core systems.

---

**Status:** ✅ Development plan complete  
**Next Action:** Begin Phase 1 implementation