# Complete Class System Analysis
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/091_224_classes.txt  
**Status:** Phase 2 - Complete Class System Analysis

## Executive Summary
Comprehensive extraction of all 8 core classes, their progression systems, spellcasting mechanics, and advancement rules. This analysis provides the complete mechanical foundation for implementing character classes from 1st to 20th level in the RPG chaincode.

## Class System Overview

### Core Design Principles
- **Key Attributes**: Each class has one primary attribute that drives most abilities
- **Proficiency Progression**: Classes advance from Untrained → Trained → Expert → Master → Legendary
- **Level-Based Advancement**: Characters gain new abilities every level, major improvements at key levels
- **Class DC**: 10 + proficiency + key attribute modifier for class abilities
- **Customization**: Subclasses, class feats, and choices allow specialization within each class

### Universal Class Mechanics
- **Hit Points**: Varies by class (6-10 per level + Constitution modifier)
- **Attribute Boosts**: Key attribute boost at character creation
- **Class Feats**: Gained at even levels (2, 4, 6, 8, etc.)
- **Skill Increases**: Gained at odd levels (3, 5, 7, 9, etc.)
- **General Feats**: Gained at specific levels based on class
- **Ability Score Boosts**: Gained every 5 levels (5, 10, 15, 20)

## Complete Class Breakdown

### 1. BARD (Occult Spellcaster)
**Core Identity**: Charismatic performer who uses occult magic and bardic performances to inspire allies and confound enemies.

**Key Mechanics:**
- **Key Attribute**: Charisma
- **Hit Points**: 8 + Constitution modifier per level
- **Spell Tradition**: Occult (emotion, mental, prediction, social magic)
- **Spellcasting**: Spontaneous, up to 10th level spells
- **Special**: Composition spells, focus spells

**Initial Proficiencies:**
- Perception: Expert
- Fortitude: Trained, Reflex: Trained, Will: Expert
- Skills: Occultism + 4 others
- Weapons: Simple weapons, longsword, rapier, sap, shortbow, whip
- Armor: Light armor
- Class DC: Trained

**Key Class Features:**
- **1st**: Bardic spellcasting, composition spells, muse choice
- **2nd**: Bardic lore (become trained in all Lore skills)
- **3rd**: Lightning reflexes (Reflex saves to Expert)
- **5th**: Third muse (gain 1st level feature from different muse)
- **7th**: Expert spellcaster, resolve (Will saves to Master)
- **9th**: Great fortitude (Fortitude saves to Expert)
- **11th**: Bard weapon expertise, vigilant senses (Perception to Master)
- **13th**: Light armor expertise, weapon specialization
- **15th**: Master spellcaster
- **17th**: Greater resolve (Will saves to Legendary)
- **19th**: Legendary spellcaster, magnum opus

**Muse Options (Subclasses):**
1. **Enigma**: Focus on riddles and mysteries, gains Bardic Lore earlier
2. **Maestro**: Master of musical performance, composition focus
3. **Polymath**: Jack-of-all-trades with varied interests
4. **Warrior**: Combat-focused bard with martial training

### 2. CLERIC (Divine Spellcaster)
**Core Identity**: Divine champion who channels their deity's power to heal allies, harm enemies, and uphold their faith's tenets.

**Key Mechanics:**
- **Key Attribute**: Wisdom
- **Hit Points**: 8 + Constitution modifier per level
- **Spell Tradition**: Divine (healing, protection, alignment, elemental)
- **Spellcasting**: Prepared, up to 10th level spells
- **Special**: Channel energy, divine font, deity choice

**Initial Proficiencies:**
- Perception: Trained
- Fortitude: Expert, Reflex: Trained, Will: Expert
- Skills: Religion + 2 others (based on deity)
- Weapons: Simple weapons + deity's favored weapon
- Armor: Light armor, medium armor, shields
- Class DC: Trained

**Key Class Features:**
- **1st**: Divine spellcasting, divine font (heal or harm), deity choice
- **3rd**: Second doctrine (healing or harming focus)
- **5th**: Alertness (Perception to Expert)
- **7th**: Expert spellcaster, third doctrine
- **9th**: Resolve (Will saves to Master)
- **11th**: Divine defense (armor to Expert), weapon specialization
- **13th**: Weapon expertise (simple weapons to Expert)
- **15th**: Master spellcaster
- **17th**: Fourth doctrine, divine reflexes (Reflex to Expert)
- **19th**: Legendary spellcaster, miraculous spell

