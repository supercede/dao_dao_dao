import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { EXECUTORS, MIN_DELAY, PROPOSERS } from "../hardhat-helper-config";

const deployTimeLock: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { alice } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying TimeLock");

  const timeLock = await deploy("TimeLock", {
    from: alice,
    args: [MIN_DELAY, PROPOSERS, EXECUTORS],
    log: true,
  });

  log(`Successfully deployed TimeLock contract at ${timeLock.address}`);
};

export default deployTimeLock;
deployTimeLock.tags = ["all", "timeLock"];
