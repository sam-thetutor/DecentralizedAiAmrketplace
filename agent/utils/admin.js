import { Ed25519KeyIdentity } from '@dfinity/identity';
import { mnemonicToSeedSync } from "bip39";

const mnemonicToId = (mnemonic) => {
    var seed = mnemonicToSeedSync(mnemonic);
    seed = Array.from(seed);
    seed = seed.splice(0, 32);
    seed = new Uint8Array(seed);
    let rr = Ed25519KeyIdentity.generate(seed)
    console.log("admin :",rr.getPrincipal()?.toString())
    return rr ;
}

export const adminIdentity = mnemonicToId(process.env.ADMIN_SEED_PHRASE);