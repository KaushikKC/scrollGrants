import { createPublicClient, createWalletClient, http } from "viem";
import { optimismSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(
  (process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`) || ""
);

export const opSepoliaClient = createWalletClient({
  chain: optimismSepolia,
  transport: http(),
  account,
});

export const opSepoliaPublicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
});
