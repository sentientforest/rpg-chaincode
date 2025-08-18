# Complete Equipment System Analysis
**Date:** August 15, 2025  
**Source:** ext/pathfinder-rules/player-core/267-295_equipment.txt  
**Status:** Phase 2 - Complete Equipment System Analysis

## Executive Summary
Comprehensive extraction of the complete equipment system including currency, weapons, armor, adventuring gear, bulk mechanics, and equipment interactions. This analysis provides the foundation for implementing character equipment, encumbrance, combat gear, and economic systems in the RPG chaincode.

## Core Equipment Framework

### Currency System
**Standard Coinage**:
- **Copper Piece (cp)**: Base unit (1/10 silver piece)
- **Silver Piece (sp)**: Standard currency unit
- **Gold Piece (gp)**: 10 silver pieces or 100 copper pieces  
- **Platinum Piece (pp)**: 10 gold pieces, 100 silver pieces, or 1,000 copper pieces

**Starting Wealth**: 15 gold pieces (150 silver pieces) for new characters

**Alternative Currency**:
- Art objects, gems, and raw materials can function as currency
- Can be sold/bought for full value (unlike manufactured items at half price)

### Item Properties Framework

#### Universal Item Attributes
- **Price**: Cost in currency (— means cannot be purchased)
- **Item Level**: Complexity rating (0 if not listed, affects crafting)
- **Rarity**: Common (purchasable), Uncommon (special access), Rare (very limited)
- **Bulk**: Weight/encumbrance value
- **Traits**: Descriptive tags affecting item behavior

#### Carrying System
**Three Carrying States**:
1. **Held**: In hands (typically 2 hands available)
2. **Worn**: Easy access (pockets, belt, sheaths) - requires Interact action
3. **Stowed**: In containers (backpack) - more actions to access

**Wielding vs Holding**: 
- Wielding = ready to use effectively (right number of hands)
- Some abilities require wielding, others just holding/wearing/having

### Bulk and Encumbrance System

**Bulk Values**:
- **Numbers (1, 2, 3, etc.)**: Standard bulk units
- **L (Light)**: 10 light items = 1 bulk
- **— (Negligible)**: No bulk unless in vast quantities

**Carrying Capacity**:
- **Normal Load**: 5 + Strength modifier bulk
- **Encumbered**: Above normal (Clumsy 1 condition, -10 feet Speed)
- **Maximum Load**: 10 + Strength modifier bulk

**Special Bulk Rules**:
- 1,000 coins = 1 bulk
- Creatures have bulk by size: Tiny(1), Small(3), Medium(6), Large(12), etc.
- Guidelines: 5-10 pounds = 1 bulk, few ounces = negligible

## Complete Weapons System

### Weapon Categories and Proficiency
1. **Simple Weapons**: Basic weapons, trained proficiency for most classes
2. **Martial Weapons**: Military weapons, requires martial weapon proficiency  
3. **Advanced Weapons**: Exotic/specialized, requires special training
4. **Unarmed Attacks**: Fists and natural weapons

### Weapon Properties

**Core Statistics**:
- **Damage**: Die type + damage type (Bludgeoning/Piercing/Slashing)
- **Hands**: 1, 2, or 1+ (hold in one, need two to use effectively)
- **Range**: For ranged weapons (in feet, range increments)
- **Reload**: Actions needed to reload after firing
- **Group**: Category for critical specialization effects
- **Bulk**: Weight category for encumbrance

### Weapon Groups and Critical Specialization Effects

**Critical Specialization**: Additional effects when scoring critical hits with weapons you're an expert+ in:

