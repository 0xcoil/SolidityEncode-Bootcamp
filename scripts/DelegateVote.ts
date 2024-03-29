import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();
import { createPublicClient, http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 2)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const delegatedAddress = parameters[1] as `0x${string}`;
  if (!delegatedAddress) throw new Error("Delegated address not provided");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const delegator = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Welcome chairman! ");
  console.log("Vote delegation from the contract:", contractAddress);
  const delegation = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "chairperson",
    args: [],
  });
  console.log("Delegation status:", delegation);
  console.log("Do you want to delegate your vote to", delegatedAddress, "?");
  console.log("Confirm? (Y/n)");

  const stdin = process.openStdin();
  stdin.addListener("data", async function (d) {
    if (d.toString().trim().toLowerCase() != "n") {
      const hash = await delegator.writeContract({
        address: contractAddress,
        abi,
        functionName: "delegate",
        args: [delegatedAddress],
      });
      console.log("Transaction hash:", hash);
      console.log("Waiting for confirmations...");
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      console.log(delegatedAddress, "has been delegated to vote");
      // console.log(receipt);, can be used to get more infos about the Tx
    } else {
      console.log("Operation cancelled");
    }
    process.exit();
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
