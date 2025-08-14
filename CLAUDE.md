# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GalaChain blockchain chaincode project for implementing RPG (Role Playing Game) mechanics. It's built on Hyperledger Fabric and uses the GalaChain SDK to create smart contracts for managing game assets and character data.

## Key Technologies

- **GalaChain SDK** (`@gala-chain/chaincode`, `@gala-chain/api`)
- **TypeScript** with strict typing
- **Hyperledger Fabric** for blockchain infrastructure
- **Jest** for testing
- **Class-transformer** and **class-validator** for DTOs

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

1. **AppleContract** (`src/apples/`) - Example contract for game asset management
   - Plant trees, pick apples, fetch tree data
   - Demonstrates basic CRUD operations

2. **RpgContract** (`src/rpg/`) - Core RPG mechanics (in development)
   - Character creation and management
   - Ancestry, class, and trait data systems
   - Uses component-based architecture for character attributes

3. **GalaChainTokenContract** (`src/token/`) - Token management functionality

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