- **Axe**: Damage adjacent creature if its AC is lower than attack roll
- **Bomb**: Increase splash damage radius to 10 feet
- **Bow**: Target stuck to surface (immobilized until they Escape)
- **Brawling**: Target slowed 1 until end of next turn (Fort save negates)
- **Club**: Knock target 10 feet away from you
- **Crossbow**: Target takes 1d8 persistent bleed damage
- **Dart**: Target takes 1d6 persistent bleed damage  
- **Flail**: Target knocked prone (Reflex save negates)
- **Hammer**: Target knocked prone (Fortitude save negates)
- **Knife**: Target takes 1d6 persistent bleed damage
- **Pick**: Deal +2 damage per weapon damage die
- **Polearm**: Move target 5 feet in any direction
- **Shield**: Knock target 5 feet away from you
- **Sling**: Target stunned 1 (Fortitude save negates)
- **Spear**: Target clumsy 1 until start of next turn
- **Sword**: Target off-guard until start of next turn

### Key Weapon Traits

**Combat Mechanics**:
- **Agile**: Multiple attack penalty -4/-8 instead of -5/-10
- **Finesse**: Use Dexterity instead of Strength for attack rolls
- **Reach**: Attack targets 10 feet away instead of adjacent
- **Two-Hand X**: Can wield with both hands to increase damage die to X

**Damage Enhancement**:
- **Deadly X**: Add one weapon damage die of size X on critical hits
- **Fatal X**: Change weapon damage die to size X and add one extra die on critical
- **Forceful**: +1 circumstance damage per weapon die on 2nd attack, +2 on 3rd+
- **Versatile X**: Can choose to deal damage type X instead of normal type

**Ranged Capabilities**:
- **Thrown X**: Can throw weapon with range increment X
- **Propulsive**: Add half Strength modifier to damage (minimum 0)
- **Volley X**: -2 penalty when attacking targets within X feet

### Weapon Catalog Examples

**Simple Melee Weapons**:
- **Club**: 0 gp, 1d6 B, Club group, 1 hand, 1 Bulk, thrown 10 ft.
- **Dagger**: 2 sp, 1d4 P, Knife group, 1 hand, L Bulk, agile/finesse/thrown 10 ft./versatile S
- **Spear**: 1 sp, 1d6 P, Spear group, 1 hand, 1 Bulk, thrown 20 ft.

**Martial Melee Weapons**:
- **Longsword**: 1 gp, 1d8 S, Sword group, 1 hand, 1 Bulk, versatile P
- **Greatsword**: 2 gp, 1d12 S, Sword group, 2 hands, 2 Bulk, versatile P
- **Rapier**: 2 gp, 1d6 P, Sword group, 1 hand, 1 Bulk, deadly d8/disarm/finesse

**Ranged Weapons**:
- **Crossbow**: 3 gp, 1d8 P, Crossbow group, 2 hands, 1 Bulk, range 120 ft., reload 1
- **Longbow**: 6 gp, 1d8 P, Bow group, 1+ hands, 2 Bulk, range 100 ft., deadly d10/volley 30 ft.

## Complete Armor System

### Armor Categories and Proficiency
1. **Unarmored**: No armor or explorer's clothing
2. **Light Armor**: Leather-based, minimal encumbrance
3. **Medium Armor**: Chain/scale, moderate protection and encumbrance
4. **Heavy Armor**: Plate-based, maximum protection and encumbrance

### Armor Properties

**Core Statistics**:
- **AC Bonus**: Item bonus added to Armor Class
- **Dex Cap**: Maximum Dexterity modifier that applies to AC
- **Check Penalty**: Penalty to Strength/Dexterity skill checks (except those with attack trait)
- **Speed Penalty**: Reduction to Speed and movement types
- **Strength Requirement**: Strength modifier needed to ignore check penalty and reduce Speed penalty by 5 feet
- **Bulk**: Encumbrance value
- **Group**: Armor material category (Cloth, Leather, Chain, Plate, Composite)

### Armor Progression

**Unarmored Defense**:
- No armor: AC +0, Dex Cap unlimited, no penalties
- Explorer's clothing: AC +0, Dex Cap +5, L Bulk, comfort trait

**Light Armor Progression**:
- **Leather**: 2 gp, AC +1, Dex Cap +4, Check -1, Str +0, 1 Bulk
- **Studded Leather**: 3 gp, AC +2, Dex Cap +3, Check -1, Str +0, 1 Bulk  
- **Chain Shirt**: 5 gp, AC +2, Dex Cap +3, Check -1, Str +0, 1 Bulk

