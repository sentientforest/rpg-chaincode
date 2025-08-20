# Character Creation Development Plans, Designs, and Architecture
**Date:** August 18, 2025  
**Status:** Architecture & Development Planning - REVISED for ECS  
**Objective:** Complete character creation system implementation on GalaChain using Entity-Component-System architecture

## Executive Summary

This document outlines the comprehensive development plan for implementing a complete character creation system for the RPG chaincode on GalaChain. The plan follows:
1. **Entity-Component-System (ECS) architecture** for on-chain gaming
2. **Pragmatic "facts not objects" approach** - balancing pure facts with practical considerations
3. **GalaChain best practices** - proper ChainObject/DTO separation, efficient queries
4. **ORC-licensed RPG rules** - implementing Pathfinder mechanics

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

### Core Principles

#### 1. Entity-Component-System (ECS) Architecture
- **Entities**: Character identities (PlayerCharacterEntity)
- **Components**: Modular data attached to entities (AttributesComponent, AncestryComponent, etc.)
- **Systems**: Contract methods that operate on components

#### 2. Pragmatic Facts Approach
We follow "facts not objects" with practical considerations:
- **Pure Facts**: Individual items like TraitComponent, each feat, each skill
- **Practical Grouping**: AttributesComponent keeps all 6 attributes together (they're always accessed together)
- **Reference Data**: AncestryData, ClassData stored as reference objects (rarely change, loaded from JSON)

#### 3. Data Separation Strategy
- **Frequently Updated**: Current HP, conditions, temporary effects
- **Infrequently Updated**: Level, max HP, proficiencies
- **Immutable**: Creation events, advancement history
- **Reference Data**: Game rules, ancestry/class definitions

### Chain Key Design Strategy

#### ECS Entity Pattern
All components follow the pattern established in existing code:
- Position 0: `entity` (composite key of PlayerCharacterEntity)
- Position 1+: Component-specific identifiers

This enables efficient queries: "Get all components for entity X"

#### Entities (Already Implemented)
```typescript
// Already exists - perfect for ECS
class PlayerCharacterEntity extends ChainObject {
  public static INDEX_KEY = "RPCE";
  
  @ChainKey({ position: 0 })
  @IsUserAlias()
  public identity: UserAlias; // Player identity
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public name: string; // Character name
  
  // Additional immutable data to add:
  // public characterId: string; // UUID for cross-references
  // public createdAt: number;
  // public concept: string;
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

#### Component Patterns

##### Existing Component Pattern (Good for grouped data)
```typescript
// Already implemented - groups related data accessed together
class AttributesComponent extends ChainObject {
  @ChainKey({ position: 0 })
  public entity: string;
  
  // All 6 attributes grouped (always accessed together)
  public strength: number;
  public dexterity: number;
  // ... etc
}

class AncestryComponent extends ChainObject {
  @ChainKey({ position: 0 })
  public entity: string;
  
  public ancestry: string;
  public heritage: string;
}
```

##### Individual Facts Pattern (For collections)
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
// Missing Components to Add
class BackgroundComponent extends ChainObject {
  public static INDEX_KEY = "RPBG";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  public background: string;
  public trainedSkill: string;
  public loreSkill: string;
  public skillFeat: string;
}

class ClassComponent extends ChainObject {
  public static INDEX_KEY = "RPCL";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 }) // Support multiclass
  public classIndex: string; // "0" for primary, "1" for secondary
  
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

#### Reference Data (Loaded from JSON)
```typescript
// These exist and are well-designed
class AncestryData extends ChainObject {
  public static INDEX_KEY = "RAD";
  
  @ChainKey({ position: 0 })
  public name: string;
  
  // Reference data with arrays is fine (not player-specific)
  public attributeBoosts: AttributeModifier[];
  public attributeFlaws: AttributeModifier[];
  public traits: string[];
}

class ClassData extends ChainObject {
  public static INDEX_KEY = "RCD";
  
  @ChainKey({ position: 0 })
  public name: string;
  
  // Reference data
  public keyAttribute: AttributeModifier;
  public hitPointsBase: BigNumber;
  public traits: string[];
}

// To Add:
class BackgroundData extends ChainObject {
  public static INDEX_KEY = "RBD";
  
  @ChainKey({ position: 0 })
  public name: string;
  
  public attributeBoosts: AttributeModifier[];
  public trainedSkill: string;
  public loreSkill: string;
  public skillFeat: string;
}
```

## Additional Considerations for Implementation

### 1. Reference Data Management
- Load ancestry/class/background data from JSON files on contract initialization
- Cache in memory for performance
- Use admin-only methods to update reference data

### 2. DTO Design Patterns
```typescript
// Input DTOs extend SubmitCallDTO or EvaluateCallDTO
class SelectAncestryDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public ancestry: string;
  
  @IsNotEmpty()
  public heritage: string;
  
  @IsOptional()
  public ancestryFeat?: string;
}

// Response DTOs for complex queries
class CharacterSheetDto extends ChainCallDTO {
  public entity: PlayerCharacterEntity;
  public attributes: AttributesComponent;
  public ancestry: AncestryComponent;
  public background?: BackgroundComponent;
  public classes: ClassComponent[];
  public traits: TraitComponent[];
  public skills: CharacterSkillTraining[];
  public feats: CharacterAncestryFeat[];
  public equipment: CharacterEquipment[];
}
```

### 3. ECS System Methods
```typescript
// Systems operate on components
class CharacterSystem {
  // Calculate derived values from components
  static calculateMaxHP(ctx, entity: string): Promise<number> {
    const [attributes, progression, classes] = await Promise.all([
      getAttributesComponent(ctx, entity),
      getProgressionComponent(ctx, entity),
      getClassComponents(ctx, entity)
    ]);
    
    return calculateHP(attributes.constitution, progression.level, classes);
  }
  
  // Apply effects across components
  static applyCondition(ctx, entity: string, condition: string): Promise<void> {
    // Update multiple components as needed
  }
}
```

### 4. Proficiency System Design
```typescript
class CharacterProficiency extends ChainObject {
  public static INDEX_KEY = "RCPR";
  
  @ChainKey({ position: 0 })
  public entity: string;
  
  @ChainKey({ position: 1 })
  public proficiencyType: string; // "skill" | "save" | "weapon" | "armor" | "perception"
  
  @ChainKey({ position: 2 })
  public proficiencyName: string; // e.g., "Acrobatics", "Fortitude", "Longsword"
  
  public rank: string; // "untrained" | "trained" | "expert" | "master" | "legendary"
  public source: string; // Where this proficiency came from
}
```

### 5. Transaction Patterns
```typescript
// Batch writes for related components
async function createCharacter(ctx, dto): Promise<void> {
  const entity = playerChar.getCompositeKey();
  
  // Create all base components in one transaction
  await Promise.all([
    putChainObject(ctx, playerChar),
    putChainObject(ctx, attributesComponent),
    putChainObject(ctx, ancestryComponent),
    putChainObject(ctx, progressionComponent),
    putChainObject(ctx, stateComponent)
  ]);
  
  // Add individual facts
  for (const trait of ancestryData.traits) {
    await putChainObject(ctx, new TraitComponent({ entity, name: trait }));
  }
}
```

## Comprehensive Implementation Specifications

### 1. Missing ChainObject Types (To Implement)

```typescript
// Background Reference Data
class BackgroundData extends ChainObject {
  public static INDEX_KEY = "RBD";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public description: string;
  
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeBoosts: AttributeModifier[]; // Usually 2: one limited, one free
  
