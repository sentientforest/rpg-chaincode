# Complete Feats System Analysis
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/249-265_feats.txt  
**Status:** Phase 2 - Complete Feats System Analysis

## Executive Summary
Comprehensive extraction of the complete feats system including general feats, skill feats, prerequisite validation, and progression mechanics. This analysis provides the foundation for implementing character customization through feat selection and advancement in the RPG chaincode.

## Feat System Architecture

### Core Concepts
- **General Feats**: Abilities available to all characters, gained at specific levels
- **Skill Feats**: Subcategory of general feats that enhance skill usage
- **Universal Applicability**: Most feats available regardless of ancestry or class
- **Prerequisite System**: Structured requirements for feat access
- **Scalable Benefits**: Many feats improve with higher proficiency ranks

### Feat Progression Schedule
- **General Feats**: 3rd, 7th, 11th, 15th, 19th levels
- **Skill Feats**: 2nd, 4th, 6th, 8th, 10th, 12th, 14th, 16th, 18th, 20th levels
- **Special Rule**: When gaining skill feats, must select general feats with the skill trait

### Feat Categories

#### 1. Non-Skill General Feats (17 total)
Provide general character improvements not tied to specific skills.

**Level 1 Feats (13 total)**:
- **Adopted Ancestry**: Access to ancestry feats from different ancestry
- **Armor Proficiency**: Become trained in armor types
- **Breath Control**: Hold breath 25x longer, +1 vs inhaled threats
- **Canny Acumen**: Become expert in saves or Perception
- **Diehard**: Die at dying 5 instead of dying 4
- **Fast Recovery**: Regain 2x HP from rest, better affliction recovery
- **Feather Step**: Step into difficult terrain
- **Fleet**: +5 feet Speed
- **Incredible Initiative**: +2 circumstance to initiative
- **Pet**: Gain loyal animal minion
- **Ride**: Automatically command mounts
- **Shield Block**: Use shields to reduce damage
- **Toughness**: Increase max HP by level

**Higher Level Feats**:
- **Ancestral Paragon** (3rd): Gain 1st-level ancestry feat
- **Prescient Planner** (3rd): Procure gear retroactively
- **Untrained Improvisation** (3rd): Better untrained skill proficiency
- **Incredible Investiture** (11th): Invest 12 items instead of 10

#### 2. Universal Skill Feats (11 total)
Work with multiple skills or all skills with certain traits.

**Level 1 Universal Feats**:
- **Assurance**: Take 10 + proficiency instead of rolling
- **Dubious Knowledge**: Learn true and false info on failed Recall Knowledge
- **Quick Identification**: Identify Magic in 1 minute or less
- **Recognize Spell**: Identify spells as reactions
- **Skill Training**: Become trained in new skill
- **Trick Magic Item**: Activate items from other traditions

**Higher Level Universal Feats**:
- **Automatic Knowledge** (2nd): Recall Knowledge as free action
- **Magical Shorthand** (2nd): Learn spells faster and cheaper
- **Break Curse** (7th): Use knowledge skills to break curses
- **Quick Recognition** (7th): Identify spells as free action

#### 3. Skill-Specific Feats (60+ total)
Enhance specific skill usage with specialized abilities.

## Complete Skill Feat Breakdown

### Acrobatics Feats (5 total)
Focus on movement, balance, and aerial maneuvers.

| Feat | Level | Prerequisites | Benefits |
|------|-------|---------------|----------|
| **Cat Fall** | 1 | Trained | Treat falls as 10+ feet shorter (scales with rank) |
| **Quick Squeeze** | 1 | Trained | Squeeze 5 feet per round (10 on crit) |
| **Steady Balance** | 1 | Trained | Success on Balance becomes critical success |
| **Nimble Crawl** | 2 | Expert | Crawl at half Speed (full at master) |
| **Kip Up** | 7 | Master | Stand without triggering reactions |

### Athletics Feats (10 total)
Enhance physical activities and combat maneuvers.

**Level 1 Athletics Feats**:
- **Combat Climber**: Not off-guard while climbing, climb with hand occupied
- **Hefty Hauler**: +2 to Bulk limits
- **Quick Jump**: High/Long Jump as single action
- **Titan Wrestler**: Grapple/Shove creatures up to 2 sizes larger
- **Underwater Marauder**: Fight effectively underwater

**Higher Level Athletics Feats**:
- **Powerful Leap** (2nd): Jump 5 feet up without check, +5 feet horizontal
- **Rapid Mantel** (2nd): Quickly pull yourself onto ledges
- **Quick Climb/Swim** (7th): Move 5-10 feet further per check
- **Wall Jump** (7th): Jump off walls to maintain momentum
- **Cloud Jump** (15th): Triple Long Jump distance

