import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../hardhat-helper-config";

const deployBox: DeployFunction = async ({
  getNamedAccounts,
  deployments,
}: HardhatRuntimeEnvironment) => {
  const { alice } = await getNamedAccounts();
  const { log, get, deploy } = deployments;

  log("Deploying Box");

  const box = await deploy("Box", {
    from: alice,
    log: true,
    args: [],
  });

  log("Deployed Box to:", box.address);
  //   transfer ownership to timeLock

  const timeLock = await ethers.getContract("TimeLock");
  const boxContract = await ethers.getContractAt("Box", box.address);

  const transferTx = await boxContract.transferOwnership(timeLock.address);
  await transferTx.wait(1);

  log("Ownership of Box contract transferred to: ", timeLock.address);
};

export default deployBox;
deployBox.tags = ["all", "box"];
