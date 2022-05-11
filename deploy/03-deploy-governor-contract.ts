import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  PROPOSAL_THRESHOLD,
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../hardhat-helper-config";

const deployGovernorContract: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { alice } = await getNamedAccounts();
  const { log, deploy, get } = deployments;

  log("deploying GovernorContract");

  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("TimeLock");

  const governorContract = await deploy("GovernorContract", {
    log: true,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
      PROPOSAL_THRESHOLD,
    ],
    from: alice,
  });

  log("GovernorContract deployed to: ", governorContract.address);
};

export default deployGovernorContract;
deployGovernorContract.tags = ["all", "governorContract"];