  @IsNotEmpty()
  public trainedSkill: string;
  
  @IsNotEmpty() 
  public loreSkill: string;
  
  @IsNotEmpty()
  public skillFeat: string;
  
  @IsNotEmpty()
  public category: string; // "Professional", "Social", "Combat", etc.
}

// Background Component (Character Selection)
class BackgroundComponent extends ChainObject {
  public static INDEX_KEY = "RPBG";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @IsNotEmpty()
  public background: string;
  
  @IsNotEmpty()
  public trainedSkill: string; // May differ from background default if overlap
  
  @IsNotEmpty()
  public loreSkill: string;
  
  @IsNotEmpty()
  public skillFeat: string;
}

// Class Component (Character Selection)
class ClassComponent extends ChainObject {
  public static INDEX_KEY = "RPCL";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public classIndex: string; // "0" for primary, "1" for multiclass
  
  @IsNotEmpty()
  public className: string;
  
  @IsNumber()
  @Min(1)
  public classLevel: number;
  
  @IsOptional()
  @IsNotEmpty()
  public subclass?: string; // Muse, Order, Doctrine, etc.
  
  @IsNotEmpty()
  public keyAttribute: string; // "Charisma", "Wisdom", etc.
}

// Character Progression (Infrequent Updates)
class CharacterProgression extends ChainObject {
  public static INDEX_KEY = "RPPR";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public experiencePoints: BigNumber;
  
  @BigNumberProperty()
  @BigNumberIsPositive()
  public hitPointsMax: BigNumber;
  
  @IsNumber()
  public ancestryHPBonus: number;
  
  @IsNumber() 
  public classHPBonus: number;
  
  @IsNumber()
  public constitutionHPBonus: number;
}

// Character Current State (Frequent Updates)
class CharacterState extends ChainObject {
  public static INDEX_KEY = "RPST";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public hitPointsCurrent: BigNumber;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public temporaryHP: BigNumber;
  
  @IsNumber()
  @Min(0)
  @Max(3)
  public heroPoints: number;
  
  @IsNumber()
  @Min(0)
  public focusPoints: number;
  
  @IsNumber()
  public lastUpdated: number; // ctx.txUnixTime
}

// Skill Proficiency (Individual Facts)
class CharacterSkillProficiency extends ChainObject {
  public static INDEX_KEY = "RPSK";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public skillName: string;
  
  @IsIn(["untrained", "trained", "expert", "master", "legendary"])
  public proficiencyRank: string;
  
  @IsNotEmpty()
  public source: string; // "background", "class", "general", "ancestry"
}

// Character Feat (Individual Facts)
class CharacterFeat extends ChainObject {
  public static INDEX_KEY = "RPFT";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public featName: string;
  
  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public featType: string;
  
  @IsNotEmpty()
  public source: string; // Which granted this feat
  
  @IsNumber()
  public level: number; // Level when feat was gained
}

// Equipment Item (Individual Facts)
class CharacterEquipment extends ChainObject {
  public static INDEX_KEY = "RPEQ";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public itemId: string; // UUID for item instance
  
  @IsNotEmpty()
  public itemName: string;
  
  @IsNotEmpty()
  public itemType: string; // "weapon", "armor", "gear", "consumable"
  
  @BigNumberProperty()
  @BigNumberIsPositive()
  public quantity: BigNumber;
  
  @IsBoolean()
  public isEquipped: boolean;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulkPerItem: BigNumber;
  
  @IsOptional()
  @IsNotEmpty()
  public containerSlot?: string; // "backpack", "belt pouch", etc.
}

// Character Creation State (Workflow Tracking)
class CharacterCreationState extends ChainObject {
  public static INDEX_KEY = "RPCS";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @IsNumber()
  @Min(1)
  @Max(10)
  public currentStep: number;
  
  @ArrayMinSize(0)
  @IsNumber({}, { each: true })
  public completedSteps: number[];
  
  @IsBoolean()
  public isComplete: boolean;
  
  @IsBoolean()
  public isValid: boolean;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public validationErrors: string[];
  
  @IsNumber()
  public lastUpdated: number;
}

// Creation Event History (Immutable)
class CharacterCreationEvent extends ChainObject {
  public static INDEX_KEY = "RPCE";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public entity: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public timestamp: string; // Padded txUnixTime
  
  @ChainKey({ position: 2 })
  @IsNotEmpty()
  public stepNumber: string; // Padded "01", "02", etc.
  
  @IsNotEmpty()
  public stepType: string;
  
  @IsNotEmpty()
  public txId: string;
  
  @IsBoolean()
  public isValid: boolean;
  
  @IsOptional()
  public stepData?: any; // Specific to step type
}
```

### 2. Missing DTO Types (To Implement)

```typescript
// Character Creation DTOs
class StartCharacterCreationDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsOptional()
  @IsNotEmpty()
  public concept?: string;
}

class SelectAncestryDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public ancestry: string;
  
  @IsNotEmpty()
  public heritage: string;
  
  @IsOptional()
  @IsNotEmpty()
  public ancestryFeat?: string;
}

class SelectBackgroundDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public background: string;
  
  // For resolving skill overlap
  @IsOptional()
  @IsNotEmpty()
  public alternativeSkill?: string;
}

class SelectClassDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsNotEmpty()
  public className: string;
  
  @IsOptional()
  @IsNotEmpty()
  public subclass?: string;
  
  @IsOptional()
  @ArrayMinSize(0)
  @IsString({ each: true })
  public classChoices?: string[]; // Class-specific selections
}

class ApplyAttributeBoostsDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsIn(["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"], { each: true })
  public freeBoosts: string[]; // Must be 4 different attributes
}

class SelectSkillsDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @ArrayMinSize(1)
  @IsString({ each: true })
  public selectedSkills: string[]; // From class skill options
}

class PurchaseEquipmentDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @ValidateNested({ each: true })
  @Type(() => EquipmentPurchase)
  public purchases: EquipmentPurchase[];
}

class EquipmentPurchase {
  @IsNotEmpty()
  public itemName: string;
  
  @IsNumber()
  @Min(1)
  public quantity: number;
  
  @IsOptional()
  @IsBoolean()
  public equip?: boolean;
}

class FinalizeCharacterDto extends SubmitCallDTO {
  @IsNotEmpty()
  public characterName: string;
  
  @IsOptional()
  @IsNotEmpty()
  public age?: string;
  
  @IsOptional()
  @IsNotEmpty()
  public gender?: string;
  
  @IsOptional()
  @IsNotEmpty()
  public deity?: string;
  
