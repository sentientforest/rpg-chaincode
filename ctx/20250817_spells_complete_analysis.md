# Complete Spells System Analysis

This document provides a comprehensive analysis of the RPG spells system extracted from the core rules, designed for implementation as blockchain smart contract data structures.

## Table of Contents

1. [Spellcasting Framework Analysis](#spellcasting-framework-analysis)
2. [Spell Data Structure Analysis](#spell-data-structure-analysis)
3. [Implementation Requirements](#implementation-requirements)
4. [Data Structure Specifications](#data-structure-specifications)

---

## Spellcasting Framework Analysis

### 1. Magic Traditions

The spellcasting system is built around four fundamental magical traditions, each with distinct characteristics and philosophical approaches:

#### Arcane Tradition
- **Philosophy**: Logic and rationality to categorize magic inherent in the world
- **Scope**: Broadest spell list available
- **Limitations**: Generally poor at affecting spirit or soul
- **Primary Classes**: Wizards
- **Characteristics**: Academic approach, ordered spell signatures
- **Essence Affinity**: Strong with Matter (physical essence) and Mind (thought/mental essence)

#### Divine Tradition  
- **Philosophy**: Faith, belief, and connection to power from beyond the Universe
- **Scope**: Focused on divine power and belief-based magic
- **Primary Classes**: Clerics
- **Characteristics**: Faith-based, deity-inspired spell signatures
- **Essence Affinity**: Strong with Spirit (soul essence) and Life (vital essence)

#### Occult Tradition
- **Philosophy**: Understanding the unexplainable and categorizing the bizarre
- **Scope**: Esoteric and mind-affecting magic
- **Primary Classes**: Bards
- **Characteristics**: Performance-based, influences mind and elevates soul
- **Essence Affinity**: Strong with Mind (mental essence) and Spirit (soul essence)

#### Primal Tradition
- **Philosophy**: Instinctual connection to nature and natural cycles
- **Scope**: Nature-based magic, seasonal and elemental focus
- **Primary Classes**: Druids  
- **Characteristics**: Organic spell signatures, nature-connected
- **Essence Affinity**: Strong with Life (vital essence) and Matter (physical essence)

### 2. Spell Components and Actions

#### Action Types for Spellcasting
- **[one-action]**: Single action spells, often simple effects
- **[two-actions]**: Most common casting time for standard spells
- **[three-actions]**: Complex spells requiring full round attention
- **[reaction]**: Immediate response spells triggered by specific conditions
- **Cast X minutes**: Ritual-like spells requiring extended casting time

#### Component Types (Represented as Traits)
- **CONCENTRATE**: Mental focus and attention required
- **MANIPULATE**: Somatic components - precise hand movements and gestures
- **VERBAL**: Spoken components - incantations and verbal formulations (implicit in most spells)
- **MATERIAL**: Physical components - reagents, focuses, and costs
- **FOCUS**: Special focus items required for certain spells

### 3. Spell Schools (Represented as Traits)

The system uses trait-based classification rather than traditional schools:

#### Combat and Destruction
- **ATTACK**: Direct offensive spells requiring attack rolls
- **FIRE**: Heat and flame-based effects
- **COLD**: Ice and freezing effects  
- **ELECTRICITY**: Lightning and electrical effects
- **ACID**: Corrosive and dissolving effects
- **SONIC**: Sound-based effects
- **FORCE**: Pure magical energy effects

#### Control and Manipulation
- **POLYMORPH**: Shape-changing and transformation
- **MORPH**: Minor physical alterations
- **CURSE**: Harmful ongoing supernatural effects
- **INCAPACITATION**: Disabling effects (save penalties for higher-level targets)

#### Mental and Social
- **MENTAL**: Mind-affecting spells
- **EMOTION**: Emotion-influencing effects
- **FEAR**: Terror and frightening effects
- **LINGUISTIC**: Language-dependent effects
- **AUDITORY**: Sound-based perception effects

#### Divination and Knowledge
- **DETECTION**: Information-gathering spells
- **SCRYING**: Remote viewing and sensing
- **PREDICTION**: Future-revealing effects

#### Illusion and Deception  
- **ILLUSION**: False sensory information
- **VISUAL**: Sight-based illusions
- **OLFACTORY**: Smell-based illusions
- **SUBTLE**: Spells without obvious manifestations

#### Healing and Protection
- **HEALING**: Restorative effects
- **VITALITY**: Life-affirming energies (positive energy)
- **VOID**: Death-affiliated energies (negative energy)
- **DEATH**: Necromancy and undeath effects

#### Movement and Space
- **TELEPORTATION**: Instantaneous movement
- **EXTRADIMENSIONAL**: Other-dimensional effects

#### Elemental and Natural
- **AIR**: Wind and atmospheric effects
- **EARTH**: Stone, soil, and geological effects
- **WATER**: Liquid and aquatic effects
- **PLANT**: Vegetation-based effects
- **WOOD**: Specific plant material effects

#### Divine and Supernatural
- **HOLY**: Divine positive energy (was "good")
- **UNHOLY**: Divine negative energy (was "evil")
- **SANCTIFIED**: Divine-touched effects
- **SPIRIT**: Incorporeal and spiritual effects

### 4. Spell Levels and Ranks

#### Spell Rank System
- **Cantrips (Rank 0)**: Unlimited use spells, automatically heightened to half character level
- **1st-Rank**: Basic spells available to beginning spellcasters
- **2nd-Rank through 10th-Rank**: Progressively more powerful spells

#### Cantrip Special Rules
- Cast unlimited times per day
- Automatically heightened to half character level (rounded up)
- Don't consume spell slots
- Prepared casters prepare specific cantrips daily
- Have "Cantrip" in stat block instead of "Spell"

### 5. Spell Ranks and Heightening

#### Heightening Mechanics
- **Basic Heightening**: Any spell can be cast at higher rank for improved counteracting
- **Specific Heightening**: Many spells have special benefits at higher ranks
- **Two Heightening Types**:
  - **Fixed Rank**: "(3rd), (5th)" - Benefits only at specific ranks
  - **Scaling**: "(+1), (+2)" - Cumulative benefits every X ranks above base

#### Heightening Examples
- Damage spells often gain additional damage dice
- Duration may increase
- Area of effect may expand  
- Additional targets may be affected
- Save DCs may improve

### 6. Spellcasting Actions and Activity

#### Cast a Spell Activity
- All spell types use "Cast a Spell" activity
- Cantrips, spell slots, and focus spells use same process
- Spell slot spells are expended when cast
- Focus spells cost 1 Focus Point
- Activity traits vary by specific spell

---

## Spell Data Structure Analysis

### 1. Core Spell Properties

Every spell contains the following core data elements:

#### Basic Identification
- **Name**: Unique spell identifier
- **Rank**: Spell level (0 for cantrips, 1-10 for ranked spells)
- **Type**: "Spell", "Cantrip", or "Focus"
- **Rarity**: Common (default), Uncommon, Rare

#### Casting Information
- **Traditions**: Array of available traditions [arcane, divine, occult, primal]
- **Actions**: Number and type of actions required
- **Cast Time**: Specific casting time if longer than standard actions
- **Components**: Required components (represented as traits)

#### Targeting and Effect
- **Range**: Distance spell can reach
- **Area**: Affected area (if area spell)
- **Targets**: What can be targeted
- **Duration**: How long effects last
- **Defense**: What saves or defenses apply

#### Traits
- **Tradition**: arcane, divine, occult, or primal
- **School/Type Traits**: fire, illusion, healing, etc.
- **Component Traits**: concentrate, manipulate, etc.
- **Special Traits**: uncommon, focus, cantrip, etc.

### 2. Spell Lists by Tradition

#### List Organization Structure
Each tradition maintains separate spell lists organized by rank:
- Cantrips (Rank 0)
- 1st-Rank through 10th-Rank spells
- Focus spells (separate category)

#### Arcane Tradition Spells
**Representative Cantrips:**
- Caustic Blast H (acid damage)
- Daze H (mental effect)
- Electric Arc H (electricity damage)
- Figment (illusion)
- Frostbite H (cold damage)
- Ignition H (fire damage)
- Shield H (protection)
- Telekinetic Hand H (force manipulation)

**Representative 1st-Rank Spells:**
- Charm H (enchantment)
- Force Barrage H (magical force)
- Grease (conjuration)
- Illusory Disguise H (illusion)
- Sleep H (enchantment)
- Summon Construct H (conjuration)

**Arcane Focus Areas:**
- Broad spell selection (largest list)
- Strong elemental effects
- Force and energy manipulation
- Illusions and transmutation
- Constructs and magical theory

#### Divine Tradition Spells
**Representative Cantrips:**
- Divine Lance H (spirit damage)
- Forbidding Ward H (protection)
- Guidance (blessing)
- Light H (illumination)
- Stabilize (healing)

**Representative 1st-Rank Spells:**
- Bane (curse)
- Bless (blessing)
- Cure Wounds H (healing)
- Fear H (divine power)
- Spirit Link (connection)

**Divine Focus Areas:**
- Healing and restoration
- Divine power manifestation
- Blessing and curse effects
- Spirit realm interaction
- Faith-based magic

#### Occult Tradition Spells
**Representative Cantrips:**
- Daze H (mental control)
- Figment (mental illusion)
- Summon Instrument H (performance)
- Void Warp H (negative energy)

**Representative 1st-Rank Spells:**
- Charm H (social manipulation)
- Enfeeble (weakening)
- Grim Tendrils H (void damage)
- Mindlink (telepathy)
- Illusory Object H (complex illusion)

**Occult Focus Areas:**
- Mental manipulation and control
- Social and emotional effects
- Complex illusions
- Esoteric knowledge
- Performance and inspiration

#### Primal Tradition Spells
**Representative Cantrips:**
- Caustic Blast H (natural acid)
- Electric Arc H (natural lightning)
- Gouging Claw H (natural weapon)
- Tangle Vine H (plant growth)
- Vitality Lash H (life energy)

**Representative 1st-Rank Spells:**
- Air Bubble (elemental air)
- Breathe Fire H (elemental fire)
- Cleanse Cuisine (natural purification)
- Heal H (natural restoration)
- Summon Animal H (natural ally)

**Primal Focus Areas:**
- Elemental manipulation
- Animal and plant magic
- Natural healing
- Weather and terrain effects
- Instinctual magic

#### Cross-Tradition Spell Access
- Some spells appear on multiple tradition lists (e.g., Light, Detect Magic)
- Deity/patron grants may provide cross-tradition access
- Archetype abilities can grant limited access to other traditions
- Focus spells are typically tradition-specific

### 3. Heightening Rules Structure

#### Heightening Data Format
```
Heightened (Xth): [specific benefits at rank X]
Heightened (+Y): [benefits every Y ranks above base]
```

#### Common Heightening Patterns
- **Damage Scaling**: Additional dice per heightening level
- **Duration Extension**: Longer lasting effects
- **Target Increase**: More creatures affected
- **Area Expansion**: Larger areas of effect
- **Improved Saves**: Higher DCs or better save effects

### 4. Spell Mechanics Integration

#### Save and Attack Integration
- **Basic Saves**: Standard success/failure outcomes for damage
- **Spell Attacks**: Use spell attack bonus vs. target AC
- **Contested Checks**: Some spells use skill checks or other contests

#### Duration Categories
- **Instantaneous**: Immediate effect, no ongoing duration
- **Rounds**: Combat duration, counts down on caster's turn
- **Minutes/Hours**: Exploration duration
- **Until Daily Preparations**: Long-term duration
- **Sustained**: Requires Sustain action to continue
- **Unlimited**: Permanent until dispelled

---

## Implementation Requirements

### 1. Spell Database Structure

#### Core Data Schema Requirements

```typescript
interface SpellBase {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  rank: number;                  // 0-10 (0 for cantrips)
  type: 'spell' | 'cantrip' | 'focus';
  rarity: 'common' | 'uncommon' | 'rare' | 'unique';
  traditions: MagicTradition[];   // Available traditions
  actions: SpellActions;          // Action cost and type
  traits: string[];              // All applicable traits
  
  // Targeting
  range: SpellRange;
  area?: SpellArea;
  targets?: string;
  duration: SpellDuration;
  defense?: SpellDefense;
  
  // Text
  description: string;
  heighteningRules?: HeighteningRule[];
  
  // Validation
  requirements?: string[];        // Prerequisites
  restrictions?: string[];        // Usage limitations
}

interface HeighteningRule {
  type: 'fixed' | 'scaling';
  ranks?: number[];              // For fixed heightening
  increment?: number;            // For scaling heightening  
  benefits: string;              // Description of benefits
}

enum MagicTradition {
  ARCANE = 'arcane',
  DIVINE = 'divine', 
  OCCULT = 'occult',
  PRIMAL = 'primal'
}
```

### 2. Validation Rules

#### Spell Access Validation
- Characters can only access spells from their class traditions
- Spell rank must not exceed character's maximum spell rank
- Focus spells require specific class features or feats
- Uncommon/rare spells require GM permission or specific access

#### Casting Validation  
- Sufficient spell slots or Focus Points available
- Character meets any spell requirements
- Valid targets within range
- Appropriate actions available

#### Heightening Validation
- Heightened rank doesn't exceed caster's maximum
- Spontaneous casters must know spell at heightened rank
- Focus spells automatically heighten (no choice)

### 3. Character Integration

#### Spell Progression Data
```typescript
interface SpellcastingProgression {
  classId: string;
  tradition: MagicTradition;
  castingType: 'prepared' | 'spontaneous' | 'focus';
  spellsKnown?: SpellsKnownProgression;    // For spontaneous
  spellSlots: SpellSlotProgression;
  focusPoints?: number;                    // For focus casters
}

interface SpellSlotProgression {
  [rank: number]: number[];  // Slots per level [level1, level2, ...]
}
```

#### Character Spell Data
```typescript
interface CharacterSpells {
  characterId: string;
  traditions: MagicTradition[];
  
  // Prepared casters
  preparedSpells?: PreparedSpell[];
  availableCantrips?: string[];
  
  // Spontaneous casters  
  spellRepertoire?: string[];
  
  // Focus spells
  focusSpells?: string[];
  currentFocusPoints?: number;
  maxFocusPoints?: number;
  
  // Current state
  currentSpellSlots: {[rank: number]: number};
  usedSpells: SpellUsage[];
}
```

---

## Data Structure Specifications

### 1. Blockchain Storage Considerations

#### On-Chain Data (Critical)
- Spell ownership and access rights
- Current spell slots and Focus Points
- Prepared spells (for prepared casters)
- Spell usage tracking
- Character spell progression

#### Off-Chain Data (Reference)
- Complete spell descriptions
- Full heightening rule text
- Detailed mechanical explanations
- Flavor text and lore

#### Hybrid Storage (Efficient)
- Spell metadata and core mechanics on-chain
- Detailed descriptions referenced by hash
- Validation rules embedded in smart contracts

### 2. Smart Contract Architecture

#### Spell Registry Contract
```typescript
contract SpellRegistry {
  // Core spell data storage
  mapping(string => SpellData) public spells;
  mapping(string => string[]) public traditionSpells;
  
  // Validation functions
  function isValidSpellForTradition(string spellId, string tradition) returns (bool);
  function getMaxRankForLevel(uint8 level, string classId) returns (uint8);
  function canCastSpell(address character, string spellId, uint8 rank) returns (bool);
}
```

#### Character Spell Management Contract  
```typescript
contract CharacterSpells {
  // Spell preparation and usage
  function prepareSpells(string[] spellIds, uint8[] ranks) external;
  function castSpell(string spellId, uint8 heightenedRank) external;
  function expendFocusPoint() external;
  function refocus() external;
  
  // Spell learning
  function learnSpell(string spellId) external;
  function canLearnSpell(string spellId) returns (bool);
}
```

### 3. Integration Points

#### Class System Integration
- Spell tradition assignment by class
- Spell slot progression by class and level
- Focus spell access through class features
- Spellcasting ability modifier assignment

#### Equipment Integration  
- Focus items for enhanced spellcasting
- Material component costs
- Spell component pouches
- Spellbooks and spell preparation

#### Combat System Integration
- Action economy for spell casting
- Spell attack rolls and saves
- Counteracting and dispelling
- Concentration and disruption

---

## Conclusion

This analysis provides the foundation for implementing a comprehensive spells system on blockchain infrastructure. The trait-based approach of the source system maps well to smart contract data structures, while the clear spell progression and heightening rules enable precise mechanical implementation.

Key implementation priorities:
1. Establish core spell data structures and storage
2. Implement spell access validation based on character class and level
3. Create spell slot and Focus Point management systems
4. Build heightening and scaling mechanics
5. Integrate with existing character and combat systems

The modular design allows for incremental implementation, starting with basic spell storage and access, then expanding to include advanced features like focus spells, rituals, and complex heightening mechanics.