**Deity Choices**: Each provides different spells, favored weapons, and domains
**Divine Font**: Choose to be better at healing or harming undead

### 3. DRUID (Primal Spellcaster)
**Core Identity**: Guardian of nature who draws power from the natural world and can transform into animal forms.

**Key Mechanics:**
- **Key Attribute**: Wisdom
- **Hit Points**: 8 + Constitution modifier per level
- **Spell Tradition**: Primal (nature, weather, animals, plants)
- **Spellcasting**: Prepared, up to 10th level spells
- **Special**: Wild shape, druidic order, anathema restrictions

**Initial Proficiencies:**
- Perception: Trained
- Fortitude: Expert, Reflex: Trained, Will: Expert
- Skills: Nature + 2 others
- Weapons: Simple weapons, scimitars, sickles, shortbows, slings
- Armor: Light armor, medium armor (non-metal), shields (non-metal)
- Class DC: Trained

**Key Class Features:**
- **1st**: Druidic spellcasting, anathema, druidic language, shield block
- **2nd**: Druidic order (subclass choice)
- **3rd**: Alertness (Perception to Expert)
- **5th**: Lightning reflexes (Reflex to Expert)
- **7th**: Expert spellcaster
- **9th**: Resolve (Will saves to Master)
- **11th**: Druid weapon expertise, medium armor expertise
- **13th**: Weapon specialization
- **15th**: Master spellcaster
- **17th**: Legendary spellcaster
- **19th**: Primal hierophant

**Druidic Orders (Subclasses):**
1. **Animal**: Gain animal companion
2. **Leaf**: Extra prepared spells and leshy familiar
3. **Stone**: Focus on earth and stone magic
4. **Storm**: Weather and sky magic specialization
5. **Wild**: Emphasis on wild shape abilities

### 4. FIGHTER (Martial Expert)
**Core Identity**: Master of weapons and combat techniques with unparalleled martial prowess and tactical flexibility.

**Key Mechanics:**
- **Key Attribute**: Strength or Dexterity (player choice)
- **Hit Points**: 10 + Constitution modifier per level
- **Combat Focus**: Superior weapon proficiency and attack bonuses
- **Special**: Attack of Opportunity, weapon specialization, flexible tactics

**Initial Proficiencies:**
- Perception: Expert
- Fortitude: Expert, Reflex: Trained, Will: Trained
- Skills: Choose 3 + Intelligence modifier
- Weapons: All simple and martial weapons, advanced weapons in group
- Armor: All armor, shields
- Class DC: Trained

**Key Class Features:**
- **1st**: Attack of Opportunity, fighter weapon mastery, shield block
- **3rd**: Bravery (Will saves to Expert)
- **5th**: Fighter weapon mastery (critical specialization)
- **7th**: Battlefield surveyor (Perception to Master), weapon specialization
- **9th**: Combat flexibility, juggernaut (Fortitude to Master)
- **11th**: Armor expertise, fighter expertise (class DC to Expert)
- **13th**: Weapon legend (weapon groups to Legendary)
- **15th**: Evasion (Reflex to Master), greater weapon specialization
- **17th**: Armor mastery, improved flexibility
- **19th**: Versatile legend, weapon mastery (all weapons to Legendary)

**Fighter Tactics**: No formal subclasses, but massive customization through class feats

### 5. RANGER (Wilderness Warrior)
**Core Identity**: Skilled hunter and tracker who combines martial prowess with limited spellcasting and wilderness expertise.

**Key Mechanics:**
- **Key Attribute**: Strength or Dexterity (player choice)
- **Hit Points**: 10 + Constitution modifier per level
- **Spell Tradition**: Primal (limited, starts at 2nd level)
- **Spellcasting**: Prepared, up to 10th level spells (fewer slots than full casters)
- **Special**: Hunt prey, ranger's edge, tracking abilities

**Initial Proficiencies:**
- Perception: Expert
- Fortitude: Expert, Reflex: Expert, Will: Trained
- Skills: Nature, Survival + 3 others
- Weapons: All simple and martial weapons
- Armor: Light armor, medium armor, shields
- Class DC: Trained