**Medium Armor Progression**:
- **Hide**: 2 gp, AC +3, Dex Cap +2, Check -2, Speed -5 ft., Str +2, 2 Bulk
- **Scale Mail**: 4 gp, AC +3, Dex Cap +2, Check -2, Speed -5 ft., Str +2, 2 Bulk
- **Chain Mail**: 6 gp, AC +4, Dex Cap +1, Check -2, Speed -5 ft., Str +2, 2 Bulk

**Heavy Armor Progression**:
- **Splint Mail**: 13 gp, AC +5, Dex Cap +1, Check -3, Speed -10 ft., Str +3, 3 Bulk
- **Half Plate**: 18 gp, AC +5, Dex Cap +1, Check -3, Speed -10 ft., Str +3, 3 Bulk
- **Full Plate**: 30 gp, AC +6, Dex Cap +0, Check -3, Speed -10 ft., Str +4, 4 Bulk

### Armor Traits
- **Bulwark**: Covers body completely, provides additional benefits
- **Comfort**: Designed for extended wear, more comfortable
- **Flexible**: More flexible than typical armor of its type
- **Noisy**: Makes noise when moving, affects Stealth

## Shield System

### Shield Types and Properties
**Shield Statistics**:
- **AC Bonus**: Circumstance bonus when shield is raised
- **Speed Penalty**: Applied when holding the shield  
- **Hardness**: Damage reduction when using Shield Block
- **Hit Points/Broken Threshold**: Shield durability

**Common Shields**:
- **Buckler**: AC +1, no Speed penalty, L Bulk, can't use Shield Block
- **Wooden Shield**: AC +2, -5 ft. Speed, 1 Bulk, Hardness 3, HP 12, BT 6
- **Steel Shield**: AC +2, -5 ft. Speed, 1 Bulk, Hardness 5, HP 20, BT 10
- **Tower Shield**: AC +2/+4 (Take Cover), -5 ft. Speed, 4 Bulk, Hardness 5, HP 20, BT 10

### Shield Actions
- **Raise a Shield** (1 action): Gain AC bonus until start of next turn
- **Shield Block** (reaction): Reduce damage but shield takes damage
- **Take Cover** (1 action): With tower shield, gain +4 AC instead of +2

## Adventuring Gear System

### Essential Gear Categories

**Survival Equipment**:
- **Adventurer's Pack**: 15 sp, 1 Bulk (includes backpack, bedroll, rope, rations, etc.)
- **Bedroll**: 2 cp, L Bulk (for resting)
- **Rations (1 week)**: 4 sp, L Bulk (prevents starvation)
- **Rope (50 feet)**: 2 gp, 1 Bulk (climbing, binding)
- **Torch**: 1 cp, L Bulk (bright light 20 ft., dim 40 ft.)

**Tools and Kits**:
- **Thieves' Tools**: 3 gp, 1 Bulk, +1 item bonus to Thievery (Pick Locks, Disable Device)
- **Healer's Kit**: 5 gp, 1 Bulk, +1 item bonus to Medicine (required for Treat Wounds)
- **Artisan's Tools**: 4 gp, 2 Bulk, required for Crafting checks
- **Repair Kit**: 2 gp, 1 Bulk, enables field repairs of damaged items

