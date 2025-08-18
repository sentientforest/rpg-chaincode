# Character Creation Design Specification
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/017-028_character_creation.txt  
**Status:** Phase 2 - Design Specification

## Executive Summary
This document specifies the design requirements for implementing a 10-step character creation system on the blockchain. The system supports flexible step ordering while maintaining validation integrity and rule compliance throughout the process.

## User Stories

### Epic: Character Creation Process
**As a player**, I want to create a new character through a guided 10-step process, **so that** I can build a mechanically sound and narratively interesting character for play.

#### Core User Stories

**UC-001: Start Character Creation**
- **As a player**, I want to begin character creation with a concept, **so that** I can build a character that fits my vision
- **Acceptance Criteria:**
  - System allows free-form concept entry
  - No mechanical restrictions at concept stage
  - Process can begin at any step (flexible ordering)

**UC-002: Initialize Attribute Modifiers**
- **As a player**, I want all attributes to start at +0, **so that** I can understand the baseline before applying modifications
- **Acceptance Criteria:**
  - All six attributes (Str, Dex, Con, Int, Wis, Cha) initialize to +0
  - System tracks all attribute modifications separately
  - Player can review modification sources

**UC-003: Select Ancestry**
- **As a player**, I want to choose my character's ancestry and heritage, **so that** I can define their species and cultural background
- **Acceptance Criteria:**
  - System presents available ancestries with attribute modifications
  - Heritage selection provides additional customization
  - Ancestry feat selection from available options
  - Automatic application of HP, size, speed, languages, and special abilities

**UC-004: Choose Background**
- **As a player**, I want to select a background representing my pre-adventuring life, **so that** I can add depth and mechanical benefits
- **Acceptance Criteria:**
  - Background provides 2 attribute boosts (1 limited choice, 1 free)
  - Grants skill training and specific Lore skill
  - Includes specific skill feat
  - System resolves skill training overlaps with class

**UC-005: Pick Class**
- **As a player**, I want to choose my character's class, **so that** I can determine their combat role and abilities
- **Acceptance Criteria:**
  - Class selection provides key attribute boost
  - System sets initial proficiencies automatically
  - Class features and abilities are granted
  - Additional class-specific choices are prompted (spells, orders, etc.)

**UC-006: Finalize Attributes**
- **As a player**, I want to apply 4 free attribute boosts, **so that** I can customize my character's strengths
- **Acceptance Criteria:**
  - System prevents applying multiple boosts to same attribute simultaneously
  - Validates final range (-1 to +4 at 1st level)
  - Handles partial boosts for attributes at +4
  - Shows final attribute modifiers clearly

**UC-007: Record Class Details**
- **As a player**, I want to see all my class-derived statistics calculated, **so that** I understand my character's capabilities
- **Acceptance Criteria:**
  - Total HP calculated (ancestry + class + Constitution)
  - All proficiencies recorded and calculated
  - Skill selection from trained options
  - Class features and abilities listed
  - Spell selection if applicable

**UC-008: Purchase Equipment**
- **As a player**, I want to buy starting equipment with 15 gp, **so that** I can equip my character for adventure
- **Acceptance Criteria:**
  - System enforces 15 gp starting wealth limit
  - Equipment purchase interface with costs
  - Automatic currency conversion (gp/sp/cp)
  - Remaining wealth calculation

**UC-009: Calculate Final Modifiers**
- **As a player**, I want all derived statistics calculated automatically, **so that** I have a complete character sheet
- **Acceptance Criteria:**
  - Perception = proficiency + Wisdom
  - Saving throws = proficiency + attribute
  - Strike modifiers = proficiency + attribute + item
  - Skill modifiers = proficiency + attribute

**UC-010: Complete Character**
- **As a player**, I want to finalize personal details and review my completed character, **so that** I can confirm everything is correct before play
- **Acceptance Criteria:**
  - Final validation of all character rules
  - Personal details entry (age, gender, deity, etc.)
  - Character sheet generation
  - Save character to blockchain

### Advanced User Stories