### Crafting Feats (9 total)
Enable creation of items and magical crafting.

**Level 1 Crafting Feats**:
- **Alchemical Crafting**: Craft alchemical items
- **Quick Repair**: Repair items in 3 actions (1 action at higher ranks)
- **Snare Crafting**: Craft snares for traps
- **Specialty Crafting**: +1 to craft specific item types

**Advanced Crafting Feats**:
- **Magical Crafting** (2nd): Craft magic items
- **Inventor** (2nd): Create item formulas during downtime
- **Impeccable Crafting** (7th): Success becomes critical success for specialty
- **Craft Anything** (15th): Ignore most crafting requirements

### Deception Feats (6 total)
Improve lies, disguises, and misdirection.

| Feat | Level | Prerequisites | Benefits |
|------|-------|---------------|----------|
| **Charming Liar** | 1 | Trained | Improve attitude with successful lies |
| **Lengthy Diversion** | 1 | Trained | Remain hidden longer after Create Diversion |
| **Lie to Me** | 1 | Trained | Use Deception to detect lies |
| **Confabulator** | 2 | Expert | Reduce penalties for repeated lies |
| **Quick Disguise** | 2 | Expert | Set up disguise in 1/10th time |
| **Slippery Secrets** | 7 | Master | Evade mind-reading and detection magic |

### Diplomacy Feats (7 total)
Enhance social interaction and relationship building.

**Level 1 Diplomacy Feats**:
- **Bargain Hunter**: Earn Income searching for deals
- **Group Impression**: Make Impression on up to 10 targets
- **Hobnobber**: Gather Information in half time
- **No Cause for Alarm**: Reduce frightened condition in area

**Advanced Diplomacy Feats**:
- **Glad-Hand** (2nd): Make Impression immediately upon meeting
- **Shameless Request** (7th): Reduce penalties for outrageous requests
- **Legendary Negotiation** (15th): Quickly parley with foes in combat

### Intimidation Feats (8 total)
Focus on fear, coercion, and psychological warfare.

**Level 1 Intimidation Feats**:
- **Group Coercion**: Coerce up to 5 targets simultaneously
- **Intimidating Glare**: Demoralize without speaking
- **Quick Coercion**: Coerce in 1 round instead of 1 minute

**Advanced Intimidation Feats**:
- **Intimidating Prowess** (2nd): Bonus to physical intimidation
- **Lasting Coercion** (2nd): Coercion lasts up to a week
- **Battle Cry** (7th): Demoralize when rolling initiative
- **Terrified Retreat** (7th): Frightened targets flee on critical success
- **Scare to Death** (15th): Potentially kill targets with fear

### Medicine Feats (7 total)
Improve healing, disease treatment, and medical knowledge.

**Core Medicine Feats**:
- **Battle Medicine** (1st): Heal in combat without immunity
- **Continual Recovery** (2nd): Reduce Treat Wounds immunity to 10 minutes
- **Robust Recovery** (2nd): Better benefits from Treat Disease/Poison
- **Ward Medic** (2nd): Treat multiple patients simultaneously
- **Advanced First Aid** (7th): Reduce conditions with Medicine
- **Legendary Medic** (15th): Remove diseases and major conditions

### Performance Feats (4 total)
Enhance artistic expression and crowd interaction.

| Feat | Level | Prerequisites | Benefits |
|------|-------|---------------|----------|
| **Fascinating Performance** | 1 | Trained | Fascinate observers with performance |
| **Impressive Performance** | 1 | Trained | Make Impression with Performance |
| **Virtuosic Performer** | 1 | Trained | +1 with specific performance type |
| **Legendary Performer** | 15 | Legendary + Virtuosic | Gain renown, attract high-level audiences |

### Society Feats (7 total)
Improve cultural knowledge and social navigation.

**Level 1 Society Feats**:
- **Courtly Graces**: Appear noble, +1 to noble interactions
- **Multilingual**: Learn 2+ new languages (scales with rank)
- **Read Lips**: Read lips of visible creatures
- **Sign Language**: Learn sign languages
- **Streetwise**: Use Society for Gather Information

**Advanced Society Feats**:
- **Legendary Codebreaker** (15th): Decipher Writing at reading speed
- **Legendary Linguist** (15th): Create pidgin languages

### Stealth Feats (6 total)
Enhance hiding, sneaking, and concealment.

