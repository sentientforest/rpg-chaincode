import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";
import { createValidSubmitDTO, ChainUser } from "@gala-chain/api";
import {
  CreateWeaponDataDto,
  GetReferenceDataDto,
  ListReferenceDataDto,
  CreateArmorDataDto,
  CreateSkillDataDto,
  CreateBackgroundDataDto,
  CreateFeatDataDto,
  CreateSpellDataDto
} from "../src/rpg/types";

jest.setTimeout(60000);

describe("Reference Data E2E Tests - Foundation Phase", () => {
  const rpgContractConfig = {
    rpg: {
      channel: "product-channel",
      chaincode: "basic-product",
      contract: "Rpg",
      api: rpgContractAPI
    }
  };
  
  let client: AdminChainClients<typeof rpgContractConfig>;
  let user: ChainUser;
  
  beforeAll(async () => {
    client = await TestClients.createForAdmin(rpgContractConfig);
    user = await client.createRegisteredUser();
  });
  
  afterAll(async () => {
    await client.disconnect();
  });

  describe("Weapon Data Operations", () => {
    const testWeaponName = "Test Longsword";
    
    test("Create weapon data", async () => {
      const dto = await createValidSubmitDTO(CreateWeaponDataDto, {
        name: testWeaponName,
        category: "martial",
        group: "sword",
        price: { gold: 15 },
        damage: "1d8",
        damageType: "slashing",
        traits: ["versatile"],
        hands: 1,
        description: "A versatile one-handed weapon"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.CreateWeaponData(dto);
      expect(response).toEqual(transactionSuccess());
    });

    test("Get weapon data by name", async () => {
      const dto = new GetReferenceDataDto();
      dto.name = testWeaponName;
      await dto.sign(user.privateKey);

      const response = await client.rpg.GetWeaponData(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.name).toBe(testWeaponName);
      expect(response.Data?.category).toBe("martial");
    });

    test("List weapon data", async () => {
      const dto = new ListReferenceDataDto();
      dto.bookmark = "";
      dto.limit = 10;
      await dto.sign(user.privateKey);

      const response = await client.rpg.ListWeaponData(dto);
      expect(response).toEqual(transactionSuccess());
      expect(Array.isArray(response.Data)).toBe(true);
    });
  });

  describe("Armor Data Operations", () => {
    const testArmorName = "Test Chain Mail";
    
    test("Create armor data", async () => {
      const dto = await createValidSubmitDTO(CreateArmorDataDto, {
        name: testArmorName,
        category: "medium",
        price: { gold: 75 },
        acBonus: 5,
        dexCap: 2,
        checkPenalty: -1,
        speedPenalty: -5,
        group: "chain",
        traits: [],
        description: "Made of interlocking metal rings"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.CreateArmorData(dto);
      expect(response).toEqual(transactionSuccess());
    });

    test("Get armor data by name", async () => {
      const dto = new GetReferenceDataDto();
      dto.name = testArmorName;
      await dto.sign(user.privateKey);

      const response = await client.rpg.GetArmorData(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.name).toBe(testArmorName);
      expect(response.Data?.category).toBe("medium");
    });
  });

  describe("Cross-Type Data Validation", () => {
    test("List all reference data types", async () => {
      const dto = new ListReferenceDataDto();
      dto.bookmark = "";
      dto.limit = 50;
      await dto.sign(user.privateKey);

      // Test listing each data type
      const weaponResponse = await client.rpg.ListWeaponData(dto);
      const armorResponse = await client.rpg.ListArmorData(dto);

      expect(weaponResponse).toEqual(transactionSuccess());
      expect(armorResponse).toEqual(transactionSuccess());

      // Verify we have data in each category
      expect(Array.isArray(weaponResponse.Data)).toBe(true);
      expect(Array.isArray(armorResponse.Data)).toBe(true);
      
      // Should find our test items
      expect(weaponResponse.Data?.length).toBeGreaterThan(0);
      expect(armorResponse.Data?.length).toBeGreaterThan(0);
    });

    test("API connection works", async () => {
      const response = await client.rpg.GetContractAPI();
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.contractName).toBe("Rpg");
    });
  });
});