  @IsOptional()
  @IsNotEmpty()
  public appearance?: string;
}

// Response DTOs
class CharacterCreationStateDto extends ChainCallDTO {
  @ValidateNested()
  @Type(() => PlayerCharacterEntity)
  public character: PlayerCharacterEntity;
  
  @ValidateNested()
  @Type(() => CharacterCreationState)
  public creationState: CharacterCreationState;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => AttributesComponent)
  public attributes?: AttributesComponent;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => AncestryComponent)
  public ancestry?: AncestryComponent;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => BackgroundComponent)
  public background?: BackgroundComponent;
  
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ClassComponent)
  public classes?: ClassComponent[];
  
  @IsArray()
  @IsString({ each: true })
  public validationErrors: string[];
}

class CharacterSheetDto extends ChainCallDTO {
  @ValidateNested()
  @Type(() => PlayerCharacterEntity)
  public entity: PlayerCharacterEntity;
  
  @ValidateNested()
  @Type(() => AttributesComponent)
  public attributes: AttributesComponent;
  
  @ValidateNested()
  @Type(() => AncestryComponent)
  public ancestry: AncestryComponent;
  
  @IsOptional()
  @ValidateNested()
  @Type(() => BackgroundComponent)
  public background?: BackgroundComponent;
  
  @ValidateNested({ each: true })
  @Type(() => ClassComponent)
  public classes: ClassComponent[];
  
  @ValidateNested({ each: true })
  @Type(() => TraitComponent)
  public traits: TraitComponent[];
  
  @ValidateNested({ each: true })
  @Type(() => CharacterSkillProficiency)
  public skills: CharacterSkillProficiency[];
  
  @ValidateNested({ each: true })
  @Type(() => CharacterFeat)
  public feats: CharacterFeat[];
  
  @ValidateNested({ each: true })
  @Type(() => CharacterEquipment)
  public equipment: CharacterEquipment[];
  
  @ValidateNested()
  @Type(() => CharacterProgression)
  public progression: CharacterProgression;
  
  @ValidateNested()
  @Type(() => CharacterState)
  public state: CharacterState;
}
```

### 3. Contract Method Implementation

```typescript
export class RpgContract extends GalaContract {
  constructor() {
    super("Rpg", version);
  }
  
  // === CHARACTER CREATION WORKFLOW ===
  
  @Submit({
    in: StartCharacterCreationDto
  })
  public async StartCharacterCreation(
    ctx: GalaChainContext,
    dto: StartCharacterCreationDto
  ): Promise<CharacterCreationStateDto> {
    return await startCharacterCreation(ctx, dto);
  }
  
  @Submit({
    in: SelectAncestryDto
  })
  public async SelectAncestryAndHeritage(
    ctx: GalaChainContext,
    dto: SelectAncestryDto
  ): Promise<CharacterCreationStateDto> {
    return await selectAncestry(ctx, dto);
  }
  
  @Submit({
    in: SelectBackgroundDto
  })
  public async SelectBackground(
    ctx: GalaChainContext,
    dto: SelectBackgroundDto
  ): Promise<CharacterCreationStateDto> {
    return await selectBackground(ctx, dto);
  }
  
  @Submit({
    in: SelectClassDto
  })
  public async SelectClass(
    ctx: GalaChainContext,
    dto: SelectClassDto
  ): Promise<CharacterCreationStateDto> {
    return await selectClass(ctx, dto);
  }
  
  @Submit({
    in: ApplyAttributeBoostsDto
  })
  public async ApplyFreeAttributeBoosts(
    ctx: GalaChainContext,
    dto: ApplyAttributeBoostsDto
  ): Promise<CharacterCreationStateDto> {
    return await applyFreeBoosts(ctx, dto);
  }
  
  @Submit({
    in: SelectSkillsDto
  })
  public async SelectSkills(
    ctx: GalaChainContext,
    dto: SelectSkillsDto
  ): Promise<CharacterCreationStateDto> {
    return await selectSkills(ctx, dto);
  }
  
  @Submit({
    in: PurchaseEquipmentDto
  })
  public async PurchaseEquipment(
    ctx: GalaChainContext,
    dto: PurchaseEquipmentDto
  ): Promise<CharacterCreationStateDto> {
    return await purchaseEquipment(ctx, dto);
  }
  
  @Submit({
    in: FinalizeCharacterDto
  })
  public async FinalizeCharacter(
    ctx: GalaChainContext,
    dto: FinalizeCharacterDto
  ): Promise<CharacterSheetDto> {
    return await finalizeCharacter(ctx, dto);
  }
  
  // === CHARACTER QUERIES ===
  
  @Evaluate({
    in: GetCharacterCreationStateDto,
    out: CharacterCreationStateDto
  })
  public async GetCharacterCreationState(
    ctx: GalaChainContext,
    dto: GetCharacterCreationStateDto
  ): Promise<CharacterCreationStateDto> {
    return await getCreationState(ctx, dto);
  }
  
  @Evaluate({
    in: GetCharacterSheetDto,
    out: CharacterSheetDto
  })
  public async GetCharacterSheet(
    ctx: GalaChainContext,
    dto: GetCharacterSheetDto
  ): Promise<CharacterSheetDto> {
    return await getCharacterSheet(ctx, dto);
  }
  
  @Evaluate({
    in: ValidateCharacterDto,
    out: ValidationResultDto
  })
  public async ValidateCharacter(
    ctx: GalaChainContext,
    dto: ValidateCharacterDto
  ): Promise<ValidationResultDto> {
    return await validateCharacter(ctx, dto);
  }
  
  // === REFERENCE DATA CRUD OPERATIONS ===
  