**Key Class Features:**
- **1st**: Hunt prey, ranger's edge (hunter/precision)
- **2nd**: Ranger spellcasting, skill feats
- **3rd**: Iron will (Will saves to Expert)
- **5th**: Ranger weapon expertise, trackless step
- **7th**: Evasion (Reflex to Master), vigilant senses (Perception to Master)
- **9th**: Nature's edge, ranger expertise (class DC to Expert)
- **11th**: Juggernaut (Fortitude to Master), medium armor expertise
- **13th**: Weapon specialization
- **15th**: Improved evasion (Reflex to Legendary)
- **17th**: Masterful hunter
- **19th**: Second edge, legendary ranger

**Ranger's Edge (Choose One)**:
- **Hunter**: Bonuses against hunted prey
- **Precision**: Extra precision damage against hunted prey

### 6. ROGUE (Skill Expert)
**Core Identity**: Master of stealth, skills, and precision strikes who excels at finding weaknesses and exploiting opportunities.

**Key Mechanics:**
- **Key Attribute**: Dexterity (or other depending on racket)
- **Hit Points**: 8 + Constitution modifier per level
- **Skill Focus**: More trained skills than any other class
- **Special**: Sneak attack, rogue's racket, skill mastery

**Initial Proficiencies:**
- Perception: Expert
- Fortitude: Trained, Reflex: Expert, Will: Expert
- Skills: Stealth + 7 others (most of any class)
- Weapons: Simple weapons, rapier, sap, shortbow, shortsword
- Armor: Light armor
- Class DC: Trained

**Key Class Features:**
- **1st**: Rogue's racket, sneak attack 1d6, surprise attack
- **2nd**: Skill feats, skill increases
- **3rd**: Deny advantage, general feat
- **5th**: Sneak attack 2d6, weapon tricks
- **7th**: Evasion (Reflex to Master), vigilant senses (Perception to Master)
- **9th**: Debilitating strike, great fortitude (Fortitude to Expert)
- **11th**: Rogue expertise (class DC to Expert), sneak attack 3d6
- **13th**: Improved evasion (Reflex to Legendary), incredible senses
- **15th**: Greater debilitation, master strike, sneak attack 4d6
- **17th**: Slippery mind (Will to Master)
- **19th**: Light armor mastery, master strike, sneak attack 5d6

**Rogue's Racket (Subclasses):**
1. **Eldritch Trickster**: Minor spellcasting abilities
2. **Mastermind**: Social manipulation and mental skills
3. **Ruffian**: Strength-based combat with medium armor
4. **Scoundrel**: Classic agile combatant
5. **Thief**: Expert at stealing and disabling devices

### 7. WITCH (Occult/Other Spellcaster)
**Core Identity**: Spellcaster who gains power through a pact with an otherworldly patron, using hexes and familiar magic.

**Key Mechanics:**
- **Key Attribute**: Intelligence
- **Hit Points**: 6 + Constitution modifier per level
- **Spell Tradition**: Varies by patron (Arcane, Divine, Occult, or Primal)
- **Spellcasting**: Prepared, up to 10th level spells
- **Special**: Familiar, hex cantrips, patron relationship

**Initial Proficiencies:**
- Perception: Trained
- Fortitude: Trained, Reflex: Trained, Will: Expert
- Skills: Based on patron + 3 others
- Weapons: Simple weapons
- Armor: Unarmored
- Class DC: Trained

**Key Class Features:**
- **1st**: Witch spellcasting, familiar, hex cantrips, patron
- **3rd**: Basic lesson (learn hex from different patron)
- **5th**: Lightning reflexes (Reflex to Expert)
- **7th**: Expert spellcaster
- **9th**: Magical fortitude (Fortitude to Expert)
- **11th**: Alertness (Perception to Expert), weapon expertise
- **13th**: Defensive robes, weapon specialization
- **15th**: Master spellcaster
- **17th**: Resolve (Will to Master)
- **19th**: Legendary spellcaster, patron's gift

**Patron Types:**
- **Fey**: Trickery and illusion (Primal tradition)
- **Hag**: Curses and transformation (Occult tradition)  
- **Rune**: Knowledge and symbols (Arcane tradition)
- **Winter**: Cold and death (Arcane tradition)
- And others, each providing different spell traditions and hex cantrips

