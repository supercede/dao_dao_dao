// Making a proposal

import fs from "fs";
import { ethers, network } from "hardhat";
import {
  DESCRIPTION,
  developmentChains,
  FUNC_ARGS,
  FUNC_NAME,
  PROPOSAL_FILE,
  VOTING_DELAY,
} from "../hardhat-helper-config";
import { moveBlocks } from "../utils/utils";

// address[] memory targets, - box
// uint256[] memory values, - number
// bytes[] memory calldatas, - encodeShit
// string memory description - string

const makeProposal = async (
  functionName: string,
  args: number[],
  description: string
) => {
  console.log("asndjhdj");

  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  console.log("asndjhdjmndwhjkbhjkefbjhkrbvekrhrbvhe");

  const encodedFuntionCalldata = box.interface.encodeFunctionData(
    functionName,
    args
  );

  const proposalTx = await governor.propose(
    [box.address],
    [0],
    [encodedFuntionCalldata],
    description
  );

  const proposalReceipt = await proposalTx.wait(1);

  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposalReceipt.events[0].args.proposalId;

  fs.writeFileSync(
    PROPOSAL_FILE,
    JSON.stringify({
      [network.config.chainId!.toString()]: [proposalId.toString()],
    })
  );

  const proposalState = await governor.state(proposalId);
  // The state of the proposal. 1 is not passed. 0 is passed.
  console.log(`Current Proposal State: ${proposalState}`);
};

makeProposal(FUNC_NAME, [FUNC_ARGS], DESCRIPTION)
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
