import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../hardhat-helper-config";

// get all contratcs
// get timeLock Roles
// GrantRolesTX - PROPOSER (GOVERNOR CONTRACT), EXECUTOR(0x0000000000000000000000000000000000000000)
// Revoke Admin Role

const setupGovernanceContract: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { alice } = await getNamedAccounts();
  const { log } = deployments;

  const timeLock = await ethers.getContract("TimeLock", alice);
  const governor = await ethers.getContract("GovernorContract", alice);

  const PROPOSER_ROLE = await timeLock.PROPOSER_ROLE();
  const EXECUTOR_ROLE = await timeLock.EXECUTOR_ROLE();
  const ADMIN_ROLE = await timeLock.TIMELOCK_ADMIN_ROLE();

  log("Granting Roles...");
  const proposerTx = await timeLock.grantRole(PROPOSER_ROLE, governor.address);
  await proposerTx.wait(1);

  //   Anyone can execute
  const executorTx = await timeLock.grantRole(EXECUTOR_ROLE, ADDRESS_ZERO);
  await executorTx.wait(1);

  const adminTx = await timeLock.revokeRole(ADMIN_ROLE, alice);
  await adminTx.wait(1);

  log("Roles set up completed");
};

export default setupGovernanceContract;
setupGovernanceContract.tags = ["all", "setupGovernance"];