### 8. WIZARD (Arcane Spellcaster)
**Core Identity**: Scholarly master of arcane magic who prepares spells through study and research, specializing in magical schools.

**Key Mechanics:**
- **Key Attribute**: Intelligence
- **Hit Points**: 6 + Constitution modifier per level
- **Spell Tradition**: Arcane (fundamental forces, transmutation, illusion)
- **Spellcasting**: Prepared, up to 10th level spells (most spell slots)
- **Special**: Arcane school, thesis, spellbook, arcane bond

**Initial Proficiencies:**
- Perception: Trained
- Fortitude: Trained, Reflex: Trained, Will: Expert
- Skills: Arcana + 2 others + Intelligence modifier
- Weapons: Club, crossbow, dagger, javelin, staff
- Armor: Unarmored
- Class DC: Trained

**Key Class Features:**
- **1st**: Arcane spellcasting, arcane school, arcane bond, arcane thesis
- **3rd**: Cantrip expansion
- **5th**: Lightning reflexes (Reflex to Expert)
- **7th**: Expert spellcaster
- **9th**: Magical fortitude (Fortitude to Expert)
- **11th**: Alertness (Perception to Expert), wizard weapon expertise
- **13th**: Weapon specialization, defensive robes
- **15th**: Master spellcaster
- **17th**: Resolve (Will to Master)
- **19th**: Archwizard's might, legendary spellcaster

**Arcane Schools**: Specialization in one of eight schools of magic:
- Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, Transmutation

**Arcane Thesis (Choose One)**:
- **Improved Familiar**: Enhanced familiar abilities
- **Metamagical Experimentation**: Modify spells with metamagic
- **Spell Blending**: Flexible spell preparation
- **Spell Substitution**: Change prepared spells during the day

## Spellcasting System

### Spell Traditions
1. **Arcane**: Wizards, fundamental magic, raw magical forces
2. **Divine**: Clerics, deity-granted power, alignment magic
3. **Occult**: Bards, mental magic, emotions, mysteries  
4. **Primal**: Druids/Rangers, nature magic, elemental forces

### Spellcasting Types
- **Prepared**: Choose specific spells each day (Cleric, Druid, Ranger, Witch, Wizard)
- **Spontaneous**: Know limited spells, cast any known spell (Bard)

### Spell Slots by Level
Full casters gain spell slots per day based on level:
- 1st level: 2 cantrips, 1 first-level spell
- 20th level: 5 cantrips, 4 spells each of levels 1-10

Half casters (Ranger) get fewer slots and start spellcasting at 2nd level.

## Implementation Data Structure

### Class Definition Schema
```typescript
interface Class {
  id: string;
  name: string;
  description: string;
  keyAttribute: string[];  // Some classes allow choice
  hitPointsPerLevel: number;
  
  initialProficiencies: {
    perception: ProficiencyRank;
    fortitude: ProficiencyRank;
    reflex: ProficiencyRank;
    will: ProficiencyRank;
    classDC: ProficiencyRank;
    skills: SkillProficiencies;
    weapons: WeaponProficiencies;
    armor: ArmorProficiencies;
  };
  
  spellcasting?: {
    tradition: SpellTradition;
    type: "prepared" | "spontaneous";
    maxSpellLevel: number;
    slotsPerLevel: SpellSlotProgression;
  };
  
  classFeatures: ClassFeature[];
  advancement: LevelAdvancement[];
  subclasses?: Subclass[];
  classFeats: ClassFeat[];
}
```

### Advancement Table Structure
Each class has a 20-level advancement table showing:
- Level, proficiency bonus, class features gained
- Spell slots for spellcasters
- Skill increases, general feats, ability boosts

### Validation Requirements
1. **Class Selection**: Must choose valid class with key attribute
2. **Subclass Selection**: Must choose subclass options where required
3. **Spell Preparation**: Must follow spellcasting rules for class
4. **Proficiency Progression**: Automatic advancement per class table
5. **Class DC**: Always uses key attribute + proficiency

---

**Status:** ✅ Complete class system analyzed and documented  
**Next:** Create machine-readable class data files and begin skills analysis