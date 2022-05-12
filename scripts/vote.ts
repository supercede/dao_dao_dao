import fs from "fs";
import { network, ethers } from "hardhat";
import {
  developmentChains,
  PROPOSAL_FILE,
  VOTE_YES,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import { moveBlocks } from "../utils/utils";

export default async function vote() {
  const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf-8"));
  const proposalId = proposals[network.config.chainId!][0];

  const governor = await ethers.getContract("GovernorContract");

  const voteTx = await governor.castVoteWithReason(
    proposalId,
    VOTE_YES,
    "Stuff"
  );

  await voteTx.wait(1);

  //   should be active
  let proposalState = await governor.state(proposalId);
  console.log(`Proposal State before voting period is over: ${proposalState}`);

  // Move time forward past the VOTING_PERIOD
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  //   should be succeeded
  proposalState = await governor.state(proposalId);
  console.log(`Proposal State after voting period is over: ${proposalState}`);
  console.log("Voting complete.");
}

vote()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
