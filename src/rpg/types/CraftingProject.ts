import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsNumber, IsString, IsOptional, IsBoolean, IsArray, Min } from "class-validator";

/**
 * @description
 * 
 * Represents a crafting project undertaken during downtime.
 * Tracks progress, materials, and completion.
 */
export class CraftingProject extends ChainObject {
  public static INDEX_KEY = "RPCP";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public characterName: string;
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public projectId: string; // Unique project identifier
  
  @IsString()
  public itemName: string; // What is being crafted
  
  @IsString()
  public itemType: string; // "weapon", "armor", "consumable", "tool", etc.
  
  @IsNumber()
  public itemLevel: number; // Level of the item being crafted
  
  @IsString()
  public craftingSkill: string; // "crafting", "alchemy", etc.
  
  @IsNumber()
  public targetDC: number; // Crafting difficulty class
  
  @IsNumber()
  @Min(0)
  public totalCost: number; // Total cost in gold pieces
  
  @IsNumber()
  @Min(0)
  public progressMade: number; // Progress in gold pieces equivalent
  
  @IsArray()
  public materialsUsed: string[]; // Materials consumed so far
  
  @IsArray()
  public materialsNeeded: string[]; // Materials still required
  
  @IsNumber()
  @Min(0)
  public daysWorked: number; // Days spent on project
  
  @IsBoolean()
  public isCompleted: boolean;
  
  @IsBoolean()
  public isCriticalSuccess: boolean; // Crafted higher quality/quantity
  
  @IsOptional()
  @IsString()
  public complications?: string; // Any problems encountered
  
  @IsOptional()
  @IsString()
  public formula?: string; // Formula used for crafting
  
  @IsNumber()
  public startedAt: number; // ctx.txUnixTime when project began
  
  @IsOptional()
  @IsNumber()
  public completedAt?: number; // When project finished
}