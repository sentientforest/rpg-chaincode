# RPG Chaincode E2E Integration Testing Plan

**Date**: 2025-08-25  
**Author**: Development Team  
**Status**: Planning Phase  
**Scope**: End-to-end testing for RPG chaincode phases 0-6

## Executive Summary

This document outlines a comprehensive plan for implementing end-to-end (e2e) integration tests for the RPG chaincode system built on GalaChain/Hyperledger Fabric. The tests will validate all functionality developed across six implementation phases, using realistic Pathfinder 2e game data stored in the `data/` directory.

## 1. Testing Architecture

### 1.1 Technology Stack
- **Testing Framework**: Jest with @gala-chain/test utilities
- **Client Library**: @gala-chain/client for blockchain interaction
- **Network**: Local GalaChain development network
- **Test Data**: Realistic Pathfinder 2e fixtures from `data/` directory

### 1.2 Test Organization Structure
```
e2e/
└── rpg.api.ts  # Type-safe contract API
├── rpg.reference-data.spec.ts      # Phase 0: Reference data CRUD
├── rpg.character-creation.spec.ts  # Phase 1: Character creation
├── rpg.character-queries.spec.ts   # Phase 2: Character queries
├── rpg.character-management.spec.ts # Phase 2: Equipment/skills/feats
├── rpg.character-advancement.spec.ts # Phase 3: Level up, state
├── rpg.encounters-dice.spec.ts     # Phase 4: Encounters & dice
├── rpg.parties-campaigns.spec.ts   # Phase 4: Party management
├── rpg.combat-system.spec.ts       # Phase 5: Combat resolution
├── rpg.multiclass-crafting.spec.ts # Phase 5: Advanced features
└── rpg.advanced-features.spec.ts   # Phase 6: Achievements, etc.
├── fixtures/
│   ├── test-characters.ts          # Character templates
│   ├── test-equipment.ts           # Equipment data
│   └── data-loader.ts              # Utility for loading JSON fixtures
```

## 2. Test Suites Detailed Plan

### 2.1 Reference Data Management (`reference-data.spec.ts`)

**Purpose**: Test CRUD operations for all reference data types

**Test Scenarios**:
```typescript
describe("RPG Reference Data Management", () => {
  // Setup: Create admin client and curator user
  
  test("Create weapon data from fixtures", async () => {
    // Load data/equipment/core-equipment.json
    // Create multiple weapon entries
    // Verify creation success
  });
  
  test("Create armor data with correct properties", async () => {
    // Test armor with various traits
    // Verify AC bonuses and penalties
  });
  
  test("Create skill data with all 17 core skills", async () => {
    // Load data/skills/core-skills.json
    // Create all skills with proper attributes
  });
  
  test("Create background data with skill bonuses", async () => {
    // Load data/backgrounds/core-backgrounds.json
    // Verify skill and attribute bonuses
  });
  
  test("Create feat data with prerequisites", async () => {
    // Load data/feats/core-feats.json
    // Test feat chains and requirements
  });
  
  test("Create spell data with all traditions", async () => {
    // Load data/spells/core-spells.json
    // Test spells from each tradition
  });
  
  test("Query reference data by category", async () => {
    // Test list operations with pagination
    // Verify filtering by type/level
  });
  
  test("Update reference data (curator only)", async () => {
    // Test authorization checks
    // Update weapon damage dice
  });
  
  test("Fail to delete referenced data", async () => {
    // Create character using equipment
    // Verify deletion prevented
  });
});
```

### 2.2 Character Creation (`character-creation.spec.ts`)

**Purpose**: Test complete character creation workflow

