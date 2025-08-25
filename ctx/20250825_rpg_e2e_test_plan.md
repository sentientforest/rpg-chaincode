# RPG Chaincode E2E Integration Testing Plan

**Date**: 2025-08-25  
**Author**: Development Team  
**Status**: Planning Phase - Revised  
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
├── rpg.api.ts                       # CRITICAL: Type-safe contract API (MUST BE CREATED FIRST)
├── rpg.reference-data.spec.ts       # Phase 0: Reference data CRUD
├── rpg.character-creation.spec.ts   # Phase 1: Character creation
├── rpg.character-queries.spec.ts    # Phase 2: Character queries
├── rpg.character-management.spec.ts # Phase 2: Equipment/skills/feats
├── rpg.character-advancement.spec.ts # Phase 3: Level up, state
├── rpg.encounters-dice.spec.ts      # Phase 4: Encounters & dice
├── rpg.parties-campaigns.spec.ts    # Phase 4: Party management
├── rpg.combat-system.spec.ts        # Phase 5: Combat resolution
├── rpg.multiclass-crafting.spec.ts  # Phase 5: Advanced features
├── rpg.advanced-features.spec.ts    # Phase 6: Achievements, etc.
└── fixtures/
    ├── test-characters.ts            # Character templates
    ├── test-equipment.ts             # Equipment data
    └── data-loader.ts                # Utility for loading JSON fixtures
```

## 2. CRITICAL FIRST STEP: Contract API Implementation

### 2.1 The Contract API MUST Be Created Before Any Tests

The contract API is the foundation that enables the test client to communicate with the chaincode. Without this properly defined, no tests can execute.

**File: `e2e/rpg.api.ts`**

```typescript
import {
  ChainClient,
  CommonContractAPI,
  GalaChainResponse,
  commonContractAPI
} from "@gala-chain/api";

// Import all DTOs from the chaincode
import {
  // Reference Data DTOs
  CreateWeaponDataDto,
  CreateArmorDataDto,
  CreateSkillDataDto,
  CreateBackgroundDataDto,
  CreateFeatDataDto,
  CreateSpellDataDto,
  UpdateWeaponDataDto,
  UpdateArmorDataDto,
  UpdateSkillDataDto,
  UpdateBackgroundDataDto,
  UpdateFeatDataDto,
  UpdateSpellDataDto,
  DeleteReferenceDataDto,
  GetReferenceDataDto,
  ListReferenceDataDto,
  WeaponData,
  ArmorData,
  SkillData,
  BackgroundData,
  FeatData,
  SpellData,
  
  // Character DTOs
  CreateCharacterDto,
  GetCharacterDto,
  ListCharactersDto,
  CharacterSheetDto,
  CharacterEntity,
  AddEquipmentDto,
  EquipItemDto,
  AddSkillProficiencyDto,
  AddFeatDto,
  LevelUpCharacterDto,
  UpdateCharacterStateDto,
  AddSpellDto,
  ValidateCharacterDto,
  ValidationResultDto,
  GetCharacterHistoryDto,
  
  // Combat DTOs
  PerformAttackDto,
  CombatAction,
  ApplyStatusEffectDto,
  MakeSavingThrowDto,
  SavingThrow,
  MakeSkillCheckDto,
  SkillCheck,
  
  // Advanced DTOs
  CreateEncounterDto,
  RollDiceDto,
  DiceRoll,
  CreatePartyDto,
  CastSpellDto,
  CastSpellAction
} from "../src/rpg/types";

// Define the complete RPG Contract API interface
export interface RpgContractAPI {
  // Reference Data - Weapons
  CreateWeaponData(dto: CreateWeaponDataDto): Promise<GalaChainResponse<void>>;
  UpdateWeaponData(dto: UpdateWeaponDataDto): Promise<GalaChainResponse<void>>;
  DeleteWeaponData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetWeaponData(dto: GetReferenceDataDto): Promise<GalaChainResponse<WeaponData>>;
  ListWeaponData(dto: ListReferenceDataDto): Promise<GalaChainResponse<WeaponData[]>>;
  
