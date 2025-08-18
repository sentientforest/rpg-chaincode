# Pathfinder Key Terms - Design Specification
**Date:** August 15, 2025  
**Phase:** Foundation Design  
**Dependencies:** None (Foundation layer)

## System Design Overview
Based on the key terms analysis, we need to establish the foundational data types, enums, and validation logic that will support all higher-level game mechanics. 
These core concepts will be embedded throughout the RPG chaincode system.

## Core Data Types & Enums

### 1. Proficiency System
```typescript
enum ProficiencyRank {
  UNTRAINED = 0,
  TRAINED = 2,
  EXPERT = 4,
  MASTER = 6,
  LEGENDARY = 8
}

interface ProficiencyInfo {
  rank: ProficiencyRank;
  level: number;
  bonus: number; // Calculated: rank === 0 ? 0 : level + rank
}
```

### 2. Character Attributes
```typescript
interface AttributeModifiers {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface AttributeInfo {
  modifier: number;
  proficiency: ProficiencyRank;
}
```

### 3. Rarity System
```typescript
enum Rarity {
  COMMON = "common",
  UNCOMMON = "uncommon", 
  RARE = "rare",
  UNIQUE = "unique"
}

interface RarityAccess {
  rarity: Rarity;
  accessRequirements?: string[]; // For uncommon+ items
}
```

### 4. Currency System
```typescript
interface Currency {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
}

// Conversion utilities
const CURRENCY_CONVERSION = {
  CP_TO_SP: 10,
  SP_TO_GP: 10,
  GP_TO_PP: 10
} as const;
```

### 5. Combat Statistics
```typescript
interface CombatStats {
  armorClass: number;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  speed: number; // feet per action
  initiative: number;
}

interface SavingThrows {
  fortitude: ProficiencyInfo;
  reflex: ProficiencyInfo;
  will: ProficiencyInfo;
}
```

## User Stories

### Epic: Character Foundation System
As a player creating a character, I need the system to properly track and validate the core mechanical elements so that my character functions correctly according to Pathfinder rules.

#### Story 1: Proficiency Calculation
**As a** player  
**I want** the system to automatically calculate my proficiency bonuses  
**So that** my skill checks and attacks use the correct modifiers

**Acceptance Criteria:**
- Given a character at level 5 with Expert proficiency in Athletics
- When I view my Athletics modifier
- Then it should show level (5) + expert bonus (4) = +9 base proficiency
- And the total modifier should include my Strength modifier

#### Story 2: Attribute Management  
**As a** player  
**I want** to assign and modify my six core attributes  
**So that** they properly influence all related game mechanics

**Acceptance Criteria:**
- All six attributes (Str, Dex, Con, Int, Wis, Cha) must be tracked
- Attribute modifiers must be calculated from scores if using point-buy
- Changes to attributes must update all dependent calculations
- System must prevent invalid attribute assignments

#### Story 3: Rarity Validation
**As a** GM  
**I want** the system to enforce rarity restrictions on character options  
**So that** players can only select appropriate content for their characters

**Acceptance Criteria:**
- Common items are available to all characters
- Uncommon items require specific access criteria
- Rare items require GM approval
- Unique items are one-of-a-kind and restricted

#### Story 4: Currency Management
**As a** player  
**I want** to track my character's wealth in the proper currency denominations  
**So that** I can make purchases and track treasure accurately

**Acceptance Criteria:**
- Support for copper, silver, gold, and platinum pieces
- Automatic conversion between denominations
- Starting characters begin with 15 gp equivalent
- Prevent negative currency values

## Validation Rules

### Proficiency Validation
```typescript
function validateProficiencyProgression(current: ProficiencyRank, target: ProficiencyRank): boolean {
  // Cannot skip proficiency ranks
  const validProgression = [
    ProficiencyRank.UNTRAINED,
    ProficiencyRank.TRAINED, 
    ProficiencyRank.EXPERT,
    ProficiencyRank.MASTER,
    ProficiencyRank.LEGENDARY
  ];
  
  const currentIndex = validProgression.indexOf(current);
  const targetIndex = validProgression.indexOf(target);
  
  return targetIndex === currentIndex + 1;
}
```

### Level Validation
```typescript
function validateCharacterLevel(level: number): boolean {
  return level >= 1 && level <= 20 && Number.isInteger(level);
}

function validateThreatLevel(level: number): boolean {
  return level >= -1 && level <= 30 && Number.isInteger(level);
}
```

### Currency Validation
```typescript
function validateCurrency(currency: Currency): boolean {
  return Object.values(currency).every(amount => 
    Number.isInteger(amount) && amount >= 0
  );
}

function convertToBaseCopper(currency: Currency): number {
  return currency.copper + 
         (currency.silver * 10) + 
         (currency.gold * 100) + 
         (currency.platinum * 1000);
}
```

## Smart Contract Integration

### ChainObject Extensions
```typescript
// Extend base PlayerCharacter with foundation concepts
interface PlayerCharacterFoundation {
  level: number;
  attributes: AttributeModifiers;
  proficiencies: Record<string, ProficiencyRank>;
  currency: Currency;
  hitPoints: {
    maximum: number;
    current: number;
  };
  armorClass: number;
  speed: number;
}
```

### Validation Methods
```typescript
class FoundationValidator {
  static validateCharacterLevel(level: number): void {
    if (!validateCharacterLevel(level)) {
      throw new ValidationError("Character level must be between 1 and 20");
    }
  }
  
  static validateProficiencyRank(rank: ProficiencyRank): void {
    if (!Object.values(ProficiencyRank).includes(rank)) {
      throw new ValidationError("Invalid proficiency rank");
    }
  }
  
  static calculateProficiencyBonus(level: number, rank: ProficiencyRank): number {
    this.validateCharacterLevel(level);
    this.validateProficiencyRank(rank);
    
    return rank === ProficiencyRank.UNTRAINED ? 0 : level + rank;
  }
}
```

## API Design

### Core Endpoints
```typescript
// Character Foundation Management
interface CharacterFoundationAPI {
  // Level management
  updateCharacterLevel(characterId: string, newLevel: number): Promise<void>;
  
  // Attribute management  
  updateAttributes(characterId: string, attributes: AttributeModifiers): Promise<void>;
  
  // Proficiency management
  updateProficiency(characterId: string, skill: string, rank: ProficiencyRank): Promise<void>;
  
  // Currency management
  updateCurrency(characterId: string, currency: Currency): Promise<void>;
  
  // Combat stats
  updateHitPoints(characterId: string, current: number, maximum?: number): Promise<void>;
  updateArmorClass(characterId: string, ac: number): Promise<void>;
}
```

## Testing Requirements

### Unit Tests
- [ ] Proficiency bonus calculations for all ranks and levels
- [ ] Currency conversion accuracy 
- [ ] Attribute modifier calculations
- [ ] Validation rule enforcement
- [ ] Rarity access checking

### Integration Tests  
- [ ] Character creation with foundation elements
- [ ] Level progression updates
- [ ] Cross-system proficiency dependencies
- [ ] Currency transaction validation

## Performance Considerations

### Gas Optimization
- Use packed structs for frequently accessed data
- Minimize storage operations for temporary calculations
- Cache calculated values when appropriate

### Storage Design
- Store core character data in single packed object
- Use events for tracking character progression
- Implement efficient proficiency lookup patterns

---

**Next Phase:** Character Creation Process Design  
**Dependencies:** This foundation layer will support all subsequent character creation mechanics