# Ballot contract interaction guide

# Setup
1. Installation: Run ```npm install``` to install necessary dependencies.

2. Create a ```.env``` file at the root with:

    ``` PRIVATE_KEY= your PrivateKey ``` for the deployer.

    ``` ALCHEMY_API_KEY= your AlchemyApiKey ``` for network access via Alchemy.

3. Security: Never commit your .env file to version control.

# Deploying the Ballot Contract
* Compile the contract: ```npx hardhat compile```.
Deploy by running: ```npx ts-node --files ./scripts/DeployWithViem.ts "Chocolate" "Pear" "Peach" "Strawberry".``` (example of propositions)

# Giving Voting Rights
* To grant voting rights, execute: ```npx ts-node --files ./scripts/GiveRightToVote.ts <contractAddress> <voterAddress>.```
Ensure execution by the deployer.

# Voting
* Cast a vote by executing script CastVote.ts with: ```npx ts-node --files scripts/CastVote.ts <contractAddress> <proposalIndex>.```
Replace placeholders with the contract's address and the chosen proposal index.

# Delegate Vote
* Execute script DelegateVote.ts with the Private Key in .env, that holds voting rights. In the CLI specifiy the address that you want to delegate to:
* ```npx ts-node --files ./scripts/DelegateVote.ts <contractAddress> <AddressOfTheWalletYouWantToDelegate>.```

# Get winning proposal
* Execute script GetWinningProposal.ts. In the CLI specifiy the contract address:
* ```npx ts-node --files ./scripts/GetWinningProposal.ts <contractAddress>.```

# Notes
* Safeguard your private keys and carefully manage .env contents.