| Feat | Level | Prerequisites | Benefits |
|------|-------|---------------|----------|
| **Experienced Smuggler** | 1 | Trained | Better at concealing small items |
| **Terrain Stalker** | 1 | Trained | Sneak without checks in specific terrain |
| **Quiet Allies** | 2 | Expert | Single Stealth check when sneaking with allies |
| **Foil Senses** | 7 | Master | Always take precautions vs special senses |
| **Swift Sneak** | 7 | Master | Move full Speed while Sneaking |
| **Legendary Sneak** | 15 | Legendary + Swift | Hide/Sneak without cover |

### Survival Feats (7 total)
Improve wilderness navigation and creature tracking.

**Level 1 Survival Feats**:
- **Experienced Tracker**: Track at full Speed with -5 penalty
- **Forager**: Provide food for yourself + 4 others
- **Survey Wildlife**: Identify nearby creatures from signs
- **Terrain Expertise**: +1 in specific terrain type

**Advanced Survival Feats**:
- **Monster Crafting** (7th): Use monster parts for crafting
- **Planar Survival** (7th): Subsist on different planes
- **Legendary Survivalist** (15th): Survive without food/water

### Thievery Feats (5 total)
Enhance stealing, lock picking, and trap disarmament.

| Feat | Level | Prerequisites | Benefits |
|------|-------|---------------|----------|
| **Pickpocket** | 1 | Trained | Steal closely guarded objects without penalty |
| **Subtle Theft** | 1 | Trained | Thefts are harder to notice |
| **Wary Disarmament** | 2 | Expert | +2 AC/saves vs traps while disarming |
| **Quick Unlock** | 7 | Master | Pick locks with 1 action instead of 2 |
| **Legendary Thief** | 15 | Legendary + Pickpocket | Steal wielded/prominent items |

## Special Feat Mechanics

### Multiple Selection Rules
Many feats can be taken multiple times with different applications:

- **Assurance**: Choose different skill each time
- **Additional Lore**: Choose different Lore subcategory  
- **Armor Proficiency**: Progress through armor types
- **Terrain Expertise/Stalker**: Choose different terrain types
- **Weapon Proficiency**: Gain training in additional weapons
- **Multilingual**: Learn additional languages

### Scaling Benefits
Many feats improve automatically with higher proficiency:

- **Cat Fall**: 10/25/50 feet reduction at Trained/Expert/Master+
- **Assurance**: Higher guaranteed results with increased proficiency
- **Group Feats**: Affect more targets at higher ranks
- **Speed Improvements**: Many feats become faster at higher proficiency

### Prerequisite Validation System

#### Proficiency Requirements
- **Trained**: Available at 1st level
- **Expert**: Minimum 2nd level (when Expert first available)
- **Master**: Minimum 7th level
- **Legendary**: Minimum 15th level

#### Attribute Requirements
- Must meet minimum attribute scores (e.g., Constitution +2, Strength +3)
- Calculated after all character creation boosts applied

#### Feat Chain Requirements
- Some feats require other feats (e.g., Quick Recognition requires Recognize Spell)
- Must validate entire prerequisite chain

#### Level Gates
- Feat level determines minimum character level
- Cannot take higher-level feats before reaching appropriate level

## Implementation Considerations

### Data Structure Requirements
```typescript
interface Feat {
  id: string;
  name: string;
  level: number;
  traits: string[];
  
  prerequisites: {
    skills?: { skill: string; rank: ProficiencyRank }[];
    attributes?: { attribute: string; value: number }[];
    feats?: string[];
    other?: string;
  };
  
  benefits: string;
  special?: string;
  scaling?: ScalingBenefit[];
  multipleSelection?: {
    allowed: boolean;
    restrictions?: string[];
  };
}
```

### Validation Requirements
1. **Level Restrictions**: Cannot exceed character level
2. **Prerequisite Chains**: All prerequisites must be met
3. **Skill Feat Rules**: Must have skill trait when gaining skill feats
4. **Multiple Selection**: Track which options chosen for repeatable feats
5. **Proficiency Gates**: Validate minimum skill ranks

### Character Integration
- **Feat Progression**: Track which feats gained at which levels
- **Prerequisites**: Continuous validation as character changes
- **Benefits Application**: Automatic application of feat benefits
- **Skill Integration**: Feats modify skill actions and DCs
- **Combat Integration**: Feats affect action economy and capabilities

---

**Status:** ✅ Complete feats system analyzed and documented  
**Next:** Create machine-readable feats data files and begin equipment analysis