  // Reference Data - Armor
  CreateArmorData(dto: CreateArmorDataDto): Promise<GalaChainResponse<void>>;
  UpdateArmorData(dto: UpdateArmorDataDto): Promise<GalaChainResponse<void>>;
  DeleteArmorData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetArmorData(dto: GetReferenceDataDto): Promise<GalaChainResponse<ArmorData>>;
  ListArmorData(dto: ListReferenceDataDto): Promise<GalaChainResponse<ArmorData[]>>;
  
  // Reference Data - Skills
  CreateSkillData(dto: CreateSkillDataDto): Promise<GalaChainResponse<void>>;
  UpdateSkillData(dto: UpdateSkillDataDto): Promise<GalaChainResponse<void>>;
  DeleteSkillData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetSkillData(dto: GetReferenceDataDto): Promise<GalaChainResponse<SkillData>>;
  ListSkillData(dto: ListReferenceDataDto): Promise<GalaChainResponse<SkillData[]>>;
  
  // Reference Data - Backgrounds
  CreateBackgroundData(dto: CreateBackgroundDataDto): Promise<GalaChainResponse<void>>;
  UpdateBackgroundData(dto: UpdateBackgroundDataDto): Promise<GalaChainResponse<void>>;
  DeleteBackgroundData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetBackgroundData(dto: GetReferenceDataDto): Promise<GalaChainResponse<BackgroundData>>;
  ListBackgroundData(dto: ListReferenceDataDto): Promise<GalaChainResponse<BackgroundData[]>>;
  
  // Reference Data - Feats
  CreateFeatData(dto: CreateFeatDataDto): Promise<GalaChainResponse<void>>;
  UpdateFeatData(dto: UpdateFeatDataDto): Promise<GalaChainResponse<void>>;
  DeleteFeatData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetFeatData(dto: GetReferenceDataDto): Promise<GalaChainResponse<FeatData>>;
  ListFeatData(dto: ListReferenceDataDto): Promise<GalaChainResponse<FeatData[]>>;
  
  // Reference Data - Spells
  CreateSpellData(dto: CreateSpellDataDto): Promise<GalaChainResponse<void>>;
  UpdateSpellData(dto: UpdateSpellDataDto): Promise<GalaChainResponse<void>>;
  DeleteSpellData(dto: DeleteReferenceDataDto): Promise<GalaChainResponse<void>>;
  GetSpellData(dto: GetReferenceDataDto): Promise<GalaChainResponse<SpellData>>;
  ListSpellData(dto: ListReferenceDataDto): Promise<GalaChainResponse<SpellData[]>>;
  
  // Character Operations
  CreateCharacter(dto: CreateCharacterDto): Promise<GalaChainResponse<void>>;
  GetCharacterSheet(dto: GetCharacterDto): Promise<GalaChainResponse<CharacterSheetDto>>;
  ListCharacters(dto: ListCharactersDto): Promise<GalaChainResponse<CharacterEntity[]>>;
  
  // Character Management
  AddEquipment(dto: AddEquipmentDto): Promise<GalaChainResponse<void>>;
  EquipItem(dto: EquipItemDto): Promise<GalaChainResponse<void>>;
  AddSkillProficiency(dto: AddSkillProficiencyDto): Promise<GalaChainResponse<void>>;
  AddFeat(dto: AddFeatDto): Promise<GalaChainResponse<void>>;
  
  // Character Advancement
  LevelUpCharacter(dto: LevelUpCharacterDto): Promise<GalaChainResponse<void>>;
  UpdateCharacterState(dto: UpdateCharacterStateDto): Promise<GalaChainResponse<void>>;
  AddSpell(dto: AddSpellDto): Promise<GalaChainResponse<void>>;
  
  // Character Validation
  ValidateCharacter(dto: ValidateCharacterDto): Promise<GalaChainResponse<ValidationResultDto>>;
  GetCharacterHistory(dto: GetCharacterHistoryDto): Promise<GalaChainResponse<any>>;
  
  // Combat Operations
  PerformAttack(dto: PerformAttackDto): Promise<GalaChainResponse<CombatAction>>;
  ApplyStatusEffect(dto: ApplyStatusEffectDto): Promise<GalaChainResponse<void>>;
  MakeSavingThrow(dto: MakeSavingThrowDto): Promise<GalaChainResponse<SavingThrow>>;
  MakeSkillCheck(dto: MakeSkillCheckDto): Promise<GalaChainResponse<SkillCheck>>;
  