**Test Scenarios**:
```typescript
describe("RPG Character Creation", () => {
  let user: ChainUser;
  let testCharacterName: string;
  
  test("Create Human Fighter level 1", async () => {
    // Use attribute array [16, 14, 14, 10, 12, 10]
    // Apply ancestry bonuses
    // Select Fighter class
    // Choose background (Guard)
    // Verify initial HP calculation
    // Verify skill proficiencies
  });
  
  test("Create Elf Wizard with spellcasting", async () => {
    // Test Intelligence-based character
    // Verify spell slots calculation
    // Add starting spells to spellbook
  });
  
  test("Create Dwarf Cleric with divine magic", async () => {
    // Test Wisdom-based character
    // Verify divine font (heal/harm)
    // Test domain selection
  });
  
  test("Fail to create character with invalid attributes", async () => {
    // Test attribute limits (3-18 base)
    // Test total attribute points validation
  });
  
  test("Fail to create duplicate character name", async () => {
    // Test unique name constraint per user
  });
  
  test("Validate character creation rules", async () => {
    // Test ancestry/class compatibility
    // Verify starting proficiencies
    // Check skill training limits
  });
});
```

### 2.3 Character Queries (`character-queries.spec.ts`)

**Purpose**: Test character sheet aggregation and listing

**Test Scenarios**:
```typescript
describe("RPG Character Queries", () => {
  test("Fetch complete character sheet", async () => {
    // Query character with all components
    // Verify attributes aggregation
    // Check equipment list
    // Validate skill modifiers calculation
    // Test AC and save calculations
  });
  
  test("List user's characters", async () => {
    // Create multiple characters
    // Test pagination
    // Verify ownership filtering
  });
  
  test("Query character history", async () => {
    // Fetch character events
    // Verify chronological order
    // Test event type filtering
  });
  
  test("Calculate derived statistics", async () => {
    // Verify HP = base + (Con modifier × level)
    // Test AC = 10 + Dex + armor
    // Check save bonuses
    // Validate skill modifiers
  });
});
```

### 2.4 Character Management (`character-management.spec.ts`)

**Purpose**: Test equipment, skills, and feat management

**Test Scenarios**:
```typescript
describe("RPG Character Management", () => {
  test("Add equipment to inventory", async () => {
    // Add weapons, armor, items
    // Verify bulk calculations
    // Test container management
  });
  
  test("Equip and unequip items", async () => {
    // Equip weapon in main hand
    // Equip armor and verify AC change
    // Test two-handed weapon restrictions
    // Verify equipped item limits
  });
  
  test("Add skill proficiencies", async () => {
    // Train in new skills
    // Upgrade proficiency ranks
    // Verify modifier recalculation
    // Test skill prerequisites
  });
  
  test("Add feats with prerequisites", async () => {
    // Add general feats
    // Add class feats
    // Test feat chains
    // Verify prerequisite checking
  });
  
  test("Manage spell list", async () => {
    // Learn new spells
    // Prepare spells (wizard)
    // Test spontaneous casting (sorcerer)
    // Verify spell level limits
  });
});
```

### 2.5 Character Advancement (`character-advancement.spec.ts`)

**Purpose**: Test leveling, state management, and progression

**Test Scenarios**:
```typescript
describe("RPG Character Advancement", () => {
  test("Level up from 1 to 2", async () => {
    // Increase level
    // Add HP (class HD + Con)
    // Gain class features
    // Select new feat
    // Improve saves/skills
  });
  
  test("Apply attribute boosts at level 5", async () => {
    // Test 4 attribute boosts
    // Verify modifier changes
    // Check derived stat updates
  });
  
  test("Update character state", async () => {
    // Damage character (reduce HP)
    // Apply temporary HP
    // Use hero points
    // Restore with healing
  });
  
  test("Apply conditions and status effects", async () => {
    // Apply frightened condition
    // Test condition values
    // Verify duration tracking
    // Check stacking rules
  });
  
  test("Track experience and milestones", async () => {
    // Award XP
    // Check level thresholds
    // Test milestone advancement
  });
});
```

### 2.6 Encounters and Dice (`encounters-dice.spec.ts`)

**Purpose**: Test encounter system and dice mechanics

