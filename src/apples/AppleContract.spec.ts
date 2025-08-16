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
import { fixture, transactionErrorMessageContains, transactionSuccess, writesMap } from "@gala-chain/test";
import { plainToInstance } from "class-transformer";

import { AppleTree, AppleTreeDto, PickAppleDto, Variety } from "../apples";
import { AppleContract } from "./AppleContract";

it("should allow to plant a tree", async () => {
  // Given
  const user = { ...ChainUser.withRandomKeys(), roles: [...UserProfile.DEFAULT_ROLES] };
  const { contract, ctx, getWrites } = fixture(AppleContract).registeredUsers(user);
  const dto = await createValidSubmitDTO(AppleTreeDto, { variety: Variety.GALA, index: 1 }).signed(
    user.privateKey
  );
  const expectedTree = new AppleTree(user.identityKey, dto.variety, dto.index, ctx.txUnixTime);

  // When
  const response = await contract.PlantTree(ctx, dto);

  // Then
  expect(response).toEqual(transactionSuccess());
  expect(getWrites()).toEqual(writesMap(expectedTree));
});

it("should fail to plant a tree if tree already exists", async () => {
  // Given
  const user = { ...ChainUser.withRandomKeys(), roles: [...UserProfile.DEFAULT_ROLES] };

  const { contract, ctx, getWrites } = fixture(AppleContract)
    .registeredUsers(user)
    .savedState(new AppleTree(user.identityKey, Variety.GOLDEN_DELICIOUS, 1, 0));

  // When
  const dto = await createValidSubmitDTO(AppleTreeDto, {
    variety: Variety.GOLDEN_DELICIOUS,
    index: 1
  }).signed(user.privateKey);
  const response = await contract.PlantTree(ctx, dto);

  // Then
  expect(response).toEqual(transactionErrorMessageContains("Tree already exists"));
  expect(getWrites()).toEqual({});
});

it("should allow to pick apples", async () => {
  // Given
  const user = { ...ChainUser.withRandomKeys(), roles: [...UserProfile.DEFAULT_ROLES] };
  const twoYearsAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 365 * 2).getTime();
  const existingTree = new AppleTree(user.identityKey, Variety.GALA, 1, twoYearsAgo);
  const { contract, ctx, getWrites } = fixture(AppleContract).registeredUsers(user).savedState(existingTree);

  const dto = await createValidSubmitDTO(PickAppleDto, {
    PlantedBy: existingTree.plantedBy,
    variety: existingTree.variety,
    index: existingTree.index
  }).signed(user.privateKey);

  // When
  const response = await contract.PickApple(ctx, dto);

  // Then
  expect(response).toEqual(transactionSuccess());
  expect(getWrites()).toEqual(
    writesMap(
      plainToInstance(AppleTree, {
        ...existingTree,
        applesPicked: existingTree.applesPicked.plus(1)
      })
    )
  );
});
