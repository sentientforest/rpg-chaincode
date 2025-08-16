# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GalaChain blockchain chaincode project for implementing RPG (Role Playing Game) mechanics. 
It's built on Hyperledger Fabric and uses the GalaChain SDK to create smart contracts for managing game assets and character data.

It is intended to replicate aspects of the Pathfinder Role Player Game mechanics licensed by Paizo under the Open RPG License (ORC) license. A copy of the ORC license is provided 
in the repository at ORC_LICENSE.md. 

Initial goals of the project include character creation (assignment of attributes, ancestries, skills, classes, backgrounds and other character details), on-chain equipment (treasure, weapons, armor, gold/silver in-game currencies, etc.), and recording of events and encounters. 

## Key Technologies

- **GalaChain SDK** (`@gala-chain/chaincode`, `@gala-chain/api`)
- **TypeScript** with strict typing
- **Hyperledger Fabric** for blockchain infrastructure
- **Jest** for testing
- **Class-transformer** and **class-validator** for DTOs

## Repository Structure

- **src** - main source code for rpg-chaincode
- **e2e** - end-to-end integration tests designed to execute against a running network
- **ctx** - contextual documentation. Write plans, specs, designs, worklogs, implementation checklists, etc. to this directory. Prefix files with a datestamp in the format YYYYMMDD_ e.g. `20250814_` for August 14th, 2025
- **ext** - external resources. Read-Only. Used to easily reference files for agents with `@ext/path/to/file` syntax. Do not commit resources in this directory to version control, but do not .gitignore them either for easier reference. 

## Important Context

Assuming the `ext` directory is properly initialized with copies of important resources:

- @ext/galachain-sdk/docs/concepts/facts-not-objects.md
- @ext/galachain-sdk/docs/concepts/create-read-update-delete.md
- @ext/galachain-sdk/docs/concepts/chain-key-design.md
- @ext/galachain-sdk/docs/concepts/identities-wallets-accounts.md
- @ext/galachain-sdk/docs/concepts/smart-contracts-chaincode.md

## Development Commands

### Building and Development
```bash
npm run build          # Compile TypeScript to JavaScript
npm run build:watch    # Compile with file watching
npm run clean          # Clean build artifacts
```

### Code Quality
```bash
npm run lint           # Run ESLint
npm run fix            # Auto-fix ESLint issues
npm run format         # Format code with Prettier
```

### Testing
```bash
npm test               # Run unit tests
npm run test:e2e       # Run end-to-end tests
npm run update-snapshot # Update Jest snapshots
```

### Network Management
```bash
npm run network:start    # Start local blockchain network with watching
npm run network:up       # Start network with contracts
npm run network:prune    # Clean up network
npm run network:recreate # Full network reset and restart
```

### Running a Single Test
```bash
npx jest path/to/test.spec.ts              # Run specific test file
npx jest path/to/test.spec.ts -t "test name" # Run specific test by name
```

## Architecture

### Contract Structure
The project implements multiple smart contracts that extend `GalaContract`:

2. **RpgContract** (`src/rpg/`) - Core RPG mechanics (in development)
   - Character creation and management
   - Ancestry, class, and trait data systems
   - Uses component-based architecture for character attributes

3. **GalaChainTokenContract** (`src/token/`) - Token management functionality for both fungible and non-fungible tokens

4. **PublicKeyContract** (`src/pk/`) - Public key management

### Key Patterns

- **DTO Pattern**: All contract methods use Data Transfer Objects for input/output
  - DTOs are in `dtos.ts` files or `types/` directories
  - Use `class-transformer` and `class-validator` for validation

- **Separation of Concerns**: Contract methods delegate to separate function files
  - Contract classes handle decorators and method signatures
  - Business logic is in separate files (e.g., `plantTrees.ts`, `fetchTrees.ts`)

- **Submit vs Evaluate**: 
  - `@Submit` decorator for state-changing transactions
  - `@Evaluate` decorator for read-only queries

### Testing Approach
- Unit tests alongside source files (`*.spec.ts`)
- E2E tests in `e2e/` directory
- Snapshot testing for API responses
- Mock GalaChainContext for unit testing

## Important Considerations

- **Curator Organization**: Uses `CURATOR_ORG_MSP` environment variable (defaults to "CuratorOrg")
- **Versioning**: Contract versions are pulled from `package.json`
- **License**: Uses Open RPG Creative (ORC) license for game mechanics
- **State Management**: All state changes must go through Submit transactions
- **Context**: All contract methods receive `GalaChainContext` as first parameter