**Test Scenarios**:
```typescript
describe("RPG Encounters and Dice System", () => {
  test("Create encounter with participants", async () => {
    // Create combat encounter
    // Add player characters
    // Add NPC enemies
    // Set encounter difficulty
  });
  
  test("Roll dice with deterministic seeds", async () => {
    // Test basic rolls (1d20, 3d6)
    // Test complex expressions (2d6+3)
    // Test advantage/disadvantage
    // Test exploding dice
    // Verify deterministic results
  });
  
  test("Manage encounter state", async () => {
    // Start encounter
    // Track rounds
    // Update participant status
    // Complete encounter
    // Distribute rewards
  });
  
  test("Roll initiative and establish turn order", async () => {
    // Roll initiative for all
    // Sort by result
    // Handle ties (Dex tiebreaker)
    // Test delay/ready actions
  });
});
```

### 2.7 Parties and Campaigns (`parties-campaigns.spec.ts`)

**Purpose**: Test party and campaign management

**Test Scenarios**:
```typescript
describe("RPG Party and Campaign Management", () => {
  test("Create adventuring party", async () => {
    // Form party of 4 characters
    // Assign party roles
    // Test member limits
    // Verify party treasury
  });
  
  test("Manage party treasury", async () => {
    // Add gold/silver/copper
    // Distribute treasure equally
    // Test weighted distribution
    // Track party expenses
  });
  
  test("Create campaign (GM only)", async () => {
    // Set campaign parameters
    // Add approved players
    // Configure house rules
    // Set starting level
  });
  
  test("Start game session", async () => {
    // Create session entry
    // Add participants
    // Track session duration
    // Log major events
  });
  
  test("Distribute treasure rewards", async () => {
    // Award treasure to party
    // Split by shares
    // Handle magic items
    // Test distribution rules
  });
});
```

### 2.8 Combat System (`combat-system.spec.ts`)

**Purpose**: Test complete combat resolution

**Test Scenarios**:
```typescript
describe("RPG Combat System", () => {
  test("Perform melee attack", async () => {
    // Roll attack (1d20 + modifiers)
    // Compare vs target AC
    // Roll damage on hit
    // Apply damage reduction
    // Update target HP
  });
  
  test("Perform ranged attack with range penalties", async () => {
    // Calculate range increment
    // Apply range penalties
    // Test cover modifiers
    // Verify ammunition tracking
  });
  
  test("Cast offensive spell", async () => {
    // Select spell and target
    // Make spell attack roll
    // OR force saving throw
    // Apply spell effects
    // Use spell slot
  });
  
  test("Make saving throws", async () => {
    // Test Fortitude save
    // Test Reflex save
    // Test Will save
    // Apply success/failure effects
    // Test critical success/failure
  });
  
  test("Make skill checks in combat", async () => {
    // Athletics to grapple
    // Acrobatics to tumble
    // Intimidation to demoralize
    // Medicine to heal
  });
  
  test("Apply and track status effects", async () => {
    // Apply bleed damage
    // Track poison stages
    // Test fear effects
    // Manage buff durations
  });
  
  test("Manage initiative and turns", async () => {
    // Start initiative
    // Process turns in order
    // Handle delayed actions
    // Advance rounds
  });
});
```

### 2.9 Multiclass and Crafting (`multiclass-crafting.spec.ts`)

**Purpose**: Test advanced character options

**Test Scenarios**:
```typescript
describe("RPG Multiclass and Crafting", () => {
  test("Add multiclass dedication", async () => {
    // Meet prerequisites
    // Take dedication feat
    // Gain class features
    // Test restrictions
  });
  
  test("Progress in multiple classes", async () => {
    // Level in secondary class
    // Track separate progressions
    // Test feature interactions
  });
  
  test("Start crafting project", async () => {
    // Select item to craft
    // Check skill requirements
    // Invest materials
    // Begin work
  });
  
  test("Advance crafting progress", async () => {
    // Make daily progress
    // Roll crafting checks
    // Handle failures
    // Complete item
  });
});
```

### 2.10 Advanced Features (`advanced-features.spec.ts`)

**Purpose**: Test Phase 6 features (when DTOs are fixed)

