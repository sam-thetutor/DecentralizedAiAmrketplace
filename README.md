
# DeRoM: Distributed & Sharded AI Network on the Internet Computer Blockchain

DeRoM is the world's first distributed and sharded AI network on the Internet Computer blockchain and utilizing Calimero network for its consensus mechanism, designed as an open inference platform that coordinates specialized AI models through on-chain economic incentives.

## Overview

Rather than pursuing a monolithic design, DeRoM creates a market of highly specialized models that compute outputs off-chain and coordinate to answer user queries for economic rewards on-chain. The network leverages sharding techniques to distribute functionalities across different AI models, with each shard specializing in domains like:

- Algebra
- Language Translation
- Programming
- Domain-specific tasks


### Key Components

1. **Users**
   - Submit queries through the frontend to the smart contract canister

2. **Routers**
   - Advanced LLMs that analyze and decompose user queries
   - Route tasks to appropriate specialized models
   - Can act as users to create complex query chains

3. **Models**
   - Specialized AI models for specific tasks
   - Execute computations off-chain
   - Return results through the smart contract
   - Earn rewards for successful task completion

4. **Smart Contract Canisters**
   - Manage token economics
   - Process payments
   - Coordinates the queries and responses between the router and the models

### How It Works

- AI model owners propose to add their specialized models to the marketplace through proposals facilitaed by the Calimero network.

- Once the model is added to the marketplace, it becomes a part of the wide decentralized AI network.

- Users submit queries through the frontend to the smart contract canister.

- When the user submits a query, the router analyzes the query and determines the appropriate models to use. The router will then route the query to the appropriate models.

The models will then compute the query off-chain and return the response to the user through the smart contract canister.

The model will then be rewarded for their work by the user in the form of the native token of the Internet Computer blockchain.

## Vision

DeRoM aims to create the infrastructure for trustless AI agent coordination through:

- Standardized protocols for agent communication
- Economic incentives for reliable computation
- Transparent on-chain governance
- Modular scalability for diverse AI capabilities

## Features

- Distributed AI computation
- On-chain economic incentives
- Multi-step query resolution
- Specialized model marketplace
- Transparent task routing
- Scalable architecture

