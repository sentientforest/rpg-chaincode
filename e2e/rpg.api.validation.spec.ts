import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";

jest.setTimeout(30000);

describe("RPG Contract API Validation - Sub-tasks 0.1 + 0.2 + 0.3", () => {
  const rpgContractConfig = {
    rpg: {
      channel: "product-channel",
      chaincode: "basic-product",
      contract: "Rpg",
      api: rpgContractAPI
    }
  };
  
  let client: AdminChainClients<typeof rpgContractConfig>;
  
  beforeAll(async () => {
    client = await TestClients.createForAdmin(rpgContractConfig);
  });
  
  afterAll(async () => {
    await client.disconnect();
  });
  
  test("Can connect to RPG contract and fetch API", async () => {
    const response = await client.rpg.GetContractAPI();
    expect(response).toEqual(transactionSuccess());
    expect(response.Data?.contractName).toBe("Rpg");
  });
  
  test("API has all required reference data methods (30 methods)", () => {
    // Verify the API has all expected methods from sub-task 0.1
    const api = rpgContractAPI({} as any);
    
    // Weapon methods (5)
    expect(typeof api.CreateWeaponData).toBe("function");
    expect(typeof api.UpdateWeaponData).toBe("function");
    expect(typeof api.DeleteWeaponData).toBe("function");
    expect(typeof api.GetWeaponData).toBe("function");
    expect(typeof api.ListWeaponData).toBe("function");
    
    // Armor methods (5)
    expect(typeof api.CreateArmorData).toBe("function");
    expect(typeof api.UpdateArmorData).toBe("function");
    expect(typeof api.DeleteArmorData).toBe("function");
    expect(typeof api.GetArmorData).toBe("function");
    expect(typeof api.ListArmorData).toBe("function");
    
    // Skill methods (5)
    expect(typeof api.CreateSkillData).toBe("function");
    expect(typeof api.UpdateSkillData).toBe("function");
    expect(typeof api.DeleteSkillData).toBe("function");
    expect(typeof api.GetSkillData).toBe("function");
    expect(typeof api.ListSkillData).toBe("function");
    
    // Background methods (5)
    expect(typeof api.CreateBackgroundData).toBe("function");
    expect(typeof api.UpdateBackgroundData).toBe("function");
    expect(typeof api.DeleteBackgroundData).toBe("function");
    expect(typeof api.GetBackgroundData).toBe("function");
    expect(typeof api.ListBackgroundData).toBe("function");
    
    // Feat methods (5)
    expect(typeof api.CreateFeatData).toBe("function");
    expect(typeof api.UpdateFeatData).toBe("function");
    expect(typeof api.DeleteFeatData).toBe("function");
    expect(typeof api.GetFeatData).toBe("function");
    expect(typeof api.ListFeatData).toBe("function");
    
    // Spell methods (5)
    expect(typeof api.CreateSpellData).toBe("function");
    expect(typeof api.UpdateSpellData).toBe("function");
    expect(typeof api.DeleteSpellData).toBe("function");
    expect(typeof api.GetSpellData).toBe("function");
    expect(typeof api.ListSpellData).toBe("function");
  });
  
  test("API has all required character CRUD methods (7 methods)", () => {
    // Verify the API has all expected methods from sub-task 0.2
    const api = rpgContractAPI({} as any);
    
    // Character CRUD methods (7)
    expect(typeof api.CreateCharacter).toBe("function");
    expect(typeof api.GetCharacterSheet).toBe("function");
    expect(typeof api.ListCharacters).toBe("function");
    expect(typeof api.LevelUpCharacter).toBe("function");
    expect(typeof api.UpdateCharacterState).toBe("function");
    expect(typeof api.ValidateCharacter).toBe("function");
    expect(typeof api.GetCharacterHistory).toBe("function");
  });
  
  test("API has all required character management methods (5 methods)", () => {
    // Verify the API has all expected methods from sub-task 0.3
    const api = rpgContractAPI({} as any);
    
    // Character Management methods (5)
    expect(typeof api.AddEquipment).toBe("function");
    expect(typeof api.EquipItem).toBe("function");
    expect(typeof api.AddSkillProficiency).toBe("function");
    expect(typeof api.AddFeat).toBe("function");
    expect(typeof api.AddSpell).toBe("function");
  });
});