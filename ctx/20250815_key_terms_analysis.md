# Pathfinder Key Terms Analysis
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/010-011_key_terms.txt  
**Status:** Foundation Analysis - Phase 1

## Executive Summary
The Key Terms section establishes the fundamental vocabulary and concepts for the Pathfinder RPG system. These terms define the core mechanics that drive character creation, gameplay, and system interactions. Understanding these concepts is essential for implementing accurate rule validation in our blockchain RPG system.

## Core System Concepts

### Character Foundation Elements
1. **Class** - The character's profession/role, determines proficiencies, HP gain, and available feats
2. **Ancestry** - Character's species/heritage, affects starting HP, languages, senses, speed, and ancestry feats  
3. **Background** - Pre-adventuring life experience, grants skills and feat training

### Attribute & Progression System
- **Attribute Modifiers** - Six core stats (Strength, Dexterity, Constitution, Intelligence, Wisdom, Charisma)
- **Level** - Power measurement (1-20 for PCs, -1 to 30 for threats)
- **Proficiency** - Skill/ability ranking system with 5 ranks: untrained, trained, expert, master, legendary
- **Proficiency Bonus Calculation**: 
  - Untrained: +0
  - Trained: Level + 2
  - Expert: Level + 4  
  - Master: Level + 6
  - Legendary: Level + 8

### Combat & Action System
- **Armor Class (AC)** - Defense rating, serves as DC for attacks
- **Hit Points (HP)** - Damage capacity before unconsciousness
- **Actions** - 3 actions per turn during encounters
- **Initiative** - Turn order determination in combat
- **Speed** - Movement distance per action (in feet)

### Game Mechanics
- **Checks** - d20 + proficiency bonus for uncertain outcomes
- **Saving Throws** - Automatic defense rolls (Fortitude, Reflex, Will)
- **Bonuses/Penalties** - Modifiers with type restrictions (only highest bonus/worst penalty of each type applies)
- **Conditions** - Ongoing effects that modify character capabilities

### Content Classification System
- **Rarity** - Content availability (Common, Uncommon, Rare, Unique)
- **Traits** - Keywords providing additional rule interactions
- **Feats** - Character abilities from various sources (ancestry, background, class, general, skill)

### Game Resources
- **Currency System**:
  - 1 platinum piece (pp) = 10 gold pieces (gp)
  - 1 gp = 10 silver pieces (sp)  
  - 1 sp = 10 copper pieces (cp)
  - Starting wealth: 15 gp (150 sp)

### Magic System
- **Spells** - Magical effects requiring training/innate ability
- **Spell Ranks** - Power levels 1-10
- **Casting** - Usually requires 2 actions

## Key Implementation Considerations

### Blockchain Data Structure Implications
1. **Immutable Character Progression** - Level, proficiency, and attribute changes must be trackable
2. **Validation Rules** - Proficiency bonuses, rarity restrictions, and bonus stacking rules need enforcement
3. **State Management** - HP, conditions, and temporary effects require careful handling

### System Dependencies
- Character creation depends on: Ancestry → Background → Class → Skills/Feats
- Combat mechanics require: AC, HP, proficiency, saving throws
- Spell system integrates with: Class features, proficiency ranks, action economy

### Data Validation Requirements
- Proficiency rank progression rules
- Bonus/penalty type restrictions  
- Rarity access validation
- Currency conversion accuracy
- Action economy limits (3 per turn)

## Critical Design Patterns

### Proficiency System
```typescript
enum ProficiencyRank {
  UNTRAINED = 0,
  TRAINED = 2,
  EXPERT = 4,
  MASTER = 6,
  LEGENDARY = 8
}

function calculateProficiencyBonus(level: number, rank: ProficiencyRank): number {
  return rank === ProficiencyRank.UNTRAINED ? 0 : level + rank;
}
```

### Rarity System
```typescript
enum Rarity {
  COMMON,
  UNCOMMON,
  RARE,
  UNIQUE
}
```

### Currency System
```typescript
interface Currency {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
}
```

## Questions for Future Analysis
1. How do ancestry bonuses interact with class proficiencies?
2. What are the specific rules for feat selection and prerequisites?
3. How do conditions affect checks and combat mechanics?
4. What validation is needed for multiclass character builds?
5. How should spell slot management work on-chain vs off-chain?

## Next Phase Dependencies
The following files will build upon these foundational concepts:
- **Character Creation** - Will detail the step-by-step process using these terms
- **Ancestries & Backgrounds** - Will specify the actual options and their mechanical effects
- **Classes** - Will define how proficiencies and features are granted
- **Skills** - Will elaborate on the skill system and check mechanics

## Implementation Priority
**High Priority:** Proficiency system, basic attributes, level progression  
**Medium Priority:** Combat mechanics, currency system, rarity validation  
**Lower Priority:** Condition system, complex spell interactions

---

**Status:** ✅ Foundation analysis complete  
**Next:** Proceed to character creation process analysis