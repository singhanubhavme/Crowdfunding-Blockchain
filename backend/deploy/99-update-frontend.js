// const { ethers } = require("hardhat");
// const fs = require("fs");

// const FRONTEND_ADDRESS_FILE = "C:/Users/singh/Desktop/Crowdfunding/frontend/constants/contractAddress.json";
// const FRONTEND_ABI_FILE = "C:/Users/singh/Desktop/Crowdfunding/frontend/constants/abi.json";


// async function updateContractAddress() {
//     const funder = await ethers.getContract("Funder");
//     const currentAddress = JSON.parse(fs.readFileSync(FRONTEND_ADDRESS_FILE, "utf8"));
//     currentAddress[5] = [funder.address];
//     fs.writeFileSync(FRONTEND_ADDRESS_FILE, JSON.stringify(currentAddress).toString());
// }

// async function updateAbi() {
//     const funder = await ethers.getContract("Funder");
//     fs.writeFileSync(FRONTEND_ABI_FILE, funder.interface.format(ethers.utils.FormatTypes.JSON).toString());
// }

// module.exports = async function () {
//     if (process.env.UPDATE_FRONTEND) {
//         console.log("Updating frontend...");
//         await updateContractAddress();
//         await updateAbi();
//     }
// }