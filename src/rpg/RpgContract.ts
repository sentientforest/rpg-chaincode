import { GalaContract } from "@gala-chain/chaincode";
import { plainToInstance } from "class-transformer";
import { Info } from "fabric-contract-api";

import { version } from "../../package.json";

const curatorOrgMsp = process.env.CURATOR_ORG_MSP ?? "CuratorOrg";

@Info({ title: "Rpg", description: "Contract for role playing games" })
export default class RpgContract extends GalaContract {
  constructor() {
    super("Rpg", version);
  }
}