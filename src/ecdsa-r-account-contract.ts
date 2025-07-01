import { DefaultAccountContract } from "@aztec/accounts/defaults";
import { EcdsaRAccountContractArtifact } from "@aztec/accounts/ecdsa";
import {
  AuthWitness,
  type AuthWitnessProvider,
  type ContractArtifact,
  type Fr,
} from "@aztec/aztec.js";

export type Signer = (message: Buffer) => Promise<string>;

export class EcdsaRAccountContract extends DefaultAccountContract {
  readonly #pubKeyX: Buffer;
  readonly #pubKeyY: Buffer;
  readonly #signer: Signer;

  constructor(signer: Signer, uncompressedPubKey: string) {
    super();
    this.#signer = signer;
    const { x: pubKeyX, y: pubKeyY } = pubKeyToPoint(uncompressedPubKey);
    this.#pubKeyX = pubKeyX;
    this.#pubKeyY = pubKeyY;
  }

  getContractArtifact(): Promise<ContractArtifact> {
    return Promise.resolve(EcdsaRAccountContractArtifact);
  }

  getDeploymentFunctionAndArgs() {
    return Promise.resolve({
      constructorName: "constructor",
      constructorArgs: [this.#pubKeyX, this.#pubKeyY],
    });
  }

  getAuthWitnessProvider(): AuthWitnessProvider {
    const signer = this.#signer;
    return {
      async createAuthWit(messageHash: Fr): Promise<AuthWitness> {
        const signature = await signer(messageHash.toBuffer());
        return new AuthWitness(messageHash, [
          ...Buffer.from(signature.slice(2, 65), "hex"),
          ...Buffer.from(signature.slice(66, 129), "hex"),
        ]);
      },
    };
  }
}

function pubKeyToPoint(pubKeyHex: string): { x: Buffer; y: Buffer } {
  let hex = pubKeyHex.startsWith("0x") ? pubKeyHex.slice(2) : pubKeyHex;
  if (hex.startsWith("04") && hex.length === 130) {
    hex = hex.slice(2);
  }
  if (hex.length !== 128) {
    throw new Error("Invalid uncompressed public key length");
  }

  const xHex = hex.slice(0, 64);
  const yHex = hex.slice(64, 128);

  return {
    x: Buffer.from(xHex, "hex"),
    y: Buffer.from(yHex, "hex"),
  };
}
