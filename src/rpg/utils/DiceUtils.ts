/**
 * @description
 *
 * Utility functions for dice rolling and randomization.
 * Uses cryptographically secure seeds for deterministic results.
 */
export class DiceUtils {
  /**
   * Parse a dice expression like "2d6+3" or "4d6kh3"
   */
  static parseDiceExpression(expression: string): {
    count: number;
    sides: number;
    modifier: number;
    keepHighest?: number;
    keepLowest?: number;
  } {
    const cleanExpr = expression.toLowerCase().replace(/\s/g, "");

    // Match patterns like "2d6+3", "1d20", "4d6kh3", "3d6kl2"
    const match = cleanExpr.match(/^(\d+)d(\d+)(?:kh(\d+)|kl(\d+))?([+-]\d+)?$/);

    if (!match) {
      throw new Error(`Invalid dice expression: ${expression}`);
    }

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const keepHighest = match[3] ? parseInt(match[3]) : undefined;
    const keepLowest = match[4] ? parseInt(match[4]) : undefined;
    const modifier = match[5] ? parseInt(match[5]) : 0;

    if (count <= 0 || count > 100) {
      throw new Error("Dice count must be between 1 and 100");
    }

    if (sides <= 1 || sides > 1000) {
      throw new Error("Dice sides must be between 2 and 1000");
    }

    return { count, sides, modifier, keepHighest, keepLowest };
  }

  /**
   * Generate deterministic random numbers from a seed
   */
  static seededRandom(seed: string, index: number): number {
    // Simple LCG (Linear Congruential Generator) for deterministic randomness
    const seedHash = this.hashString(seed + index.toString());
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    const value = (a * seedHash + c) % m;
    return value / m;
  }

  /**
   * Hash a string to a number for seeding
   */
  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Roll dice with deterministic randomness
   */
  static rollDice(
    count: number,
    sides: number,
    seed: string,
    keepHighest?: number,
    keepLowest?: number
  ): number[] {
    const rolls: number[] = [];

    for (let i = 0; i < count; i++) {
      const random = this.seededRandom(seed, i);
      const roll = Math.floor(random * sides) + 1;
      rolls.push(roll);
    }

    // Apply keep highest/lowest if specified
    if (keepHighest !== undefined) {
      rolls.sort((a, b) => b - a); // Descending order
      return rolls.slice(0, keepHighest);
    }

    if (keepLowest !== undefined) {
      rolls.sort((a, b) => a - b); // Ascending order
      return rolls.slice(0, keepLowest);
    }

    return rolls;
  }

  /**
   * Execute a complete dice expression
   */
  static executeRoll(
    expression: string,
    seed: string
  ): {
    individualRolls: number[];
    modifier: number;
    total: number;
  } {
    const parsed = this.parseDiceExpression(expression);
    const rolls = this.rollDice(parsed.count, parsed.sides, seed, parsed.keepHighest, parsed.keepLowest);

    const rollSum = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = rollSum + parsed.modifier;

    return {
      individualRolls: rolls,
      modifier: parsed.modifier,
      total
    };
  }

  /**
   * Determine outcome based on DC
   */
  static determineOutcome(total: number, dc: number): string {
    if (total >= dc + 10) {
      return "critical_success";
    } else if (total >= dc) {
      return "success";
    } else if (total <= dc - 10) {
      return "critical_failure";
    } else {
      return "failure";
    }
  }

  /**
   * Check for natural 20 or natural 1 on d20 rolls
   */
  static checkNaturalRoll(rolls: number[], sides: number): string | undefined {
    if (sides === 20 && rolls.length === 1) {
      if (rolls[0] === 20) return "natural_20";
      if (rolls[0] === 1) return "natural_1";
    }
    return undefined;
  }
}