**UC-011: Flexible Step Ordering**
- **As a player**, I want to complete creation steps in any order, **so that** I can build my character according to my preference
- **Acceptance Criteria:**
  - System allows navigation between any steps
  - Validates dependencies before allowing certain actions
  - Shows completion status of each step
  - Warns about incomplete prerequisites

**UC-012: Validation and Error Handling**
- **As a player**, I want clear feedback on rule violations, **so that** I can create a valid character
- **Acceptance Criteria:**
  - Real-time validation during selection
  - Clear error messages with corrective guidance
  - Prevention of invalid states
  - Rollback capability for invalid choices

**UC-013: Character Modification**
- **As a player**, I want to modify previous choices during creation, **so that** I can experiment with different builds
- **Acceptance Criteria:**
  - Changes cascade through dependent calculations
  - System maintains valid state during modifications
  - Warns about impacts of changes
  - Preserves valid choices where possible

## System Requirements

### Functional Requirements

**FR-001: Character State Management**
- System must maintain character creation state across multiple transactions
- Support partial completion and resumption of creation process
- Preserve all intermediate choices and calculations

**FR-002: Rule Validation Engine**
- Implement all character creation validation rules
- Validate attribute ranges (-1 to +4 at level 1)
- Enforce boost application restrictions
- Validate skill training and overlap resolution

**FR-003: Calculation Engine**
- Automatically calculate all derived statistics
- Update calculations when dependencies change
- Support proficiency system calculations
- Handle currency conversions and bulk calculations

**FR-004: Data Integrity**
- Ensure character creation produces valid characters
- Maintain referential integrity for all selections
- Prevent orphaned or inconsistent data

### Non-Functional Requirements

**NFR-001: Performance**
- Character creation should complete within reasonable gas limits
- Support concurrent character creation by multiple users
- Efficient storage of character data on blockchain

**NFR-002: Usability**
- Intuitive step progression with clear guidance
- Helpful error messages and validation feedback
- Responsive interface for step navigation

**NFR-003: Extensibility**
- Design supports adding new ancestries, backgrounds, classes
- Modular validation rules for easy updates
- Plugin architecture for optional rules

## API Design

### Core Contracts

**CharacterCreationContract**
```typescript
@GalaContract()
export class CharacterCreationContract extends GalaContract {
  
  @Submit({ enforceUniqueKey: true })
  public async StartCharacterCreation(
    ctx: GalaChainContext, 
    dto: StartCharacterCreationDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async SelectAncestry(
    ctx: GalaChainContext, 
    dto: SelectAncestryDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async SelectBackground(
    ctx: GalaChainContext, 
    dto: SelectBackgroundDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async SelectClass(
    ctx: GalaChainContext, 
    dto: SelectClassDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async ApplyAttributeBoosts(
    ctx: GalaChainContext, 
    dto: ApplyAttributeBoostsDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async PurchaseEquipment(
    ctx: GalaChainContext, 
    dto: PurchaseEquipmentDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Submit({ enforceUniqueKey: true })
  public async FinalizeCharacter(
    ctx: GalaChainContext, 
    dto: FinalizeCharacterDto
  ): Promise<CreatedCharacterDto> {}
  
  @Evaluate()
  public async GetCharacterCreationState(
    ctx: GalaChainContext, 
    dto: GetCharacterCreationStateDto
  ): Promise<CharacterCreationStateDto> {}
  
  @Evaluate()
  public async ValidateCharacterCreation(
    ctx: GalaChainContext, 
    dto: ValidateCharacterCreationDto
  ): Promise<ValidationResultDto> {}
}
```

### Key Data Transfer Objects

**CharacterCreationStateDto**
```typescript
export class CharacterCreationStateDto extends ChainObject {
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public readonly creationId: string;
  
  @IsNotEmpty()
  public readonly playerId: string;
  
  @ValidateNested()
  public readonly currentStep: CreationStepDto;
  
  @ValidateNested()
  public readonly attributeModifiers: AttributeModifiersDto;
  
  @ValidateNested()
  @IsOptional()
  public readonly selectedAncestry?: AncestrySelectionDto;
  
  @ValidateNested()
  @IsOptional()
  public readonly selectedBackground?: BackgroundSelectionDto;
  
  @ValidateNested()
  @IsOptional()
  public readonly selectedClass?: ClassSelectionDto;
  
  @ValidateNested()
  public readonly completedSteps: CreationStepDto[];
  
  @ValidateNested()
  public readonly validationState: ValidationStateDto;
}
```

