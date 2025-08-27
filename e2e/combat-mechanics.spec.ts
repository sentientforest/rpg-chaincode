import { rpgContractAPI } from "./rpg.api";
import { AdminChainClients, TestClients, transactionSuccess } from "@gala-chain/test";
import { createValidSubmitDTO, ChainUser } from "@gala-chain/api";
import {
  RollDiceDto,
  CreateEncounterDto,
  CreatePartyDto,
  PerformAttackDto,
  MakeSavingThrowDto,
  MakeSkillCheckDto,
  ApplyStatusEffectDto,
  CastSpellDto
} from "../src/rpg/types";

jest.setTimeout(60000);

describe("Combat and Game Mechanics E2E Tests - Phase 3", () => {
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
  const testEncounterId = `encounter-${Date.now()}`;
  const testPartyId = `party-${Date.now()}`;
  
  beforeAll(async () => {
    client = await TestClients.createForAdmin(rpgContractConfig);
    user = await client.createRegisteredUser();
  });
  
  afterAll(async () => {
    await client.disconnect();
  });

  describe("Dice Rolling System", () => {
    test("Roll basic dice (1d20)", async () => {
      const dto = await createValidSubmitDTO(RollDiceDto, {
        rollId: `roll-${Date.now()}-1`,
        rollType: "attack",
        diceExpression: "1d20",
        modifier: 0,
        randomSeed: Math.random().toString(36).substring(2, 15),
        purpose: "attack roll"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.RollDice(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.expression).toBe("1d20");
      expect(response.Data?.rolls).toBeDefined();
      expect(response.Data?.total).toBeGreaterThanOrEqual(1);
      expect(response.Data?.total).toBeLessThanOrEqual(20);
    });

    test("Roll complex dice with modifiers (2d6+3)", async () => {
      const dto = await createValidSubmitDTO(RollDiceDto, {
        rollId: `roll-${Date.now()}-2`,
        rollType: "damage",
        diceExpression: "2d6",
        modifier: 3,
        randomSeed: Math.random().toString(36).substring(2, 15),
        purpose: "damage roll"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.RollDice(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.expression).toContain("2d6");
      expect(response.Data?.total).toBeGreaterThanOrEqual(5); // Minimum: 2*1 + 3
      expect(response.Data?.total).toBeLessThanOrEqual(15); // Maximum: 2*6 + 3
    });

    test("Roll with target DC", async () => {
      const dto = await createValidSubmitDTO(RollDiceDto, {
        rollId: `roll-${Date.now()}-3`,
        rollType: "ability_check",
        diceExpression: "1d20",
        modifier: 5,
        randomSeed: Math.random().toString(36).substring(2, 15),
        purpose: "perception check",
        targetDC: "15"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.RollDice(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.rolls).toBeDefined();
    });
  });

  describe("Encounter Management", () => {
    test("Create a new encounter", async () => {
      const dto = await createValidSubmitDTO(CreateEncounterDto, {
        campaignId: "test-campaign",
        encounterId: testEncounterId,
        name: "Goblin Ambush",
        description: "A group of goblins attacks the party",
        encounterType: "combat",
        level: 1,
        initialParticipants: []
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.CreateEncounter(dto);
      expect(response).toEqual(transactionSuccess());
    });
  });

  describe("Party Management", () => {
    test("Create a new party", async () => {
      const dto = await createValidSubmitDTO(CreatePartyDto, {
        partyId: testPartyId,
        name: "The Brave Adventurers",
        leader: user.identityKey,
        members: [user.identityKey],
        description: "A group of brave heroes"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.CreateParty(dto);
      expect(response).toEqual(transactionSuccess());
    });
  });

  describe("Combat Actions", () => {
    test("Perform attack action", async () => {
      const dto = await createValidSubmitDTO(PerformAttackDto, {
        attackerId: "test-attacker",
        targetId: "test-target",
        weaponId: "longsword",
        attackType: "melee",
        modifiers: ["+2"],
        encounterId: testEncounterId
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.PerformAttack(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.attackerId).toBe("test-attacker");
      expect(response.Data?.targetId).toBe("test-target");
      expect(response.Data?.actionType).toBe("attack");
      expect(response.Data?.results).toBeDefined();
    });

    test("Apply status effect", async () => {
      const dto = await createValidSubmitDTO(ApplyStatusEffectDto, {
        targetId: "test-target",
        effectName: "poisoned",
        duration: 10,
        sourceId: "poison-trap",
        description: "Target is poisoned for 10 rounds",
        effectType: "condition"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.ApplyStatusEffect(dto);
      expect(response).toEqual(transactionSuccess());
    });
  });

  describe("Saving Throws and Skill Checks", () => {
    test("Make a saving throw", async () => {
      const dto = await createValidSubmitDTO(MakeSavingThrowDto, {
        characterId: "test-character",
        saveType: "fortitude",
        difficulty: 15,
        modifiers: ["+3"],
        reason: "Resist poison"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.MakeSavingThrow(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.characterId).toBe("test-character");
      expect(response.Data?.saveType).toBe("fortitude");
      expect(response.Data?.difficulty).toBe(15);
      expect(response.Data?.roll).toBeDefined();
      expect(response.Data?.success).toBeDefined();
    });

    test("Make a skill check", async () => {
      const dto = await createValidSubmitDTO(MakeSkillCheckDto, {
        characterId: "test-character",
        skillName: "athletics",
        difficulty: 10,
        modifiers: ["+5"],
        reason: "Climb a wall"
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.MakeSkillCheck(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.characterId).toBe("test-character");
      expect(response.Data?.skillName).toBe("athletics");
      expect(response.Data?.difficulty).toBe(10);
      expect(response.Data?.roll).toBeDefined();
      expect(response.Data?.success).toBeDefined();
    });
  });

  describe("Spellcasting System", () => {
    test("Cast a spell", async () => {
      const dto = await createValidSubmitDTO(CastSpellDto, {
        casterId: "test-wizard",
        spellId: "magic-missile",
        targetIds: ["test-target"],
        spellLevel: 1,
        spellSlotUsed: 1,
        encounterId: testEncounterId
      });
      await dto.sign(user.privateKey);

      const response = await client.rpg.CastSpell(dto);
      expect(response).toEqual(transactionSuccess());
      expect(response.Data?.casterId).toBe("test-wizard");
      expect(response.Data?.spellId).toBe("magic-missile");
      expect(response.Data?.actionType).toBe("spell");
      expect(response.Data?.results).toBeDefined();
    });
  });

  describe("Advanced Combat Integration", () => {
    test("Complex combat scenario workflow", async () => {
      // This test demonstrates the integration of multiple combat systems
      
      // 1. Roll initiative
      const initiativeDto = await createValidSubmitDTO(RollDiceDto, {
        roller: user.identityKey,
        diceExpression: "1d20+2",
        purpose: "initiative",
        modifiers: ["+2"]
      });
      await initiativeDto.sign(user.privateKey);
      const initiativeRoll = await client.rpg.RollDice(initiativeDto);
      expect(initiativeRoll).toEqual(transactionSuccess());
      
      // 2. Attack roll
      const attackDto = await createValidSubmitDTO(RollDiceDto, {
        roller: user.identityKey,
        diceExpression: "1d20+5",
        purpose: "attack roll",
        modifiers: ["+5"]
      });
      await attackDto.sign(user.privateKey);
      const attackRoll = await client.rpg.RollDice(attackDto);
      expect(attackRoll).toEqual(transactionSuccess());
      
      // 3. Damage roll (if hit)
      if (attackRoll.Data?.total && attackRoll.Data.total >= 10) { // Assume AC 10
        const damageDto = await createValidSubmitDTO(RollDiceDto, {
          roller: user.identityKey,
          diceExpression: "1d8+3",
          purpose: "damage",
          modifiers: ["+3"]
        });
        await damageDto.sign(user.privateKey);
        const damageRoll = await client.rpg.RollDice(damageDto);
        expect(damageRoll).toEqual(transactionSuccess());
      }
      
      // This workflow demonstrates how combat mechanics integrate together
      expect(true).toBe(true);
    });

    test("Verify all combat API methods are available", async () => {
      const api = rpgContractAPI({} as any);
      
      // Core combat methods
      expect(typeof api.RollDice).toBe("function");
      expect(typeof api.CreateEncounter).toBe("function");
      expect(typeof api.CreateParty).toBe("function");
      expect(typeof api.PerformAttack).toBe("function");
      expect(typeof api.ApplyStatusEffect).toBe("function");
      
      // Checks and saves
      expect(typeof api.MakeSavingThrow).toBe("function");
      expect(typeof api.MakeSkillCheck).toBe("function");
      
      // Spellcasting
      expect(typeof api.CastSpell).toBe("function");
    });
  });
});