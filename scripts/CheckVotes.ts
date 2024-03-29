import { sepolia } from "viem/chains";
import * as dotenv from "dotenv";
dotenv.config();
import {
  createPublicClient,
  http,
  createWalletClient,
  hexToString,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { abi } from "../artifacts/contracts/Ballot.sol/Ballot.json";

const providerApiKey = process.env.ALCHEMY_API_KEY || "";
const deployerPrivateKey = process.env.PRIVATE_KEY || "";

async function main() {
  const parameters = process.argv.slice(2);
  if (!parameters || parameters.length < 1)
    throw new Error("Parameters not provided");
  const contractAddress = parameters[0] as `0x${string}`;
  if (!contractAddress) throw new Error("Contract address not provided");
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
    throw new Error("Invalid contract address");
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  const account = privateKeyToAccount(`0x${deployerPrivateKey}`);
  const chairman = createWalletClient({
    account,
    chain: sepolia,
    transport: http(`https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`),
  });
  console.log("Vote results from the contract:", contractAddress);
  const winningProposals = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winningProposal",
    args: [],
  });
  const winner = winningProposals;
  console.log("The number of the proposal that won is: ", winner);

  const winnerName = await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: "winnerName",
    args: [],
  });
  const nameWinner = winnerName as `0x${string}`;
  const winnerHex = hexToString(nameWinner, { size: 32 });
  console.log("The name of the proposal that won is:", winnerHex);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