  // Advanced Operations
  CreateEncounter(dto: CreateEncounterDto): Promise<GalaChainResponse<void>>;
  RollDice(dto: RollDiceDto): Promise<GalaChainResponse<DiceRoll>>;
  CreateParty(dto: CreatePartyDto): Promise<GalaChainResponse<void>>;
  CastSpell(dto: CastSpellDto): Promise<GalaChainResponse<CastSpellAction>>;
}

// Implementation function that maps contract methods to client calls
export function rpgContractAPI(client: ChainClient): RpgContractAPI & CommonContractAPI {
  return {
    // Include common contract API (GetContractAPI, DryRun, etc.)
    ...commonContractAPI(client),
    
    // Reference Data - Weapons
    CreateWeaponData(dto: CreateWeaponDataDto) {
      return client.submitTransaction("CreateWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateWeaponData(dto: UpdateWeaponDataDto) {
      return client.submitTransaction("UpdateWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteWeaponData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteWeaponData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetWeaponData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetWeaponData", dto, WeaponData) as Promise<GalaChainResponse<WeaponData>>;
    },
    ListWeaponData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListWeaponData", dto) as Promise<GalaChainResponse<WeaponData[]>>;
    },
    
    // Reference Data - Armor
    CreateArmorData(dto: CreateArmorDataDto) {
      return client.submitTransaction("CreateArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateArmorData(dto: UpdateArmorDataDto) {
      return client.submitTransaction("UpdateArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    DeleteArmorData(dto: DeleteReferenceDataDto) {
      return client.submitTransaction("DeleteArmorData", dto) as Promise<GalaChainResponse<void>>;
    },
    GetArmorData(dto: GetReferenceDataDto) {
      return client.evaluateTransaction("GetArmorData", dto, ArmorData) as Promise<GalaChainResponse<ArmorData>>;
    },
    ListArmorData(dto: ListReferenceDataDto) {
      return client.evaluateTransaction("ListArmorData", dto) as Promise<GalaChainResponse<ArmorData[]>>;
    },
    
    // ... continue for all other reference data types ...
    
    // Character Operations
    CreateCharacter(dto: CreateCharacterDto) {
      return client.submitTransaction("CreateCharacter", dto) as Promise<GalaChainResponse<void>>;
    },
    GetCharacterSheet(dto: GetCharacterDto) {
      return client.evaluateTransaction("GetCharacterSheet", dto, CharacterSheetDto) as Promise<GalaChainResponse<CharacterSheetDto>>;
    },
    ListCharacters(dto: ListCharactersDto) {
      return client.evaluateTransaction("ListCharacters", dto) as Promise<GalaChainResponse<CharacterEntity[]>>;
    },
    
    // Character Management
    AddEquipment(dto: AddEquipmentDto) {
      return client.submitTransaction("AddEquipment", dto) as Promise<GalaChainResponse<void>>;
    },
    EquipItem(dto: EquipItemDto) {
      return client.submitTransaction("EquipItem", dto) as Promise<GalaChainResponse<void>>;
    },
    AddSkillProficiency(dto: AddSkillProficiencyDto) {
      return client.submitTransaction("AddSkillProficiency", dto) as Promise<GalaChainResponse<void>>;
    },
    AddFeat(dto: AddFeatDto) {
      return client.submitTransaction("AddFeat", dto) as Promise<GalaChainResponse<void>>;
    },
    
    // Character Advancement
    LevelUpCharacter(dto: LevelUpCharacterDto) {
      return client.submitTransaction("LevelUpCharacter", dto) as Promise<GalaChainResponse<void>>;
    },
    UpdateCharacterState(dto: UpdateCharacterStateDto) {
      return client.submitTransaction("UpdateCharacterState", dto) as Promise<GalaChainResponse<void>>;
    },
    AddSpell(dto: AddSpellDto) {
      return client.submitTransaction("AddSpell", dto) as Promise<GalaChainResponse<void>>;
    },
    
    // Character Validation
    ValidateCharacter(dto: ValidateCharacterDto) {
      return client.evaluateTransaction("ValidateCharacter", dto, ValidationResultDto) as Promise<GalaChainResponse<ValidationResultDto>>;
    },
    GetCharacterHistory(dto: GetCharacterHistoryDto) {
      return client.evaluateTransaction("GetCharacterHistory", dto) as Promise<GalaChainResponse<any>>;
    },
    
    // Combat Operations
    PerformAttack(dto: PerformAttackDto) {
      return client.submitTransaction("PerformAttack", dto, CombatAction) as Promise<GalaChainResponse<CombatAction>>;
    },
    ApplyStatusEffect(dto: ApplyStatusEffectDto) {
      return client.submitTransaction("ApplyStatusEffect", dto) as Promise<GalaChainResponse<void>>;
    },
    MakeSavingThrow(dto: MakeSavingThrowDto) {
      return client.submitTransaction("MakeSavingThrow", dto, SavingThrow) as Promise<GalaChainResponse<SavingThrow>>;
    },
    MakeSkillCheck(dto: MakeSkillCheckDto) {
      return client.submitTransaction("MakeSkillCheck", dto, SkillCheck) as Promise<GalaChainResponse<SkillCheck>>;
    },
    
    // Advanced Operations
    CreateEncounter(dto: CreateEncounterDto) {
      return client.submitTransaction("CreateEncounter", dto) as Promise<GalaChainResponse<void>>;
    },
    RollDice(dto: RollDiceDto) {
      return client.submitTransaction("RollDice", dto, DiceRoll) as Promise<GalaChainResponse<DiceRoll>>;
    },
    CreateParty(dto: CreatePartyDto) {
      return client.submitTransaction("CreateParty", dto) as Promise<GalaChainResponse<void>>;
    },
    CastSpell(dto: CastSpellDto) {
      return client.submitTransaction("CastSpell", dto, CastSpellAction) as Promise<GalaChainResponse<CastSpellAction>>;
    }
    
    // Note: Add remaining methods as they become enabled in the contract
  };
}
```

### 2.2 Contract Configuration Object

Every test file MUST define the contract configuration that references the API:

```typescript
// Standard pattern used in EVERY test file
const rpgContractConfig = {
  rpg: {
    channel: "product-channel",
    chaincode: "basic-product", 
    contract: "Rpg",
    api: rpgContractAPI  // References the function from rpg.api.ts
  }
};

// Type-safe client creation
let client: AdminChainClients<typeof rpgContractConfig>;
```

### 2.3 Why This Must Come First

1. **No tests can run without the API** - The client creation will fail
2. **Type safety depends on the interface** - TypeScript won't compile without proper types
3. **Method mapping is critical** - Each contract method needs explicit mapping to submitTransaction or evaluateTransaction
4. **Response deserialization** - The third parameter in evaluateTransaction specifies the response type for proper deserialization

## 3. Test Suite Implementation (After API is Complete)

### 3.1 Reference Data Management (`rpg.reference-data.spec.ts`)

**Purpose**: Test CRUD operations for all reference data types

**Critical Setup Pattern**:
```typescript
import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";
import { ChainUser } from "@gala-chain/api";
import { createValidSubmitDTO } from "@gala-chain/api";

describe("RPG Reference Data Management", () => {
  // MUST define contract config with API
  const rpgContractConfig = {
    rpg: {
      channel: "product-channel",
      chaincode: "basic-product",
      contract: "Rpg", 
      api: rpgContractAPI
    }
  };
  
  let client: AdminChainClients<typeof rpgContractConfig>;
  let curatorUser: ChainUser;
  
  beforeAll(async () => {
    // Client creation depends on having the API properly defined
    client = await TestClients.createForAdmin(rpgContractConfig);
    curatorUser = await client.createRegisteredUser();
    // Note: May need to set curator role for user
  });
  
  afterAll(async () => {
    await client.disconnect();
  });
  
  test("Create weapon data from fixtures", async () => {
    // Given
    const dto = await createValidSubmitDTO(CreateWeaponDataDto, {
      weaponName: "Longsword",
      damage: "1d8",
      damageType: "slashing",
      traits: ["versatile"],
      bulk: 1,
      price: { gold: 15 }
    });
    await dto.sign(curatorUser.privateKey);
    
    // When
    const response = await client.rpg.CreateWeaponData(dto);
    
    // Then
    expect(response).toEqual(transactionSuccess());
  });
});
```

### 3.2 Character Creation (`rpg.character-creation.spec.ts`)

```typescript
import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";
import { ChainUser } from "@gala-chain/api";
import { createValidSubmitDTO } from "@gala-chain/api";

describe("RPG Character Creation", () => {
  const rpgContractConfig = {
    rpg: {
      channel: "product-channel",
      chaincode: "basic-product",
      contract: "Rpg",
      api: rpgContractAPI
    }
  };
  
  let client: AdminChainClients<typeof rpgContractConfig>;
  let user: ChainUser;
  let testCharacterName: string;
  
  beforeAll(async () => {
    client = await TestClients.createForAdmin(rpgContractConfig);
    user = await client.createRegisteredUser();
    testCharacterName = `TestChar_${Date.now()}`;
  });
  
  afterAll(async () => {
    await client.disconnect();
  });
  
  test("Create Human Fighter level 1", async () => {
    // Given
    const dto = await createValidSubmitDTO(CreateCharacterDto, {
      name: testCharacterName,
      ancestry: "Human",
      background: "Guard", 
      className: "Fighter",
      attributes: {
        strength: 16,
        dexterity: 14,
        constitution: 14,
        intelligence: 10,
        wisdom: 12,
        charisma: 10
      }
    });
    await dto.sign(user.privateKey);
    
    // When
    const response = await client.rpg.CreateCharacter(dto);
    
    // Then
    expect(response).toEqual(transactionSuccess());
  });
  
  test("Fetch complete character sheet", async () => {
    // Given
    const dto = await createValidSubmitDTO(GetCharacterDto, {
      characterName: testCharacterName
    });
    await dto.sign(user.privateKey);
    
    // When
    const response = await client.rpg.GetCharacterSheet(dto);
    
    // Then
    expect(response).toEqual(transactionSuccess());
    expect(response.Data?.name).toBe(testCharacterName);
    expect(response.Data?.level).toBe(1);
    expect(response.Data?.className).toBe("Fighter");
  });
});
```

## 4. Task Sizing Analysis for AI Agents

### 4.1 Context Window Constraints

Modern AI coding agents typically work within 32k-200k token context windows. Analysis of our RPG chaincode reveals several tasks that exceed optimal sizing:

**Current Problematic Tasks:**
- **Contract API Creation**: 64 methods across ~1000+ lines exceeds single context comfort zone
- **Reference Data Tests**: 6 data types × CRUD operations = ~400+ test lines  
- **Character Creation Tests**: 10 creation steps + validation = complex multi-hundred line files
- **Combined Subsystem Tests**: Multiple major features bundled together

**Test Data Volume**: 7,483 lines across 12+ JSON fixture files requires strategic chunking.

### 4.2 Recommended Task Breakdown - REVISED

#### Phase 0: Contract API Setup (Split into 4 sub-tasks)
- **0.1**: API structure + reference data methods (CreateWeaponData → ListSpellData: 15 methods)
- **0.2**: Character CRUD methods (CreateCharacter → ValidateCharacter: 8 methods)  
- **0.3**: Character management methods (AddEquipment → GetCharacterHistory: 12 methods)
- **0.4**: Combat + advanced methods (PerformAttack → GenerateAnalytics: 29 methods) + connection test

#### Phase 1: Foundation (Split into 3 sub-tasks)  
- **1.1**: Create data loader utilities + fixture infrastructure (~100 lines)
- **1.2**: Reference data tests - weapons & armor CRUD (6 test methods, ~120 lines)
- **1.3**: Reference data tests - skills, backgrounds, feats, spells CRUD (12 test methods, ~240 lines)

#### Phase 2: Character Core (Split into 4 sub-tasks)
- **2.1**: Character creation tests - basic flow (steps 1-5: concept → class selection, ~150 lines)
- **2.2**: Character creation tests - completion (steps 6-10: attributes → finishing details, ~150 lines)  
- **2.3**: Character query and sheet aggregation tests (~100 lines)
- **2.4**: Equipment management tests (add/equip items, ~120 lines)

#### Phase 3: Character Advanced (Split into 3 sub-tasks)
- **3.1**: Skill proficiency and feat management tests (~100 lines)
- **3.2**: Character advancement and leveling tests (~120 lines)
- **3.3**: Character state management and validation tests (~100 lines)

#### Phase 4: Game Mechanics (Split into 4 sub-tasks)
- **4.1**: Basic dice rolling and encounter creation tests (~100 lines)
- **4.2**: Combat action tests (attack, status effects, ~120 lines)
- **4.3**: Party management and campaign tests (~100 lines)
- **4.4**: Spellcasting system tests (~120 lines)

#### Phase 5: Advanced Features (Split into 3 sub-tasks)
- **5.1**: Multiclass and crafting system tests (~100 lines)
- **5.2**: Advanced combat (initiative, saving throws, skill checks, ~120 lines)
- **5.3**: Achievement and analytics tests (~80 lines)

#### Phase 6: Quality & Integration (Split into 3 sub-tasks)
- **6.1**: Error case coverage and edge cases (~100 lines)
- **6.2**: Performance testing and load scenarios (~80 lines)
- **6.3**: Documentation and CI/CD integration (~50 lines)

### 4.3 Context Window Optimization Benefits

1. **Manageable Scope**: Each sub-task targets 80-150 lines, fitting comfortably in 32k tokens
2. **Atomic Completion**: Each sub-task produces complete, testable functionality  
3. **Clear Dependencies**: Prerequisites obvious, enabling parallel work streams
4. **Incremental Validation**: Can test integration after each sub-task
5. **Error Recovery**: Smaller failures easier to debug and fix
6. **AI-Friendly**: Optimal complexity for agent comprehension and execution

### 4.4 File Size Estimates by Sub-Task

| Sub-Task | Est. Lines | Key Components | Context Usage |
|----------|------------|----------------|---------------|
| 0.1 | 200-250 | API structure + 15 methods | ~15k tokens |
| 0.2 | 120-150 | 8 character CRUD methods | ~10k tokens |  
| 0.3 | 150-180 | 12 management methods | ~12k tokens |
| 0.4 | 350-400 | 29 advanced methods + test | ~25k tokens |
| 1.1 | 80-120 | Data loading utilities | ~8k tokens |
| 1.2 | 120-150 | Weapons/armor tests | ~10k tokens |
| 1.3 | 240-280 | 4 reference types tests | ~18k tokens |

*All other sub-tasks: 80-150 lines, 8-12k tokens*

### 4.5 Sub-Task Dependencies and Parallelization

#### Critical Path (Must be Sequential)
- **0.1 → 0.2 → 0.3 → 0.4**: Contract API must be built incrementally
- **0.4 → 1.1**: Data loading depends on working API connection
- **1.1 → 1.2, 1.3**: Test utilities required before reference data tests

#### Parallelizable After Dependencies Met
- **1.2 || 1.3**: Reference data tests can run in parallel
- **2.1 || 2.3**: Character creation and queries independent  
- **3.1 || 4.1**: Skill management and dice rolling independent
- **5.1 || 5.2**: Crafting and advanced combat independent

#### Integration Points (Validation Required)
- After **0.4**: Verify complete API functionality
- After **1.3**: Ensure all reference data systems work
- After **2.4**: Validate character creation → management flow
- After **4.4**: Test complete game mechanics integration
- After **5.3**: Final system integration test

#### Rollback Strategy
- Each sub-task maintains isolated test files
- Failed sub-task doesn't block parallel work streams  
- Clear rollback points at each integration checkpoint
- Incremental Git commits after each successful sub-task

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

1. **API First**: The contract API must be complete before any test can run
2. **Contract Config Pattern**: Every test file must define the contract config with the API
3. **Setup/Teardown**: Use `beforeAll/afterAll` for client connection
4. **Test Isolation**: Each suite uses unique test data
5. **Sequential Testing**: Tests within suite build on each other
6. **Timeout Management**: 30-second timeout for network operations
7. **Error Testing**: Verify both success and failure paths

### 5.3 Common Pitfalls to Avoid

1. **Missing API Definition**: Tests will fail to compile without proper API interface
2. **Wrong Transaction Type**: Using submitTransaction for queries or evaluateTransaction for state changes
3. **Missing Response Type**: Forgetting the third parameter in evaluateTransaction for deserialization
4. **Improper DTO Creation**: Not using createValidSubmitDTO for proper validation
5. **Missing Signatures**: Forgetting to sign DTOs before submission

## 6. Test Data Management

### 6.1 Fixture Loading Strategy

```typescript
// fixtures/data-loader.ts
import * as skillsData from "../data/skills/core-skills.json";
import * as classesData from "../data/classes/core-classes.json";
import * as equipmentData from "../data/equipment/core-equipment.json";

export class TestDataLoader {
  static async loadSkills(): Promise<CreateSkillDataDto[]> {
    return Object.entries(skillsData.data.skills).map(([key, skill]) => ({
      skillName: skill.name,
      keyAttribute: skill.keyAttribute,
      description: skill.description,
      armorCheckPenalty: skill.armorCheckPenalty,
      actions: skill.actions
    }));
  }
  
  static async loadClasses(): Promise<CreateClassDataDto[]> {
    return Object.entries(classesData.data.classes).map(([key, cls]) => ({
      className: cls.name,
      description: cls.description,
      keyAttribute: cls.keyAttribute,
      hitPointsPerLevel: cls.hitPointsPerLevel,
      initialProficiencies: cls.initialProficiencies
    }));
  }
  
  static createTestCharacter(template: string): CreateCharacterDto {
    const templates = {
      fighter: {
        name: `Fighter_${Date.now()}`,
        ancestry: "Human",
        background: "Guard",
        className: "Fighter",
        attributes: {
          strength: 16,
          dexterity: 14,
          constitution: 14,
          intelligence: 10,
          wisdom: 12,
          charisma: 10
        }
      },
      wizard: {
        name: `Wizard_${Date.now()}`,
        ancestry: "Elf",
        background: "Scholar",
        className: "Wizard",
        attributes: {
          strength: 10,
          dexterity: 14,
          constitution: 12,
          intelligence: 16,
          wisdom: 12,
          charisma: 10
        }
      }
    };
    return templates[template];
  }
}
```

### 6.2 Test Isolation Strategy

- Generate unique user identities per test run
- Use timestamp-based character names
- Clean up test data after suite completion
- Implement test data namespacing

## 7. Success Criteria

### 7.1 Sub-Task Level Success Criteria

Each sub-task must meet these specific criteria before proceeding:

#### Phase 0 Sub-Tasks (Contract API)
- **0.1**: TypeScript compilation without errors, all 15 methods mapped correctly
- **0.2**: Character CRUD methods return proper response types, validation successful  
- **0.3**: Management methods properly distinguish Submit vs Evaluate calls
- **0.4**: Connection test passes, all 64 methods accessible via client

#### Phase 1 Sub-Tasks (Foundation)
- **1.1**: Data loader successfully loads all JSON fixtures without errors
- **1.2**: All 6 CRUD tests pass for weapons/armor, proper state management
- **1.3**: All 12 CRUD tests pass for remaining reference types

#### Phase 2-6 Sub-Tasks
- All tests in sub-task pass consistently (3 consecutive runs)
- No memory leaks or connection issues
- Proper cleanup in `afterAll` blocks
- Integration with previous sub-tasks verified

### 7.2 Integration Checkpoints

After every 2-3 sub-tasks, run full integration tests to ensure:
- Contract API changes don't break existing tests
- Data fixtures load correctly across all test suites
- No regression in previously working functionality

### 7.3 Overall Coverage Targets
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
- Contract API fully implemented and tested
- All CRUD operations tested
- Complex workflows validated
- Business rules enforced
- Error handling verified
- Authorization checked

## 8. AI Agent Implementation Guidelines

### 8.1 Context Management Best Practices

#### Before Starting Each Sub-Task
1. **Load Required Context**: Read contract files, existing test patterns, and relevant DTOs
2. **Validate Dependencies**: Ensure prerequisite sub-tasks completed successfully  
3. **Review Scope**: Confirm sub-task boundaries and expected deliverables
4. **Check Integration**: Verify how sub-task connects to overall system

#### During Implementation
1. **Stay Within Scope**: Don't exceed sub-task boundaries or add unrelated features
2. **Follow Patterns**: Use established patterns from `apples.spec.ts` and existing tests
3. **Incremental Development**: Build and test functionality in small, verifiable chunks
4. **Regular Validation**: Test each method/component as it's implemented

#### Context Window Management
- **Import Strategy**: Import only DTOs and types needed for current sub-task
- **Code Chunking**: Break large API files into logical sections during implementation  
- **Reference Management**: Use file references rather than copying large code blocks
- **Memory Efficiency**: Clear unnecessary context between sub-tasks

### 8.2 Common AI Agent Pitfalls and Solutions

#### Pitfall: Scope Creep
**Problem**: AI agents often try to implement related functionality beyond sub-task scope  
**Solution**: Strict adherence to sub-task definitions, explicit scope boundaries

#### Pitfall: Pattern Inconsistency  
**Problem**: Not following established patterns from apples.spec.ts
**Solution**: Always reference existing patterns, copy structure exactly

#### Pitfall: Context Overflow
**Problem**: Loading too many files at once, exceeding context limits
**Solution**: Load files incrementally, focus on immediate requirements

#### Pitfall: Integration Assumptions
**Problem**: Assuming other sub-tasks will be implemented in specific ways
**Solution**: Work to defined interfaces, avoid tight coupling

### 8.3 Sub-Task Implementation Workflow

1. **Planning** (5 minutes)
   - Read sub-task definition and success criteria
   - Identify required imports and dependencies  
   - Review existing patterns and examples

2. **Setup** (10-15 minutes)
   - Create file structure
   - Set up basic imports and boilerplate
   - Define contract configuration

3. **Core Implementation** (45-60 minutes)
   - Implement main functionality following patterns
   - Add test cases incrementally
   - Validate each component as built

4. **Integration Testing** (15-20 minutes)
   - Run tests to ensure functionality works
   - Test integration with existing components
   - Fix any issues discovered

5. **Completion** (5 minutes)
   - Verify all success criteria met
   - Document any deviations or issues
   - Prepare handoff to next sub-task

## 9. Risks and Mitigation

### Technical Risks
- **API Mismatch**: Contract methods not matching API - Validate against actual contract
- **Network Instability**: Use retries and timeouts
- **Test Data Conflicts**: Implement proper isolation
- **Performance Issues**: Use pagination and limits
- **DTO Mismatches**: Maintain API versioning

### AI Agent Specific Risks
- **Context Window Overflow**: Sub-tasks too large for agent context
- **Pattern Deviation**: Not following established test patterns  
- **Scope Creep**: Implementing beyond sub-task boundaries
- **Integration Gaps**: Poor handoff between sub-tasks

### Mitigation Strategies
- Test API implementation early and thoroughly
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
- JSDoc comments for API methods
- Inline comments for complex logic
- Example usage in each test file
- Maintenance notes

## 10. Conclusion

This comprehensive E2E testing plan ensures thorough validation of the RPG chaincode system. The critical insight is that the contract API implementation must come first - without it, no tests can execute. The API provides type safety, method mapping, and proper client communication with the blockchain.

By following the pattern established in `apples.spec.ts`, each test suite will have a properly configured client that can interact with the RPG contract methods. The modular approach allows for incremental implementation while maintaining test independence.

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

## Appendix C: Quick API Validation Test

Create this minimal test to verify the API is working:

```typescript
// e2e/rpg.api.validation.spec.ts
import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";

describe("RPG Contract API Validation", () => {
  const rpgContractConfig = {
    rpg: {
      channel: "product-channel",
      chaincode: "basic-product",
      contract: "Rpg",
      api: rpgContractAPI
    }
  };
  
  let client: AdminChainClients<typeof rpgContractConfig>;
  
  beforeAll(async () => {
    client = await TestClients.createForAdmin(rpgContractConfig);
  });
  
  afterAll(async () => {
    await client.disconnect();
  });
  
  test("Can connect to RPG contract and fetch API", async () => {
    const response = await client.rpg.GetContractAPI();
    expect(response).toEqual(transactionSuccess());
    expect(response.Data?.contractName).toBe("Rpg");
  });
});
```

Run this test first to ensure the API is properly configured before writing any other tests.