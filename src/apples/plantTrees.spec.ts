/*
 * Copyright (c) Gala Games Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ChainUser, UserProfile, createValidSubmitDTO } from "@gala-chain/api";
import { fixture, writesMap } from "@gala-chain/test";

import { AppleContract } from "./AppleContract";
import { AppleTree } from "./AppleTree";
import { AppleTreeDto, AppleTreesDto } from "./dtos";
import { Variety } from "./types";

it("should allow to plant trees", async () => {
  // Given
  const user = { ...ChainUser.withRandomKeys(), roles: [...UserProfile.DEFAULT_ROLES] };

  const { contract, ctx, getWrites } = fixture(AppleContract).registeredUsers(user);

  const trees = [
    await createValidSubmitDTO(AppleTreeDto, { variety: Variety.GALA, index: 1 }),
    await createValidSubmitDTO(AppleTreeDto, { variety: Variety.MCINTOSH, index: 2 })
  ];
  const dto = await createValidSubmitDTO(AppleTreesDto, { trees }).signed(user.privateKey);

  // When
  await contract.PlantTrees(ctx, dto);

  // Then
  const expectedTrees = dto.trees.map(
    (t) => new AppleTree(user.identityKey, t.variety, t.index, ctx.txUnixTime)
  );

  await ctx.stub.flushWrites();
  expect(getWrites()).toEqual(writesMap(...expectedTrees));
});