  // Ancestry Data CRUD
  @Submit({
    in: CreateAncestryDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateAncestryData(
    ctx: GalaChainContext,
    dto: CreateAncestryDataDto
  ): Promise<void> {
    return await createAncestryData(ctx, dto);
  }
  
  @Submit({
    in: UpdateAncestryDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async UpdateAncestryData(
    ctx: GalaChainContext,
    dto: UpdateAncestryDataDto
  ): Promise<void> {
    return await updateAncestryData(ctx, dto);
  }
  
  @Submit({
    in: DeleteReferenceDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async DeleteAncestryData(
    ctx: GalaChainContext,
    dto: DeleteReferenceDataDto
  ): Promise<void> {
    return await deleteReferenceData(ctx, dto, AncestryData);
  }
  
  // Equipment Data CRUD
  @Submit({
    in: CreateWeaponDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateWeaponData(
    ctx: GalaChainContext,
    dto: CreateWeaponDataDto
  ): Promise<void> {
    return await createWeaponData(ctx, dto);
  }
  
  @Submit({
    in: CreateArmorDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateArmorData(
    ctx: GalaChainContext,
    dto: CreateArmorDataDto
  ): Promise<void> {
    return await createArmorData(ctx, dto);
  }
  
  // Skill Data CRUD
  @Submit({
    in: CreateSkillDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateSkillData(
    ctx: GalaChainContext,
    dto: CreateSkillDataDto
  ): Promise<void> {
    return await createSkillData(ctx, dto);
  }
  
  // Feat Data CRUD
  @Submit({
    in: CreateFeatDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateFeatData(
    ctx: GalaChainContext,
    dto: CreateFeatDataDto
  ): Promise<void> {
    return await createFeatData(ctx, dto);
  }
  
  // Spell Data CRUD
  @Submit({
    in: CreateSpellDataDto,
    allowedOrgs: ["CuratorOrg"]
  })
  public async CreateSpellData(
    ctx: GalaChainContext,
    dto: CreateSpellDataDto
  ): Promise<void> {
    return await createSpellData(ctx, dto);
  }
  
  // Reference Data Queries
  @Evaluate({
    in: GetReferenceDataDto,
    out: ChainCallDTO
  })
  public async GetReferenceData(
    ctx: GalaChainContext,
    dto: GetReferenceDataDto
  ): Promise<ChainCallDTO> {
    return await getReferenceData(ctx, dto);
  }
  
  @Evaluate({
    in: ListReferenceDataDto,
    out: ChainCallDTO
  })
  public async ListReferenceData(
    ctx: GalaChainContext,
    dto: ListReferenceDataDto
  ): Promise<ChainCallDTO> {
    return await listReferenceData(ctx, dto);
  }
```

### 4. Reference Data CRUD System

```typescript
// Reference Data DTOs for CRUD Operations
class CreateAncestryDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public description: string;
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public hitPoints: number;
  
  @IsIn(["Small", "Medium", "Large"])
  public size: string;
  
  @IsNumber()
  @Min(10)
  @Max(40)
  public speed: number;
  
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeBoosts: AttributeModifier[];
  
  @ValidateNested({ each: true })
  @Type(() => AttributeModifier)
  public attributeFlaws: AttributeModifier[];
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];
}

class UpdateAncestryDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsOptional()
  @IsNotEmpty()
  public description?: string;
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  public hitPoints?: number;
  
  // ... other optional fields for partial updates
}

class CreateWeaponDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsIn(["simple", "martial", "advanced"])
  public category: string;
  
  @IsNotEmpty()
  public group: string; // "sword", "axe", "bow", etc.
  
  @ValidateNested()
  @Type(() => CurrencyDto)
  public price: CurrencyDto;
  
  @IsNotEmpty()
  public damage: string; // "1d8", "2d6", etc.
  
  @IsIn(["slashing", "piercing", "bludgeoning"])
  public damageType: string;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number; // Optional, may be "L" or "—" as special cases
  
  @IsOptional()
  @IsString()
  public bulkSpecial?: string; // "L" for light, "—" for negligible
  
  @IsNumber()
  @Min(1)
  @Max(2)
  public hands: number;
  
  @IsOptional()
  @IsNumber()
  @Min(10)
  public range?: number; // In feet for ranged weapons
}

class CreateArmorDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsIn(["unarmored", "light", "medium", "heavy"])
  public category: string;
  
  @ValidateNested()
  @Type(() => CurrencyDto)
  public price: CurrencyDto;
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public acBonus: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  public dexCap?: number;
  
  @IsNumber()
  @Min(-5)
  @Max(0)
  public checkPenalty: number;
  
  @IsNumber()
  @Min(-10)
  @Max(0)
  public speedPenalty: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public bulk?: number;
  
  @IsOptional()
  @IsString()
  public bulkSpecial?: string;
  
  @IsIn(["cloth", "leather", "chain", "plate", "composite"])
  public group: string;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];
}

class CurrencyDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  public platinum?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public gold?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public silver?: number;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  public copper?: number;
}

class CreateSkillDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsIn(["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"])
  public keyAttribute: string;
  
  @IsNotEmpty()
  public description: string;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public trainedActions: string[];
  
  @IsBoolean()
  public hasArmorCheckPenalty: boolean;
}

class CreateFeatDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsIn(["ancestry", "background", "class", "general", "skill"])
  public type: string;
  
  @IsNumber()
  @Min(1)
  @Max(20)
  public level: number;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public prerequisites: string[];
  
  @IsNotEmpty()
  public description: string;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];
  
  @IsOptional()
  @IsString()
  public frequency?: string;
}

class CreateSpellDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public name: string;
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public level: number;
  
  @ArrayMinSize(1)
  @IsIn(["arcane", "divine", "occult", "primal"], { each: true })
  public traditions: string[];
  
  @IsNotEmpty()
  public castingTime: string;
  
  @ArrayMinSize(0)
  @IsIn(["material", "somatic", "verbal", "focus"], { each: true })
  public components: string[];
  
  @IsNotEmpty()
  public range: string;
  
  @IsOptional()
  @IsString()
  public area?: string;
  
  @IsNotEmpty()
  public duration: string;
  
  @ArrayMinSize(0)
  @IsString({ each: true })
  public traits: string[];
  
  @IsNotEmpty()
  public description: string;
  
  @IsOptional()
  @IsString()
  public heightening?: string; // JSON string describing heightening effects
}

// Reference Data Query DTOs
class GetReferenceDataDto extends EvaluateCallDTO {
  @IsNotEmpty()
  public dataType: string; // "ancestry", "weapon", "armor", etc.
  
  @IsOptional()
  @IsNotEmpty()
  public name?: string; // Get specific item by name
}

class ListReferenceDataDto extends EvaluateCallDTO {
  @IsNotEmpty()
  public dataType: string;
  
  @IsOptional()
  @IsString()
  public category?: string; // Filter by category
  
  @IsOptional()
  @IsNumber()
  @Min(1)
  public limit?: number; // Pagination limit
  
  @IsOptional()
  @IsString()
  public bookmark?: string; // Pagination bookmark
}

class DeleteReferenceDataDto extends SubmitCallDTO {
  @IsNotEmpty()
  public dataType: string;
  
  @IsNotEmpty()
  public name: string;
}

// Reference Data ChainObjects for Equipment
class WeaponData extends ChainObject {
  public static INDEX_KEY = "RWD";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public category: string; // "simple", "martial", "advanced"
  
  @IsNotEmpty()
  public group: string; // "sword", "axe", "bow", etc.
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public price: BigNumber; // In copper pieces
  
  @IsNotEmpty()
  public damage: string; // "1d8", "2d6", etc.
  
  @IsNotEmpty()
  public damageType: string; // "slashing", "piercing", "bludgeoning"
  
  @ArrayMinSize(0)
  public traits: string[];
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulk: BigNumber;
  
  @IsNumber()
  @Min(1)
  @Max(2)
  public hands: number;
  
  @IsOptional()
  @IsNumber()
  public range?: number; // In feet for ranged weapons
}

class ArmorData extends ChainObject {
  public static INDEX_KEY = "RAR";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public category: string; // "unarmored", "light", "medium", "heavy"
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public price: BigNumber;
  
  @IsNumber()
  public acBonus: number;
  
  @IsOptional()
  @IsNumber()
  public dexCap?: number; // Max Dex bonus
  
  @IsNumber()
  public checkPenalty: number;
  
  @IsNumber()
  public speedPenalty: number;
  
  @BigNumberProperty()
  @BigNumberIsNotNegative()
  public bulk: BigNumber;
  
  @IsNotEmpty()
  public group: string; // "cloth", "leather", "chain", "plate"
  
  @ArrayMinSize(0)
  public traits: string[];
}

class SkillData extends ChainObject {
  public static INDEX_KEY = "RSD";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public keyAttribute: string; // "Strength", "Dexterity", etc.
  
  @IsNotEmpty()
  public description: string;
  
  @ArrayMinSize(0)
  public trainedActions: string[]; // Actions requiring training
  
  @IsBoolean()
  public hasArmorCheckPenalty: boolean;
}

class FeatData extends ChainObject {
  public static INDEX_KEY = "RFD";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNotEmpty()
  public type: string; // "ancestry", "class", "general", "skill"
  
  @IsNumber()
  public level: number; // Minimum level required
  
  @ArrayMinSize(0)
  public prerequisites: string[]; // Other requirements
  
  @IsNotEmpty()
  public description: string;
  
  @ArrayMinSize(0)
  public traits: string[];
  
  @IsOptional()
  public frequency?: string; // "once per day", "at will", etc.
}

class SpellData extends ChainObject {
  public static INDEX_KEY = "RSP";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public name: string;
  
  @IsNumber()
  @Min(0)
  @Max(10)
  public level: number; // 0 for cantrips
  
  @ArrayMinSize(1)
  public traditions: string[]; // ["arcane", "divine", etc.]
  
  @IsNotEmpty()
  public castingTime: string; // "1", "2", "3", "1 minute", etc.
  
  @ArrayMinSize(0)
  public components: string[]; // ["material", "somatic", "verbal", "focus"]
  
  @IsNotEmpty()
  public range: string; // "touch", "30 feet", "500 feet", etc.
  
  @IsOptional()
  public area?: string; // "10-foot burst", "30-foot cone", etc.
  
  @IsNotEmpty()
  public duration: string; // "instantaneous", "1 minute", "sustained", etc.
  
  @ArrayMinSize(0)
  public traits: string[];
  
  @IsNotEmpty()
  public description: string;
  
  @IsOptional()
  public heightening?: any; // Spell heightening effects
}
```

### 5. Validation Engine Implementation

```typescript
class CharacterValidation {
  
  static async validateStep(ctx: GalaChainContext, entity: string, step: number): Promise<ValidationResult> {
    const validationRules = await this.getValidationRulesForStep(step);
    const errors: string[] = [];
    const warnings: string[] = [];
    
    for (const rule of validationRules) {
      const result = await this.executeValidationRule(ctx, entity, rule);
      if (!result.isValid) {
        if (result.isBlocking) {
          errors.push(result.message);
        } else {
          warnings.push(result.message);
        }
      }
    }
    
    return new ValidationResult({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  }
  
  static async validateAttributeRange(attributes: AttributesComponent): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Check range constraints (-1 to +4 at level 1)
    const attrs = [attributes.strength, attributes.dexterity, attributes.constitution,
                  attributes.intelligence, attributes.wisdom, attributes.charisma];
    
    attrs.forEach((attr, index) => {
      const attrName = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'][index];
      if (attr < -1) errors.push(`${attrName} modifier cannot be below -1 (currently ${attr})`);
      if (attr > 4) errors.push(`${attrName} modifier cannot be above +4 (currently ${attr})`);
    });
    
    return new ValidationResult({ isValid: errors.length === 0, errors });
  }
  
  static async validateSkillOverlap(ctx: GalaChainContext, entity: string): Promise<ValidationResult> {
    // Check background vs class skill training overlap
    const [background, classes, skills] = await Promise.all([
      getObjectByKey(ctx, BackgroundComponent, BackgroundComponent.getCompositeKeyFromParts(BackgroundComponent.INDEX_KEY, [entity])),
      getObjectsByPartialCompositeKey(ctx, ClassComponent.INDEX_KEY, [entity]),
      getObjectsByPartialCompositeKey(ctx, CharacterSkillProficiency.INDEX_KEY, [entity])
    ]);
    
    // Implement overlap detection logic
    return new ValidationResult({ isValid: true, errors: [] });
  }
}
```

### 5. Game Mechanics Calculations

```typescript
// Core Calculation Functions
class GameCalculations {
  
  /**
   * Calculate Armor Class
   * AC = 10 + Dex modifier + proficiency bonus + armor bonus + shield bonus
   */
  static calculateAC(
    dexModifier: number,
    armorProficiencyBonus: number,
    armorACBonus: number,
    armorDexCap: number | undefined,
    shieldBonus: number = 0
  ): number {
    // Apply dex cap from armor if applicable
    const effectiveDex = armorDexCap !== undefined 
      ? Math.min(dexModifier, armorDexCap)
      : dexModifier;
    
    return 10 + effectiveDex + armorProficiencyBonus + armorACBonus + shieldBonus;
  }
  
  /**
   * Calculate Hit Points
   * HP = Ancestry HP + (Class HP per level × Level) + (Constitution modifier × Level)
   */
  static calculateMaxHP(
    ancestryHP: number,
    classHP: number,
    level: number,
    conModifier: number
  ): number {
    return ancestryHP + (classHP * level) + (conModifier * level);
  }
  
  /**
   * Calculate Proficiency Bonus
   * Bonus = Rank value + Character level
   * Untrained: 0, Trained: 2+level, Expert: 4+level, Master: 6+level, Legendary: 8+level
   */
  static calculateProficiencyBonus(
    rank: string,
    level: number
  ): number {
    const rankValues = {
      'untrained': 0,
      'trained': 2,
      'expert': 4,
      'master': 6,
      'legendary': 8
    };
    
    const rankValue = rankValues[rank.toLowerCase()] || 0;
    return rank === 'untrained' ? 0 : rankValue + level;
  }
  
  /**
   * Calculate Saving Throw
   * Save = d20 + attribute modifier + proficiency bonus + item bonus
   */
  static calculateSavingThrow(
    attributeModifier: number,
    proficiencyRank: string,
    level: number,
    itemBonus: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(proficiencyRank, level);
    return attributeModifier + profBonus + itemBonus;
  }
  
  /**
   * Calculate Skill Modifier
   * Skill = attribute modifier + proficiency bonus + item bonus - armor check penalty
   */
  static calculateSkillModifier(
    attributeModifier: number,
    proficiencyRank: string,
    level: number,
    itemBonus: number = 0,
    armorCheckPenalty: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(proficiencyRank, level);
    return attributeModifier + profBonus + itemBonus - armorCheckPenalty;
  }
  
  /**
   * Calculate Strike (Attack) Modifier
   * Strike = attribute modifier + proficiency bonus + item bonus
   */
  static calculateStrikeModifier(
    attributeModifier: number, // Str for melee, Dex for ranged
    weaponProficiencyRank: string,
    level: number,
    itemBonus: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(weaponProficiencyRank, level);
    return attributeModifier + profBonus + itemBonus;
  }
  
  /**
   * Calculate Class DC
   * DC = 10 + proficiency bonus + key attribute modifier
   */
  static calculateClassDC(
    keyAttributeModifier: number,
    classDCProficiencyRank: string,
    level: number
  ): number {
    const profBonus = this.calculateProficiencyBonus(classDCProficiencyRank, level);
    return 10 + profBonus + keyAttributeModifier;
  }
  
  /**
   * Calculate Spell Attack Modifier
   * Spell Attack = key attribute modifier + proficiency bonus + item bonus
   */
  static calculateSpellAttack(
    keyAttributeModifier: number,
    spellAttackProficiencyRank: string,
    level: number,
    itemBonus: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(spellAttackProficiencyRank, level);
    return keyAttributeModifier + profBonus + itemBonus;
  }
  
  /**
   * Calculate Spell DC
   * Spell DC = 10 + key attribute modifier + proficiency bonus + item bonus
   */
  static calculateSpellDC(
    keyAttributeModifier: number,
    spellDCProficiencyRank: string,
    level: number,
    itemBonus: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(spellDCProficiencyRank, level);
    return 10 + keyAttributeModifier + profBonus + itemBonus;
  }
  
  /**
   * Calculate Bulk Limits
   * Encumbered: 5 + Strength modifier
   * Maximum: 10 + Strength modifier
   */
  static calculateBulkLimits(strengthModifier: number): {
    encumbered: number;
    maximum: number;
  } {
    return {
      encumbered: 5 + strengthModifier,
      maximum: 10 + strengthModifier
    };
  }
  
  /**
   * Calculate Total Bulk
   * Sum of all equipment bulk, 10 light items = 1 bulk
   */
  static calculateTotalBulk(equipment: CharacterEquipment[]): BigNumber {
    let totalBulk = new BigNumber(0);
    
    for (const item of equipment) {
      if (item.isEquipped || item.containerSlot) {
        totalBulk = totalBulk.plus(item.bulkPerItem.times(item.quantity));
      }
    }
    
    return totalBulk;
  }
  
  /**
   * Convert Attribute Score to Modifier
   * Modifier = (Score - 10) / 2, rounded down
   */
  static attributeToModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }
  
  /**
   * Calculate Perception
   * Perception = Wisdom modifier + proficiency bonus + item bonus
   */
  static calculatePerception(
    wisdomModifier: number,
    perceptionProficiencyRank: string,
    level: number,
    itemBonus: number = 0
  ): number {
    const profBonus = this.calculateProficiencyBonus(perceptionProficiencyRank, level);
    return wisdomModifier + profBonus + itemBonus;
  }
}

// Currency Management
class CurrencyUtils {
  
  /**
   * Convert all currency to copper pieces for calculations
   */
  static toCopper(currency: {
    platinum?: number;
    gold?: number;
    silver?: number;
    copper?: number;
  }): BigNumber {
    let total = new BigNumber(0);
    if (currency.platinum) total = total.plus(currency.platinum * 1000);
    if (currency.gold) total = total.plus(currency.gold * 100);
    if (currency.silver) total = total.plus(currency.silver * 10);
    if (currency.copper) total = total.plus(currency.copper);
    return total;
  }
  
  /**
   * Convert copper pieces to optimal currency mix
   */
  static fromCopper(copper: BigNumber): {
    platinum: number;
    gold: number;
    silver: number;
    copper: number;
  } {
    const total = copper.toNumber();
    const platinum = Math.floor(total / 1000);
    const remainderAfterPlatinum = total % 1000;
    const gold = Math.floor(remainderAfterPlatinum / 100);
    const remainderAfterGold = remainderAfterPlatinum % 100;
    const silver = Math.floor(remainderAfterGold / 10);
    const copperCoins = remainderAfterGold % 10;
    
    return { platinum, gold, silver, copper: copperCoins };
  }
  
  /**
   * Calculate starting wealth (15 gp = 1500 cp)
   */
  static getStartingWealth(): BigNumber {
    return new BigNumber(1500); // 15 gold in copper pieces
  }
}

// Proficiency Progression
class ProficiencyProgression {
  
  /**
   * Check if character can increase proficiency rank
   */
  static canIncreaseProficiency(
    currentRank: string,
    characterLevel: number,
    increaseType: string
  ): boolean {
    const progression = {
      'untrained': { next: 'trained', requiredLevel: 1 },
      'trained': { next: 'expert', requiredLevel: 1 },
      'expert': { next: 'master', requiredLevel: 7 },
      'master': { next: 'legendary', requiredLevel: 15 }
    };
    
    const current = progression[currentRank.toLowerCase()];
    if (!current) return false;
    
    // Check level requirement
    if (characterLevel < current.requiredLevel) return false;
    
    // Check if this is a valid increase type (skill increase, class feature, etc.)
    return this.validateIncreaseType(increaseType, currentRank);
  }
  
  static validateIncreaseType(increaseType: string, currentRank: string): boolean {
    // Skill increases can go from untrained to trained, or increase existing
    if (increaseType === 'skill_increase') return true;
    
    // Class features may grant specific rank increases
    if (increaseType === 'class_feature') return true;
    
    // Feats may grant proficiency increases
    if (increaseType === 'feat') return true;
    
    return false;
  }
  
  /**
   * Get initial proficiencies for a class at level 1
   */
  static getInitialClassProficiencies(className: string): Map<string, string> {
    const proficiencies = new Map<string, string>();
    
    // Example for Fighter
    if (className === 'Fighter') {
      proficiencies.set('perception', 'expert');
      proficiencies.set('fortitude', 'expert');
      proficiencies.set('reflex', 'expert');
      proficiencies.set('will', 'trained');
      proficiencies.set('simple_weapons', 'expert');
      proficiencies.set('martial_weapons', 'expert');
      proficiencies.set('advanced_weapons', 'trained');
      proficiencies.set('unarmored', 'trained');
      proficiencies.set('light_armor', 'trained');
      proficiencies.set('medium_armor', 'trained');
      proficiencies.set('heavy_armor', 'trained');
      proficiencies.set('class_dc', 'trained');
    }
    
    // Add other classes...
    
    return proficiencies;
  }
}
```

### 6. Business Logic Functions Structure

```typescript
// Character creation functions (following existing pattern)
export async function startCharacterCreation(ctx: GalaChainContext, dto: StartCharacterCreationDto): Promise<CharacterCreationStateDto> {
  const identity = ctx.callingUser;
  
  // Create character entity
  const character = await createValidChainObject(PlayerCharacterEntity, {
    identity,
    name: dto.characterName
  });
  
  const entity = character.getCompositeKey();
  
  // Initialize attributes at +0
  const attributes = await createValidChainObject(AttributesComponent, {
    entity,
    strength: 10, // +0 modifier
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
    // All partial boosts false
    strengthPartialBoost: false,
    dexterityPartialBoost: false,
    constitutionPartialBoost: false,
    intelligencePartialBoost: false,
    wisdomPartialBoost: false,
    charismaPartialBoost: false
  });
  
  // Initialize creation state
  const creationState = await createValidChainObject(CharacterCreationState, {
    entity,
    currentStep: 2, // Step 1 (concept) is optional
    completedSteps: [2], // Attributes initialized
    isComplete: false,
    isValid: true,
    validationErrors: [],
    lastUpdated: ctx.txUnixTime
  });
  
  // Save all objects
  await Promise.all([
    putChainObject(ctx, character),
    putChainObject(ctx, attributes),
    putChainObject(ctx, creationState)
  ]);
  
  // Record creation event
  const event = await createValidChainObject(CharacterCreationEvent, {
    entity,
    timestamp: ctx.txUnixTime.toString().padStart(10, '0'),
    stepNumber: "02",
    stepType: "initialize_attributes",
    txId: ctx.stub.getTxID(),
    isValid: true
  });
  
  await putChainObject(ctx, event);
  
  return new CharacterCreationStateDto({
    character,
    creationState,
    attributes,
    validationErrors: []
  });
}

export async function selectAncestry(ctx: GalaChainContext, dto: SelectAncestryDto): Promise<CharacterCreationStateDto> {
  const identity = ctx.callingUser;
  const character = await getCharacterByName(ctx, identity, dto.characterName);
  const entity = character.getCompositeKey();
  
  // Validate current state
  const creationState = await getObjectByKey(ctx, CharacterCreationState,
    CharacterCreationState.getCompositeKeyFromParts(CharacterCreationState.INDEX_KEY, [entity]));
  
  if (creationState.currentStep < 3) {
    throw new ValidationFailedError("Must complete attribute initialization before selecting ancestry");
  }
  
  // Get ancestry data and validate
  const ancestryData = await getObjectByKey(ctx, AncestryData,
    AncestryData.getCompositeKeyFromParts(AncestryData.INDEX_KEY, [dto.ancestry]));
  
  const heritageData = await getObjectByKey(ctx, HeritageData,
    HeritageData.getCompositeKeyFromParts(HeritageData.INDEX_KEY, [dto.ancestry, dto.heritage]));
  
  // Apply ancestry modifications to attributes
  const attributes = await getObjectByKey(ctx, AttributesComponent,
    AttributesComponent.getCompositeKeyFromParts(AttributesComponent.INDEX_KEY, [entity]));
  
  // Apply boosts and flaws
  for (const boost of ancestryData.attributeBoosts) {
    attributes.boost(boost, boost.affects);
  }
  
  for (const flaw of ancestryData.attributeFlaws) {
    attributes.reduce(flaw, flaw.affects);
  }
  
  // Create ancestry component
  const ancestryComponent = await createValidChainObject(AncestryComponent, {
    entity,
    ancestry: dto.ancestry,
    heritage: dto.heritage
  });
  
  // Add traits
  const traitComponents = [];
  for (const traitName of ancestryData.traits) {
    const trait = await createValidChainObject(TraitComponent, {
      entity,
      name: traitName
    });
    traitComponents.push(trait);
  }
  
  // Add ancestry feat if selected
  if (dto.ancestryFeat) {
    const ancestryFeat = await createValidChainObject(CharacterFeat, {
      entity,
      featName: dto.ancestryFeat,
      featType: "ancestry",
      source: dto.ancestry,
      level: 1
    });
    await putChainObject(ctx, ancestryFeat);
  }
  
  // Update creation state
  if (!creationState.completedSteps.includes(3)) {
    creationState.completedSteps.push(3);
    creationState.completedSteps.sort();
  }
  creationState.lastUpdated = ctx.txUnixTime;
  
  // Validate character state
  const validation = await CharacterValidation.validateAttributeRange(attributes);
  creationState.validationErrors = validation.errors;
  creationState.isValid = validation.isValid;
  
  // Save all changes
  await Promise.all([
    putChainObject(ctx, attributes),
    putChainObject(ctx, ancestryComponent),
    putChainObject(ctx, creationState),
    ...traitComponents.map(trait => putChainObject(ctx, trait))
  ]);
  
  // Record creation event
  const event = await createValidChainObject(CharacterCreationEvent, {
    entity,
    timestamp: ctx.txUnixTime.toString().padStart(10, '0'),
    stepNumber: "03",
    stepType: "select_ancestry",
    txId: ctx.stub.getTxID(),
    isValid: validation.isValid,
    stepData: { ancestry: dto.ancestry, heritage: dto.heritage }
  });
  
  await putChainObject(ctx, event);
  
  return new CharacterCreationStateDto({
    character,
    creationState,
    attributes,
    ancestry: ancestryComponent,
    validationErrors: validation.errors
  });
}

// Similar functions for selectBackground, selectClass, etc.
```

## Development Iterations

### Phase 0: Prerequisites (Day 1-2)
**Goal:** Set up reference data CRUD system and core utilities

#### Tasks:
- [ ] Create all reference data ChainObjects (WeaponData, ArmorData, etc.)
- [ ] Create all reference data DTOs for CRUD operations
- [ ] Implement reference data CRUD business logic functions
- [ ] Implement GameCalculations utility class
- [ ] Implement CurrencyUtils class
- [ ] Add reference data CRUD contract methods
- [ ] Unit tests for all calculations and CRUD operations

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

## Query Patterns (ECS-Optimized)

### Essential Queries
1. **Get All Characters for Player**
   ```typescript
   getObjectsByPartialCompositeKey(ctx, PlayerCharacterEntity.INDEX_KEY, [playerAlias])
   ```

2. **Get Full Character (ECS Pattern)**
   ```typescript
   async function getCharacterSheet(ctx, entity: string): Promise<CharacterSheetDto> {
     // Parallel load all components
     const [attributes, ancestry, background, progression, state] = await Promise.all([
       getObjectByKey(ctx, AttributesComponent, 
         AttributesComponent.getCompositeKeyFromParts(AttributesComponent.INDEX_KEY, [entity])),
       getObjectByKey(ctx, AncestryComponent,
         AncestryComponent.getCompositeKeyFromParts(AncestryComponent.INDEX_KEY, [entity])),
       getObjectByKey(ctx, BackgroundComponent,
         BackgroundComponent.getCompositeKeyFromParts(BackgroundComponent.INDEX_KEY, [entity])),
       getObjectByKey(ctx, CharacterProgression,
         CharacterProgression.getCompositeKeyFromParts(CharacterProgression.INDEX_KEY, [entity])),
       getObjectByKey(ctx, CharacterState,
         CharacterState.getCompositeKeyFromParts(CharacterState.INDEX_KEY, [entity]))
     ]);
     
     // Load collections
     const [traits, skills, feats, equipment] = await Promise.all([
       getObjectsByPartialCompositeKey(ctx, TraitComponent.INDEX_KEY, [entity]),
       getObjectsByPartialCompositeKey(ctx, CharacterSkillTraining.INDEX_KEY, [entity]),
       getObjectsByPartialCompositeKey(ctx, CharacterAncestryFeat.INDEX_KEY, [entity]),
       getObjectsByPartialCompositeKey(ctx, CharacterEquipment.INDEX_KEY, [entity])
     ]);
     
     return new CharacterSheetDto({ ... });
   }
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

### Optimization
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

## Implementation Readiness Checklist

### Specifications
1. **All ChainObject Types Defined** - Complete type specifications with validation
2. **All DTO Types Defined** - Input and output DTOs with validation decorators
3. **Contract Method Signatures** - All @Submit and @Evaluate methods specified
4. **Validation Rules** - Comprehensive validation logic defined
5. **Business Logic Structure** - Function signatures and workflow defined
6. **Error Handling** - Error types and correction guidance specified
7. **Reference Data Integration** - JSON loading and caching strategy defined

### 🔧 Implementation Strategy
1. **Incremental Development** - Build and test each step sequentially
2. **Function-First Approach** - Implement business logic functions before contract methods
3. **Validation-First** - Implement validation before complex business logic
4. **Test-Driven** - Unit tests for each function before integration
5. **Reference Data First** - Load and validate reference data before character operations

### ⚠️ Critical Implementation Notes
1. **Deterministic Values** - Always use `ctx.txUnixTime` and `ctx.stub.getTxID()` for timestamps/IDs
3. **Error Recovery** - Proper rollback for partial failures is already handled by GalaChain SDK's GalaChainStubCache
5. **Concurrent Safety** - Handle multiple players creating characters simultaneously, avoid read/write conflicts with good key design

### 📁 File Structure for Implementation
```
src/rpg/
├── RpgContract.ts (Updated with all methods)
├── types/
│   ├── BackgroundComponent.ts (New)
│   ├── BackgroundData.ts (New)
│   ├── CreateAncestryDataDto.ts (New)
│   ├── CreateWeaponDataDto.ts (New)
│   ├── CreateArmorDataDto.ts (New)
│   ├── CreateSkillDataDto.ts (New)
│   ├── CreateFeatDataDto.ts (New)
│   ├── CreateSpellDataDto.ts (New)
│   ├── UpdateAncestryDataDto.ts (New)
│   ├── GetReferenceDataDto.ts (New)
│   ├── ListReferenceDataDto.ts (New)
│   ├── DeleteReferenceDataDto.ts (New)
│   ├── ClassComponent.ts (New)
│   ├── CharacterProgression.ts (New)
│   ├── CharacterState.ts (New)
│   ├── CharacterSkillProficiency.ts (New)
│   ├── CharacterFeat.ts (New)
│   ├── CharacterEquipment.ts (New)
│   ├── CharacterCreationState.ts (New)
│   ├── CharacterCreationEvent.ts (New)
│   ├── [DTOs for all new operations]
│   └── index.ts (Export all types)
├── characters/
│   ├── startCharacterCreation.ts (New)
│   ├── selectAncestry.ts (New)
│   ├── selectBackground.ts (New)
│   ├── selectClass.ts (New)
│   ├── applyFreeBoosts.ts (New)
│   ├── selectSkills.ts (New)
│   ├── purchaseEquipment.ts (New)
│   ├── finalizeCharacter.ts (New)
│   ├── getCharacterSheet.ts (New)
│   └── validation/ (New directory)
│       ├── CharacterValidation.ts
│       ├── AttributeValidation.ts
│       ├── SkillValidation.ts
│       └── EquipmentValidation.ts
├── reference/ (New directory)
│   ├── createAncestryData.ts
│   ├── createWeaponData.ts
│   ├── createArmorData.ts
│   ├── createSkillData.ts
│   ├── createFeatData.ts
│   ├── createSpellData.ts
│   ├── updateReferenceData.ts
│   ├── deleteReferenceData.ts
│   ├── getReferenceData.ts
│   ├── listReferenceData.ts
│   └── ReferenceDataUtils.ts
└── utils/ (New directory)
    ├── calculations.ts (HP, AC, saves, etc.)
    ├── proficiencyUtils.ts
    └── currencyUtils.ts
```

### 🎯 Development Priority Order
1. **Phase 0** - Reference data system and core utilities (2 days)
2. **Phase 1** - Foundation and validation engine (1 week)
3. **Phase 2** - Basic character creation workflow (1 week)
4. **Phase 3** - Skills and equipment systems (1 week)
5. **Phase 4** - Final calculations and validation (1 week)
6. **Phase 5** - Spellcasting system (1 week)
7. **Phase 6** - Advanced features and optimizations (1 week)

## Ready for Implementation

This plan provides a **complete, implementation-ready specification** including:

### ✨ Technical Completeness
1. **Every ChainObject Fully Specified** - All properties, decorators, validation
2. **Every DTO Fully Specified** - Input validation, type safety, response structures
3. **Every Contract Method Defined** - Signatures, decorators, business logic flow
4. **Comprehensive Validation Engine** - Rule-based validation with clear error messages
5. **Complete Business Logic Structure** - Function signatures and implementation strategy

### 🏗️ Architectural Soundness
1. **ECS Foundation** - Entities, Components, Systems properly separated
2. **Pragmatic Facts** - Individual facts where needed, practical grouping where sensible
3. **Performance Optimized** - Efficient queries, minimal state changes, parallel operations
4. **Deterministic Design** - All operations use blockchain-safe values
5. **Error Resilient** - Comprehensive validation and rollback strategies

### 🚀 Implementation Path
The plan provides:
- **Exact file structure** for organized development
- **Priority order** for incremental implementation
- **Function templates** showing implementation patterns
- **Validation examples** demonstrating rule enforcement
- **Complete contract interface** ready for implementation

**This plan is now ready for immediate implementation beginning with Phase 0 (Reference Data System).**

### Reference Data Management Strategy:
**Admin Workflow:**
1. **Local Preparation** - Admins use JSON files locally to construct DTOs
2. **DTO Creation** - Convert JSON to properly validated DTOs
3. **Chain Submission** - Post DTOs via contract methods to store on-chain
4. **Validation** - Full validation occurs during DTO processing
5. **Availability** - Reference data available to all peers via chain queries

**Example Admin Process:**
```bash
# Admin reads local JSON file
# Constructs CreateAncestryDataDto from JSON data
# Calls RpgContract.CreateAncestryData(dto)
# Data stored on-chain, available to all peers
```

**Benefits:**
- No file dependencies on peers
- Full DTO validation
- Audit trail of who added what data
- Update/delete capability
- Standard CRUD patterns

### Missing Systems Still To Be Specified:
1. **Spellcasting Details** - Spell slots, preparation, spontaneous casting
2. **Combat Mechanics** - Initiative, actions, reactions, damage
3. **Conditions System** - Status effects, durations, stacking
4. **Advancement System** - Level up process, feat selection at higher levels
5. **Multiclassing Rules** - Class dedication, archetype feats
6. **Item Crafting** - Creating items, formulas, downtime activities

---

---

**Status:** ✅ **IMPLEMENTATION-READY PLAN COMPLETE**  
**Next Action:** Begin Phase 1 - Reference Data & Validation Engine Implementation
**Confidence Level:** HIGH - All technical specifications complete, ready to code