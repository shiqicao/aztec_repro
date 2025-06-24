import { createAztecNodeClient, createLogger, createPXEClient, Fr, PXE, waitForPXE, type AuthWitnessProvider, type CompleteAddress, type ContractArtifact } from "@aztec/aztec.js";
import { Wallet } from "ethers";
import { getEcdsaKAccount } from "@aztec/accounts/ecdsa";
import { randomBytes } from "@aztec/foundation/crypto";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import { deriveSigningKey } from "@aztec/stdlib/keys";

const logger = createLogger("aztec:prototype");

async function run() {
    const pxe = createPXEClient("http://localhost:8080");
    const node = createAztecNodeClient("http://localhost:8080");
    await waitForPXE(pxe);

    const testWallet = (await getInitialTestAccountsWallets(pxe))[0]


    const secretKey = Fr.random();
    logger.info(`Secret key: ${secretKey.toString()}`);

    const ethWallet = Wallet.createRandom();

    logger.info(`Eth wallet address: ${ethWallet.privateKey}`);

    const account = await getEcdsaKAccount(pxe, secretKey, randomBytes(32), 0);
    //const account = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), 0);


    const address = account.getAddress();
    logger.info(`Account address: ${address.toString()}`);

    const contract = await node.getContract(address);
    logger.info(`Contract address: ${ contract ? contract.address.toString() : "not deployed"}`);

    if (!contract) {
        logger.info("Deploying account contract...");
        const wallet = await account.deploy({
            skipPublicDeployment: false,
            deployWallet: testWallet,
        }).getWallet();
        logger.info(`Deployed account wallet address: ${wallet.getAddress()}`);

        const contract = await node.getContract(address);
        logger.info(`Contract address: ${ contract ? contract.address.toString() : "not deployed"}`);
    }
}

run()