## Validation Rules

### Attribute Validation
- **ATTR-001**: No attribute below -1 at level 1
- **ATTR-002**: No attribute above +4 at level 1  
- **ATTR-003**: Cannot apply multiple boosts to same attribute simultaneously
- **ATTR-004**: Partial boosts properly tracked and applied
- **ATTR-005**: All 4 free boosts must be used and applied to different attributes

### Selection Validation
- **SEL-001**: Ancestry must be selected before heritage
- **SEL-002**: Heritage must be compatible with selected ancestry
- **SEL-003**: Ancestry feat must be available to selected ancestry/heritage
- **SEL-004**: Background skill training overlap resolved with class
- **SEL-005**: Class choices completed (spells, orders, etc.)

### Equipment Validation
- **EQ-001**: Starting wealth cannot exceed 15 gp
- **EQ-002**: All equipment purchases from valid item lists
- **EQ-003**: Bulk calculations accurate
- **EQ-004**: Currency conversions correct

### Final Validation
- **FIN-001**: All mandatory steps completed
- **FIN-002**: Character sheet calculations accurate
- **FIN-003**: No rule violations remain
- **FIN-004**: Character ready for play

## Implementation Architecture

### State Machine Design
Character creation follows a state machine pattern:

1. **INITIALIZED** → Step 1 (Concept)
2. **CONCEPT_SET** → Step 2 (Attributes)
3. **ATTRIBUTES_INITIALIZED** → Steps 3,4,5 (Ancestry/Background/Class)
4. **CORE_SELECTIONS_COMPLETE** → Step 6 (Finalize Attributes)
5. **ATTRIBUTES_FINALIZED** → Step 7 (Class Details)
6. **CLASS_DETAILS_COMPLETE** → Step 8 (Equipment)
7. **EQUIPMENT_PURCHASED** → Step 9 (Calculate Modifiers)
8. **MODIFIERS_CALCULATED** → Step 10 (Finalize)
9. **CHARACTER_COMPLETE** → Final validation and save

### Transaction Design
- Each major step is an atomic transaction
- Character state persisted after each successful step
- Rollback capability for validation failures
- Optimistic concurrency for state updates

### Data Storage Strategy
- Character creation state stored on-chain during process
- Reference data (ancestries, backgrounds, classes) stored off-chain
- Final character stored on-chain with minimal data
- Detailed character sheet generated on-demand

## Error Handling

### Validation Errors
- **VE-001**: Attribute boost application errors
- **VE-002**: Invalid selection combinations
- **VE-003**: Equipment purchase exceeds limits
- **VE-004**: Skill overlap resolution failures

### System Errors  
- **SE-001**: Concurrent modification conflicts
- **SE-002**: State corruption detection
- **SE-003**: Reference data unavailability
- **SE-004**: Transaction failures and rollback

## Testing Strategy

### Unit Tests
- Validation rule testing for all constraints
- Calculation engine accuracy tests
- State transition correctness
- Error handling and edge cases

### Integration Tests
- End-to-end character creation flows
- Multi-step transaction sequences
- Concurrent user scenarios
- Data consistency verification

### User Acceptance Tests
- Complete character creation scenarios
- Rule violation testing
- Performance under load
- User experience validation

## Future Enhancements

### Advanced Features
- Character templates and quick builds
- Import/export character data
- Character creation advisor/helper
- Rule customization for homebrew content

### Optimization Opportunities
- Batch operations for related choices
- Predictive validation during selection
- Cached calculation results
- Progressive character sheet updates

---

**Status:** ✅ Character creation design specification complete  
**Next:** Machine-readable data file creation