**Test Scenarios**:
```typescript
describe("RPG Advanced Features", () => {
  test("Create persistent spell effects", async () => {
    // Cast area spell
    // Track duration
    // Apply to entering creatures
    // Handle dispelling
  });
  
  test("Award achievements", async () => {
    // Complete achievement criteria
    // Award to character
    // Track progress
    // Test rarity tiers
  });
  
  test("Validate character rules", async () => {
    // Test level-up rules
    // Verify attribute limits
    // Check feat prerequisites
    // Validate equipment restrictions
  });
  
  test("Transfer character between campaigns", async () => {
    // Initiate transfer
    // GM approval workflow
    // Verify character state
    // Update campaign membership
  });
  
  test("Generate analytics reports", async () => {
    // Query character statistics
    // Combat performance metrics
    // Session activity reports
    // Campaign progress tracking
  });
});
```

## 3. Test Data Management

### 3.1 Fixture Loading Strategy

```typescript
// fixtures/data-loader.ts
export class TestDataLoader {
  static async loadSkills(): Promise<SkillData[]> {
    const data = require('../../data/skills/core-skills.json');
    return data.data.skills;
  }
  
  static async loadClasses(): Promise<ClassData[]> {
    const data = require('../../data/classes/core-classes.json');
    return data.data.classes;
  }
  
  static async loadEquipment(): Promise<EquipmentData[]> {
    const data = require('../../data/equipment/core-equipment.json');
    return [...data.data.weapons, ...data.data.armor];
  }
  
  static createTestCharacter(template: string): CreateCharacterDto {
    // Generate character based on template
    // Use realistic attribute arrays
    // Apply proper ancestry/class combo
  }
}
```

### 3.2 Test Isolation Strategy

- Generate unique user identities per test run
- Use timestamp-based character names
- Clean up test data after suite completion
- Implement test data namespacing

## 4. Contract API Implementation

### 4.1 Type-Safe API Definition

```typescript
// api/rpg-contract-api.ts
interface RpgContractAPI {
  // Reference Data
  CreateWeaponData(dto: CreateWeaponDataDto): Promise<GalaChainResponse<void>>;
  GetWeaponData(dto: GetReferenceDataDto): Promise<GalaChainResponse<WeaponData>>;
  ListWeaponData(dto: ListReferenceDataDto): Promise<GalaChainResponse<WeaponData[]>>;
  
  // Character Operations
  CreateCharacter(dto: CreateCharacterDto): Promise<GalaChainResponse<void>>;
  GetCharacterSheet(dto: GetCharacterDto): Promise<GalaChainResponse<CharacterSheetDto>>;
  LevelUpCharacter(dto: LevelUpCharacterDto): Promise<GalaChainResponse<void>>;
  
  // Combat Operations
  PerformAttack(dto: PerformAttackDto): Promise<GalaChainResponse<CombatAction>>;
  MakeSavingThrow(dto: MakeSavingThrowDto): Promise<GalaChainResponse<SavingThrow>>;
  
  // Dice System
  RollDice(dto: RollDiceDto): Promise<GalaChainResponse<DiceRoll>>;
}

export function rpgContractAPI(client: ChainClient): RpgContractAPI & CommonContractAPI {
  return {
    ...commonContractAPI(client),
    
    CreateWeaponData(dto: CreateWeaponDataDto) {
      return client.submitTransaction("CreateWeaponData", dto);
    },
    
    GetCharacterSheet(dto: GetCharacterDto) {
      return client.evaluateTransaction("GetCharacterSheet", dto, CharacterSheetDto);
    },
    
    // ... additional methods
  };
}
```

### 4.2 Client Configuration

```typescript
const contractConfig = {
  rpg: {
    channel: "product-channel",
    chaincode: "basic-product",
    contract: "Rpg",
    api: rpgContractAPI
  },
  pk: {
    channel: "product-channel",
    chaincode: "basic-product", 
    contract: "PublicKeyContract",
    api: commonContractAPI
  },
  token: {
    channel: "product-channel",
    chaincode: "basic-product",
    contract: "GalaChainToken",
    api: commonContractAPI
  }
};
```

