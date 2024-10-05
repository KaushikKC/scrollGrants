import { createPublicClient, createWalletClient, custom, http } from "viem";
import { optimismSepolia, scrollSepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";

const account1 = privateKeyToAccount(
  (process.env.NEXT_PUBLIC_PRIVATE_KEY as `0x${string}`) || ""
);

export const opSepoliaClient = createWalletClient({
  chain: optimismSepolia,
  transport: http(),
  account: account1,
});

export const opSepoliaPublicClient = createPublicClient({
  chain: optimismSepolia,
  transport: http(),
});

export const client = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});
