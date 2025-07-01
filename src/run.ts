import { AccountManager, createAztecNodeClient, createLogger, createPXEClient, FeePaymentMethod, Fr, getContractInstanceFromDeployParams, PXE, SponsoredFeePaymentMethod, waitForPXE, type AuthWitnessProvider, type CompleteAddress, type ContractArtifact } from "@aztec/aztec.js";
import { Wallet } from "ethers";
import { getEcdsaKAccount } from "@aztec/accounts/ecdsa";
import { randomBytes } from "@aztec/foundation/crypto";
import { getInitialTestAccountsWallets } from "@aztec/accounts/testing";
import { getSchnorrAccount } from "@aztec/accounts/schnorr";
import { deriveSigningKey } from "@aztec/stdlib/keys";
import { log } from "console";
import { EcdsaRAccountContract } from "./ecdsa-r-account-contract.js";
import { SponsoredFPCContract } from "@aztec/noir-contracts.js/SponsoredFPC";
import { SPONSORED_FPC_SALT } from "@aztec/constants";

const logger = createLogger("aztec:prototype");

async function getSponsoredFeePaymentMethod(pxe: PXE): Promise<FeePaymentMethod> {
    const fpcInstance = await getContractInstanceFromDeployParams(
      SponsoredFPCContract.artifact,
      {
        salt: new Fr(SPONSORED_FPC_SALT),
      },
    );

    await pxe.registerContract({
      instance: fpcInstance,
      artifact: SponsoredFPCContract.artifact,
    });

    return new SponsoredFeePaymentMethod(fpcInstance.address);

}

async function run() {
    const pxe = createPXEClient("http://localhost:8080");
    const node = createAztecNodeClient("http://localhost:8080");
    await waitForPXE(pxe);

    const testWallet = (await getInitialTestAccountsWallets(pxe))[0]


    const secretKey = Fr.random();
    logger.info(`Secret key: ${secretKey.toString()}`);

    const ethWallet = Wallet.createRandom();
    ethWallet.signMessage
    ethWallet.publicKey

    logger.info(`Eth private key: ${ethWallet.privateKey}`);
    logger.info(`Eth public key: ${ethWallet.signingKey.publicKey}`);

    //const account = await getEcdsaKAccount(pxe, secretKey, Buffer.from(ethWallet.privateKey, "hex"), 0);
    //const account = await getSchnorrAccount(pxe, secretKey, deriveSigningKey(secretKey), 0);
    const account = await AccountManager.create(
        pxe,
        secretKey,
        new EcdsaRAccountContract(ethWallet.signMessage.bind(ethWallet), ethWallet.signingKey.publicKey),
        0,
    );


    const address = account.getAddress();
    logger.info(`Account address: ${address.toString()}`);

    const meta = await pxe.getContractMetadata(address);
    logger.info(`account initialized: ${meta.isContractInitialized ? "yes" : "no"}`);
    logger.info(`account publicly deployed: ${meta.isContractPubliclyDeployed ? "yes" : "no"}`);

    if (!meta.isContractInitialized) {
        const feePaymentMethod = await getSponsoredFeePaymentMethod(pxe);

        logger.info("Deploying account contract...");
        const wallet = await account.deploy({
            skipPublicDeployment: true,
            //deployWallet: testWallet,
            fee: { paymentMethod:  feePaymentMethod},
        }).getWallet();
        logger.info(`Deployed account wallet address: ${wallet.getAddress()}`);


        const meta = await pxe.getContractMetadata(address);
        logger.info(`account initialized: ${meta.isContractInitialized ? "yes" : "no"}`);
        logger.info(`account publicly deployed: ${meta.isContractPubliclyDeployed ? "yes" : "no"}`);
    }
}

run()