**Containers and Storage**:
- **Backpack**: 1 sp, L Bulk (holds 4 Bulk, first 2 don't count against limit)
- **Belt Pouch**: 4 cp, L Bulk (holds 4 items of L Bulk)
- **Sack**: 1 cp, L Bulk (holds 8 Bulk when not carried)
- **Chest**: 6 gp, 2 Bulk (holds 8 Bulk when not carried)

### Alchemical Items

**Bombs**:
- **Acid Flask (Lesser)**: 3 gp, L Bulk, 1d6 acid + 1 persistent acid + 1 acid splash
- **Alchemist's Fire (Lesser)**: 3 gp, L Bulk, 1d8 fire + 1 persistent fire + 1 fire splash
- **Frost Vial (Lesser)**: 3 gp, L Bulk, 1d6 cold + 1 cold splash

**Elixirs**:
- **Antidote (Lesser)**: 3 gp, L Bulk, +2 item bonus vs poisons for 6 hours
- **Elixir of Life (Minor)**: 3 gp, L Bulk, heal 1d6 HP immediately

## Equipment Interaction Rules

### Drawing and Stowing Actions
**Standard Actions**:
- **Interact**: Draw worn item, stow worn item, change grip on held item
- **Release**: Drop held item (free action)
- **Multiple Actions**: Many item uses require combinations (e.g., draw + drink potion = 2 actions)

**Hand Management**:
- Most characters have 2 hands
- Can hold one item per hand or one two-handed item
- Must have proper hands free to use items effectively

### Item Damage and Durability

**Item Statistics**:
- **Hardness**: Damage reduction when item is attacked/damaged
- **Hit Points**: Total durability before destruction
- **Broken Threshold**: HP at which item becomes broken
- **Broken Condition**: Item functions at reduced effectiveness

**Shoddy Items**:
- Cost half normal price
- Take -2 item penalty to relevant statistics  
- Have reduced hardness and HP (easier to break)

### Special Materials and Enchantments

**Common Special Materials**:
- **Silver**: Effective against certain creatures, costs more
- **Cold Iron**: Effective against fey and demons, costs more
- **Adamantine**: Extremely hard, ignores hardness of lower-level items
- **Mithral**: Lighter weight, reduces bulk and armor penalties

## Class Equipment Packages

### Quick Starting Packages
Each class has recommended starting equipment package that uses most of the 15 gp:

**Fighter Package** (Cost ~13 gp):
- Scale mail armor, longsword, shield
- Adventurer's pack, 4 javelins
- Remaining: ~2 gp for customization

**Rogue Package** (Cost ~12 gp):
- Studded leather armor, rapier, shortbow + 20 arrows
- Thieves' tools, adventurer's pack
- Remaining: ~3 gp for customization

**Wizard Package** (Cost ~8 gp):
- Staff, crossbow + 20 bolts, spellbook
- Adventurer's pack, writing set
- Remaining: ~7 gp for spell components and scrolls

## Implementation Considerations

### Data Structure Requirements
```typescript
interface Currency {
  copper: number;
  silver: number;
  gold: number;
  platinum: number;
}

interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  price: Currency;
  level: number;
  bulk: BulkValue;
  rarity: 'common' | 'uncommon' | 'rare';
  traits: string[];
  description: string;
}

interface Weapon extends Equipment {
  weaponCategory: 'simple' | 'martial' | 'advanced' | 'unarmed';
  damage: string; // "1d8"
  damageType: 'B' | 'P' | 'S';
  hands: 1 | 2 | '1+';
  group: WeaponGroup;
  range?: number;
  reload?: number;
  weaponTraits: WeaponTrait[];
}

interface Armor extends Equipment {
  armorCategory: 'unarmored' | 'light' | 'medium' | 'heavy';
  acBonus: number;
  dexCap: number | null;
  checkPenalty: number;
  speedPenalty: number;
  strengthRequirement: number;
  group: ArmorGroup;
}

type BulkValue = number | 'L' | '—';
```

### Validation Requirements
1. **Currency Math**: Accurate conversion between coin types
2. **Bulk Calculation**: Track carrying capacity and encumbrance
3. **Proficiency Validation**: Ensure characters can use equipped items
4. **Hand Management**: Track what's held/worn/stowed
5. **Equipment States**: Handle broken/damaged/destroyed conditions

### Integration Points
- **Character Creation**: Starting wealth and equipment selection
- **Combat System**: Weapon damage, armor AC, shield mechanics
- **Skill System**: Tool bonuses, armor check penalties
- **Exploration**: Light sources, survival gear, carrying capacity
- **Economy**: Item values, trading, treasure acquisition

---

**Status:** ✅ Complete equipment system analyzed and documented  
**Next:** Create machine-readable equipment data files and begin spells analysis