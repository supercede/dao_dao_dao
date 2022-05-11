import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { alice } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying GovernanceToken");

  const governanceToken = await deploy("GovernanceToken", {
    from: alice,
    args: [],
    log: true,
    // waitConfirmations: 3
  });

  log(`GovernanceToken deployed at ${governanceToken.address} `);

  await delegate(governanceToken.address, alice);
  console.log("Delegated successfully");
};

const delegate = async (governanceTokenAddress: string, delegatee: string) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );

  const delegateTx = await governanceToken.delegate(delegatee);
  await delegateTx.wait(1);

  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatee)}`
  );
};

export default deployGovernanceToken;
deployGovernanceToken.tags = ["all", "governanceToken"];
