import { ChainKey, ChainObject } from "@gala-chain/api";
import { IsNotEmpty, IsString, IsOptional, IsArray, IsBoolean, IsNumber } from "class-validator";

/**
 * @description
 * 
 * Represents a persistent location in the game world.
 * Supports persistent world features and cross-campaign content.
 */
export class WorldLocation extends ChainObject {
  public static INDEX_KEY = "RPWL";
  
  @ChainKey({ position: 0 })
  @IsNotEmpty()
  public worldId: string; // World/setting identifier
  
  @ChainKey({ position: 1 })
  @IsNotEmpty()
  public locationId: string; // Unique location identifier
  
  @IsNotEmpty()
  public name: string;
  
  @IsString()
  public description: string;
  
  @IsString()
  public locationType: string; // "settlement", "dungeon", "wilderness", "planar"
  
  @IsOptional()
  @IsString()
  public parentLocationId?: string; // For nested locations
  
  @IsArray()
  public connectedLocations: string[]; // Adjacent/connected location IDs
  
  @IsArray()
  public persistentEffects: string[]; // SpellEffect IDs affecting this location
  
  @IsArray()
  public availableServices: string[]; // "shop", "inn", "temple", "guild"
  
  @IsOptional()
  @IsNumber()
  public dangerLevel?: number; // 1-20 for encounter difficulty
  
  @IsBoolean()
  public isDiscovered: boolean; // Whether location is known to players
  
  @IsBoolean()
  public allowsRest: boolean; // Can characters rest here safely
  
  @IsArray()
  public visitedByCampaigns: string[]; // Campaign IDs that have been here
  
  @IsOptional()
  @IsString()
  public controllingFaction?: string; // Who controls this location
  
  @IsNumber()
  public createdAt: number; // ctx.txUnixTime
  
  @IsNumber()
  public lastUpdated: number; // When location was last modified
}