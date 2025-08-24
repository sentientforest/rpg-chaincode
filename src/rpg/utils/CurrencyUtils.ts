import BigNumber from "bignumber.js";

import { CurrencyDto } from "../types/CurrencyDto";

/**
 * @description
 *
 * Utility functions for currency conversion and management.
 * All internal calculations use copper pieces for precision.
 */
export class CurrencyUtils {
  /**
   * Convert all currency to copper pieces for calculations
   * 1 pp = 1000 cp, 1 gp = 100 cp, 1 sp = 10 cp, 1 cp = 1 cp
   */
  static toCopper(currency: CurrencyDto): BigNumber {
    let total = new BigNumber(0);
    if (currency.platinum) total = total.plus(currency.platinum * 1000);
    if (currency.gold) total = total.plus(currency.gold * 100);
    if (currency.silver) total = total.plus(currency.silver * 10);
    if (currency.copper) total = total.plus(currency.copper);
    return total;
  }

  /**
   * Convert copper pieces to optimal currency mix
   * Returns the most efficient denomination breakdown
   */
  static fromCopper(copper: BigNumber): CurrencyDto {
    const total = copper.toNumber();
    const platinum = Math.floor(total / 1000);
    const remainderAfterPlatinum = total % 1000;
    const gold = Math.floor(remainderAfterPlatinum / 100);
    const remainderAfterGold = remainderAfterPlatinum % 100;
    const silver = Math.floor(remainderAfterGold / 10);
    const copperCoins = remainderAfterGold % 10;

    return {
      platinum: platinum || undefined,
      gold: gold || undefined,
      silver: silver || undefined,
      copper: copperCoins || undefined
    };
  }

  /**
   * Convert copper pieces to a specific denomination
   */
  static toDenomination(copper: BigNumber, denomination: "cp" | "sp" | "gp" | "pp"): BigNumber {
    const conversionRates = {
      cp: 1,
      sp: 10,
      gp: 100,
      pp: 1000
    };

    return copper.dividedBy(conversionRates[denomination]);
  }

  /**
   * Calculate starting wealth (15 gp = 1500 cp)
   */
  static getStartingWealth(): BigNumber {
    return new BigNumber(1500); // 15 gold in copper pieces
  }

  /**
   * Add two currency amounts
   */
  static addCurrency(currency1: CurrencyDto, currency2: CurrencyDto): BigNumber {
    const total1 = this.toCopper(currency1);
    const total2 = this.toCopper(currency2);
    return total1.plus(total2);
  }

  /**
   * Subtract currency amounts (returns result in copper)
   */
  static subtractCurrency(currency1: CurrencyDto, currency2: CurrencyDto): BigNumber {
    const total1 = this.toCopper(currency1);
    const total2 = this.toCopper(currency2);
    return total1.minus(total2);
  }

  /**
   * Check if first currency amount is greater than or equal to second
   */
  static canAfford(available: CurrencyDto, cost: CurrencyDto): boolean {
    const availableCopper = this.toCopper(available);
    const costCopper = this.toCopper(cost);
    return availableCopper.isGreaterThanOrEqualTo(costCopper);
  }

  /**
   * Calculate coin bulk (1,000 coins = 1 bulk)
   */
  static calculateCoinBulk(currency: CurrencyDto): BigNumber {
    const totalCoins =
      (currency.platinum || 0) + (currency.gold || 0) + (currency.silver || 0) + (currency.copper || 0);

    return new BigNumber(totalCoins).dividedBy(1000);
  }

  /**
   * Format currency for display
   */
  static formatCurrency(currency: CurrencyDto): string {
    const parts: string[] = [];

    if (currency.platinum && currency.platinum > 0) {
      parts.push(`${currency.platinum} pp`);
    }
    if (currency.gold && currency.gold > 0) {
      parts.push(`${currency.gold} gp`);
    }
    if (currency.silver && currency.silver > 0) {
      parts.push(`${currency.silver} sp`);
    }
    if (currency.copper && currency.copper > 0) {
      parts.push(`${currency.copper} cp`);
    }

    return parts.length > 0 ? parts.join(", ") : "0 cp";
  }

  /**
   * Format copper amount to optimal currency display
   */
  static formatCopperAmount(copper: BigNumber): string {
    const currency = this.fromCopper(copper);
    return this.formatCurrency(currency);
  }

  /**
   * Parse currency from string (e.g., "5 gp, 3 sp")
   */
  static parseCurrency(currencyString: string): CurrencyDto {
    const currency: CurrencyDto = {};

    // Match patterns like "5 gp", "10 sp", etc.
    const patterns = [
      { regex: /(\d+)\s*pp/i, denomination: "platinum" },
      { regex: /(\d+)\s*gp/i, denomination: "gold" },
      { regex: /(\d+)\s*sp/i, denomination: "silver" },
      { regex: /(\d+)\s*cp/i, denomination: "copper" }
    ];

    for (const pattern of patterns) {
      const match = currencyString.match(pattern.regex);
      if (match) {
        (currency as any)[pattern.denomination] = parseInt(match[1], 10);
      }
    }

    return currency;
  }
}
