const { ethers, run, network } = require("hardhat");


const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
};

async function main() {
    const Funder = await ethers.getContractFactory("Funder");
    const FUNDER_CONTRACT = await Funder.deploy();

    if (network.config.chainId === 5) {
        await FUNDER_CONTRACT.deployTransaction.wait(5);
        await verify(FUNDER_CONTRACT.address, []);

        // await FUNDER_CONTRACT.deployTransaction.wait(1);
    } else {
        console.log("Deployed on Localhost")
    }
    console.log("Contract deployed to address: ", FUNDER_CONTRACT.address);
}


module.exports = main;