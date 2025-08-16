# Character Creation Process Analysis
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/017-028_character_creation.txt  
**Status:** Phase 2 - Character Creation Process

## Executive Summary
The character creation text outlines a 10-step process for building a new character. The process is designed to be flexible (steps can be completed in any order) but provides a suggested sequence that builds logically from concept to mechanics. Attribute modifiers are central to the system, starting at +0 and being modified through ancestry, background, class, and free boosts.

## Character Creation Process Flow

### Step 1: Create a Concept
- Define character personality, background, motivation
- Consider how character fits with party
- Browse available ancestries, backgrounds, and classes
- No mechanical decisions yet

### Step 2: Start Building Attribute Modifiers
- Initialize all six attributes at +0
- Understand attribute boost/flaw mechanics
- Identify priority attributes for concept

### Step 3: Select an Ancestry
- Choose ancestry (species/heritage)
- Select heritage (sub-type within ancestry)
- Apply attribute boosts and flaws
- Choose ancestry feat
- Record HP, Size, Speed, Languages, special abilities

### Step 4: Pick a Background
- Represents pre-adventuring life
- Provides 2 attribute boosts (1 limited choice, 1 free)
- Grants skill training and Lore skill
- Provides specific skill feat

### Step 5: Choose a Class
- Determines combat effectiveness and abilities
- Provides attribute boost to key attribute
- Sets initial proficiencies
- Grants class features

### Step 6: Finish Attribute Modifiers
- Apply all accumulated boosts/flaws
- Add 4 free attribute boosts (to different attributes)
- Final range: -1 to +4 at 1st level

### Step 7: Record Class Details
- Calculate total HP (ancestry + class + Constitution)
- Record all proficiencies
- Select trained skills
- Note class features and abilities
- Choose spells (if applicable)

### Step 8: Buy Equipment
- Starting wealth: 15 gp (150 sp)
- Purchase weapons, armor, gear
- Calculate remaining currency

### Step 9: Calculate Modifiers
- Perception = proficiency + Wisdom
- Saving throws = proficiency + attribute
- Strike modifiers = proficiency + attribute + item
- Skill modifiers = proficiency + attribute

### Step 10: Finishing Details
- Armor Class = 10 + Dex (capped) + proficiency + armor
- Class DC = 10 + proficiency + key attribute
- Bulk limits (5 + Str = encumbered, 10 + Str = max)
- Personal details (age, gender, deity, edicts/anathema)

## Attribute Modifier System

### Starting Point
- All attributes begin at +0 (human average)
- Modified through character creation choices

### Attribute Boosts
- Normal boost: +1 to modifier
- If already +4: mark "partial boost" instead
- Two partial boosts = +1 modifier
- Max +4 at 1st level
- Cannot stack multiple boosts at same time

### Attribute Flaws
- Decrease modifier by -1
- Less common than boosts
- Usually from ancestry

### Sources of Attribute Modifications
1. **Ancestry**: Specific boosts, sometimes flaws
2. **Background**: 2 boosts (1 limited, 1 free)
3. **Class**: 1 boost to key attribute
4. **Free Boosts**: 4 boosts to any attributes

### Optional Rules
- **Alternate Ancestry Boosts**: Replace ancestry boosts/flaws with 2 free boosts
- **Voluntary Flaws**: Take additional flaws for roleplay purposes

## Proficiency System Integration

### Proficiency Calculation
- Untrained: +0
- Trained: Level + 2 (typically +3 at 1st level)
- Expert: Level + 4 (typically +5 at 1st level)
- Master: Level + 6
- Legendary: Level + 8

### Initial Proficiencies
Set by class, including:
- Perception
- Saving throws (Fortitude, Reflex, Will)
- Skills
- Weapons
- Armor
- Class DC
- Spell attacks/DC (if applicable)

## Key Mechanical Calculations

### Hit Points
```
Total HP = Ancestry HP + Class HP + Constitution modifier
```

### Armor Class
```
AC = 10 + Dexterity (up to armor cap) + proficiency + armor bonus
```

### Saving Throws
```
Fortitude = proficiency + Constitution
Reflex = proficiency + Dexterity
Will = proficiency + Wisdom
```

### Strike Modifiers
```
Melee = proficiency + Strength + item bonus
Ranged = proficiency + Dexterity + item bonus
```

### Skill Modifiers
```
Skill = proficiency + attribute + other bonuses
```

### Class DC
```
Class DC = 10 + proficiency + key attribute
```

## Character Sheet Mapping
The text references specific locations on a 4-page character sheet:
- **Page 1**: Core statistics, attributes, skills, combat
- **Page 2**: Feats, abilities, inventory
- **Page 3**: Personal details, notes
- **Page 4**: Spells (if applicable)

## Implementation Considerations

### Data Dependencies
1. Ancestry must be selected before heritage and ancestry feat
2. Background provides skill training that may overlap with class
3. Class key attribute affects attribute boost allocation
4. All attribute modifications must be applied before calculating derived stats

### Validation Requirements
- No attribute below -1 or above +4 at level 1
- Attribute boosts must go to different attributes when applied simultaneously
- Cannot apply multiple flaws to same attribute
- Skill training overlaps must be resolved
- Starting wealth spending cannot exceed 15 gp

### State Management
- Character creation is essentially a state machine
- Each step modifies character state
- Some steps can be revisited/reordered
- Final validation required before play

## Complex Decision Points

### Ancestry Selection
- Choose from 8 core ancestries + versatile heritages
- Each has different attribute modifications
- Heritage provides additional customization
- Ancestry feat represents early training

### Background Selection
- Provides narrative and mechanical benefits
- Skill overlap with class must be resolved
- Lore skill is setting-specific

### Class Selection
- Determines primary role and capabilities
- Key attribute crucial for effectiveness
- May require additional choices (spells, order, etc.)

### Attribute Allocation
- Strategic distribution of 4 free boosts
- Balance between primary and secondary needs
- Consider save defenses and skills

## Sample Character Creation
The text includes "Gar the Dwarf Druid" as a complete example:
- Dwarf ancestry (+Con, +Wis, -Cha, +Dex free)
- Rock dwarf heritage with Rock Runner feat
- Nomad background (+Wis, +Con)
- Druid class (+Wis key)
- Final attributes: Str +1, Dex +2, Con +3, Int +0, Wis +4, Cha -1
- 21 HP, trained in multiple skills, untamed order

## Questions Resolved
1. **Order of steps**: Suggested but flexible
2. **Attribute progression**: Clear boost/flaw mechanics
3. **Mandatory choices**: All core elements required
4. **Validation points**: After attribute allocation and final calculations
5. **Starting equipment**: 15 gp standard
6. **Modification flexibility**: Sheet designed for changes

## Next Phase Dependencies
- **Ancestries & Backgrounds**: Detailed options and mechanics
- **Classes**: Full feature descriptions and progressions
- **Skills**: Complete skill list and uses
- **Equipment**: Item costs and properties
- **Spells**: Spell lists and casting rules

---

**Status:** ✅ Character creation process fully analyzed  
**Next:** Design specification and machine-readable data extraction