## 5. Testing Best Practices

### 5.1 Assertion Patterns

```typescript
// Success assertions
const expectedResponse = createValidDTO(<expected response dto type class constructor>, {
  ...<expected class instance properties>
});
expect(response).toEqual(transactionSuccess(expectedResponse));

// Error assertions
expect(response).toEqual(transactionErrorKey("INSUFFICIENT_PERMISSIONS"));
expect(response).toEqual(transactionErrorMessageContains("Character already exists"));

// State verification
const characterSheet = await client.rpg.GetCharacterSheet(dto);
expect(characterSheet.Data.currentHP).toBe(10);
```

### 5.2 Test Organization Guidelines

1. **Setup/Teardown**: Use `beforeAll/afterAll` for client connection
2. **Test Isolation**: Each suite uses unique test data
3. **Sequential Testing**: Tests within suite build on each other
4. **Timeout Management**: 30-second timeout for network operations
5. **Error Testing**: Verify both success and failure paths

### 5.3 Performance Considerations

- Test pagination with large datasets
- Verify query performance with composite keys
- Test concurrent operations where applicable
- Monitor transaction throughput

## 6. Implementation Timeline

### Phase 1: Foundation (Week 1)
- Set up test infrastructure
- Create contract API definitions
- Implement data loader utilities
- Write reference data tests

### Phase 2: Core Features (Week 2)
- Character creation tests
- Character management tests
- Query and aggregation tests
- Equipment and skill tests

### Phase 3: Game Mechanics (Week 3)
- Combat system tests
- Dice rolling tests
- Encounter management tests
- Party and campaign tests

### Phase 4: Advanced Features (Week 4)
- Multiclass and crafting tests
- Status effect tests
- Advanced spell tests
- Rules validation tests

### Phase 5: Polish and Coverage (Week 5)
- Error case coverage
- Performance testing
- Documentation
- CI/CD integration

## 7. Success Criteria

### Coverage Targets
- **Line Coverage**: > 80%
- **Branch Coverage**: > 75%
- **Function Coverage**: > 85%
- **All Critical Paths**: 100%

### Quality Metrics
- All tests pass consistently
- No flaky tests
- Execution time < 5 minutes total
- Clear test naming and documentation

### Functional Validation
- All CRUD operations tested
- Complex workflows validated
- Business rules enforced
- Error handling verified
- Authorization checked

## 8. Risks and Mitigation

### Technical Risks
- **Network Instability**: Use retries and timeouts
- **Test Data Conflicts**: Implement proper isolation
- **Performance Issues**: Use pagination and limits
- **DTO Mismatches**: Maintain API versioning

### Mitigation Strategies
- Regular test suite maintenance
- Continuous monitoring of test results
- Documentation of known issues
- Rollback procedures for failures

## 9. Documentation Requirements

### Test Documentation
- README for test setup and execution
- API documentation with examples
- Test scenario descriptions
- Troubleshooting guide

### Code Documentation
- JSDoc comments for test utilities
- Inline comments for complex logic
- Example usage in each test file
- Maintenance notes

## 10. Conclusion

This comprehensive E2E testing plan ensures thorough validation of the RPG chaincode system. By using realistic game data and following established testing patterns, we can confidently verify that all game mechanics work correctly in a production-like environment.

The modular approach allows for incremental implementation while maintaining test independence. Focus on critical path testing first, then expand coverage to edge cases and advanced features.

## Appendix A: Sample Test Execution

```bash
# Run all RPG tests
npm run test:e2e:rpg

# Run specific test suite
npm run test:e2e -- e2e/rpg.character-creation.spec.ts

# Run with coverage
npm run test:e2e:coverage

# Run in watch mode for development
npm run test:e2e:watch
```

## Appendix B: Environment Setup

```bash
# Start local network
npm run network:up

# Run tests
npm run test:e2e
```