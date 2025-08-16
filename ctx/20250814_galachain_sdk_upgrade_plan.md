# GalaChain SDK Upgrade Plan: 1.x → 2.4.2

**Date:** 2025-08-14  
**Goal:** Upgrade from GalaChain SDK 1.4.10 to 2.4.2 without breaking existing functionality

## Analysis Summary

Based on analysis of the current codebase and the BREAKING_CHANGES.md documentation, this is a significant upgrade that requires changes across the entire codebase. The current implementation uses v1.x patterns that are no longer supported in v2.x.

### Current State Assessment

**Dependencies (package.json):**
- `@gala-chain/api`: 1.4.10 → 2.4.2
- `@gala-chain/chaincode`: 1.4.10 → 2.4.2
- `@gala-chain/cli`: 1.4.10 → 2.4.2
- `@gala-chain/client`: 1.4.10 → 2.4.2
- `@gala-chain/test`: 1.4.10 → 2.4.2

**Current Architecture:**
- 4 main contracts: AppleContract, RpgContract, GalaChainTokenContract, PublicKeyContract
- Uses `ChainCallDTO` for all DTOs
- Uses v1.x test patterns with `fixture().callingUser(userIdentityKey)`
- Uses `.signed(privateKey)` in e2e tests (already v2-style!)
- No explicit authorization roles or allowedOrgs usage found yet

## Major Breaking Changes to Address

### 1. Authentication & Authorization Revolution
**Impact:** HIGH - All methods that update chain state must be signed

**Current:** CA-based authentication, optional signatures  
**New:** Mandatory signature-based authentication for all Submit operations

**Changes Required:**
- All `@Submit` methods must verify signatures
- Replace any `allowedOrgs` with `allowedRoles` 
- Update user registration to assign proper roles
- Migrate existing users if any production data exists

### 2. DTO Architecture Changes
**Impact:** HIGH - All Submit DTOs need restructuring

**Current:** `ChainCallDTO` base class for all DTOs  
**New:** `SubmitCallDTO` for Submit operations, enforces `uniqueKey` field

**Changes Required:**
- Convert Submit DTOs from `ChainCallDTO` → `SubmitCallDTO`
- Add `uniqueKey` validation to all Submit DTOs
- Update DTO creation patterns to use `createValidSubmitDTO()`

### 3. Test Framework Overhaul
**Impact:** HIGH - All unit tests need updates

**Current:** `fixture().callingUser(userIdentityKey).savedState()`  
**New:** `fixture().registeredUsers(userObject).savedState()` with signed DTOs

**Changes Required:**
- Update all test fixtures to use new patterns
- Replace `writes` with `getWrites()`
- Use `registeredUsers()` instead of `callingUser()`
- Sign all DTOs in tests with user private keys

### 4. User Field Validation
**Impact:** MEDIUM - User-related fields need stronger typing

**Current:** String fields for user references  
**New:** Dedicated `@IsUserAlias` and `@IsUserRef` validation

**Changes Required:**
- Update DTOs with user fields to use proper decorators
- Replace string user references with typed equivalents

## Implementation Strategy

### Phase 1: Dependency & Build Foundation
1. **Update package.json dependencies** to 2.4.2 versions
2. **Fix immediate import/compilation issues** 
3. **Ensure basic build works** before proceeding

### Phase 2: DTO Transformation
1. **Convert Submit DTOs** from `ChainCallDTO` to `SubmitCallDTO`
2. **Add uniqueKey requirements** to all Submit operations  
3. **Update user field validation** with proper decorators
4. **Fix any remaining compilation errors**

### Phase 3: Test Framework Migration  
1. **Update unit test patterns** to use v2 fixture style
2. **Update e2e tests** (should be minimal since already using .signed())
3. **Verify all tests pass** with new patterns

### Phase 4: Authorization & Security
1. **Review and update authorization** patterns if any exist
2. **Ensure all Submit methods** properly verify signatures
3. **Test signature verification** works as expected

### Phase 5: Validation & Documentation
1. **Run full test suite** and fix any remaining issues
2. **Run linting** and address code style issues  
3. **Verify build/deployment** still works correctly
4. **Document migration process** for future reference

## Detailed File Change Requirements

### Package Dependencies
```json
{
  "@gala-chain/api": "2.4.2",
  "@gala-chain/chaincode": "2.4.2", 
  "@gala-chain/cli": "2.4.2",
  "@gala-chain/client": "2.4.2",
  "@gala-chain/test": "2.4.2"
}
```

### DTO Updates Required
**Files to modify:**
- `src/apples/dtos.ts` - AppleTreeDto, AppleTreesDto, PickAppleDto
- `src/rpg/types/PlayerCharacterDto.ts` - PlayerCharacterDto  
- Any other DTOs used with `@Submit` methods

**Changes:**
```typescript
// OLD (v1)
export class AppleTreeDto extends ChainCallDTO {
  // ...
}

// NEW (v2) 
export class AppleTreeDto extends SubmitCallDTO {
  // ... existing fields plus automatic uniqueKey validation
}
```

### Test Pattern Updates
**Files to modify:**
- `src/apples/AppleContract.spec.ts`
- All `*.spec.ts` files

**Changes:**
```typescript
// OLD (v1)
const { contract, ctx, writes } = fixture(AppleContract)
  .callingUser(user.identityKey)
  .savedState(existingTree);

const dto = new AppleTreeDto(Variety.GALA, 1);
const response = await contract.PlantTree(ctx, dto);
expect(writes).toEqual(writesMap(expectedTree));

// NEW (v2)
const { contract, ctx, getWrites } = fixture(AppleContract)
  .registeredUsers(user)
  .savedState(existingTree);

const dto = await createValidSubmitDTO(AppleTreeDto, { variety: Variety.GALA, index: 1 })
  .signed(user.privateKey);
const response = await contract.PlantTree(ctx, dto);
expect(getWrites()).toEqual(writesMap(expectedTree));
```

### E2E Test Updates
**Files to modify:**
- `e2e/apples.spec.ts` - Already using `.signed()` so minimal changes
- Other e2e test files

**Changes:**
- Ensure all DTOs use `createValidSubmitDTO` for Submit operations
- Verify signature patterns are correct

## Risk Assessment

**HIGH RISK:**
- Breaking changes in core authentication mechanism
- Complete test framework overhaul required
- DTO base class changes affect all Submit operations

**MEDIUM RISK:**  
- New validation patterns may catch previously unvalidated data
- Build process might need adjustments

**LOW RISK:**
- E2E tests already use v2-style signing patterns
- No complex authorization roles currently in use
- No production data migration concerns (development project)

## Success Criteria

1. ✅ All dependencies updated to 2.4.2
2. ✅ Codebase compiles without errors  
3. ✅ All unit tests pass with new patterns
4. ✅ All e2e tests pass
5. ✅ Linting passes without issues
6. ✅ Network can start and deploy chaincode successfully
7. ✅ Sample transactions work end-to-end

## Next Steps

1. Start with Phase 1: Update dependencies and fix immediate build issues
2. Systematically work through each phase
3. Test thoroughly after each phase before proceeding
4. Document any unexpected issues or additional changes required

---

*This plan provides a comprehensive roadmap for upgrading to GalaChain SDK 2.4.2 while maintaining existing functionality and following v2 best practices.*