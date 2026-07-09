import {
  createPublicClient,
  createWalletClient,
  custom,
  formatUnits,
  http,
  parseUnits,
  type Address,
  type Hash,
  type PublicClient,
  type WalletClient,
} from 'viem';
import { ERC20_ABI, GAMIXP_ABI, TREASURY_ABI } from './abis';
import {
  GAMIXP_PRECOMPILE,
  GAMI_TREASURY_PRECOMPILE,
  GAMI_RPC_URL,
  SUPPORTED_TOKENS,
  gamiChain,
  type TokenSymbol,
} from './config';
import type { BudgetCheck, SwapQuote, TokenBalance, UserStats } from './types';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export class GamiWallet {
  private publicClient: PublicClient | null = null;
  private walletClient: WalletClient | null = null;
  private connectedAddress: Address | null = null;
  private rpcUrl: string;

  constructor(rpcUrl = GAMI_RPC_URL) {
    this.rpcUrl = rpcUrl;
  }

  async connect(options?: { socialIdentity?: string }): Promise<Address> {
    if (options?.socialIdentity) {
      return this.connectViaAA(options.socialIdentity);
    }

    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('No Web3 wallet found. Install MetaMask or use social login.');
    }

    this.publicClient = createPublicClient({
      chain: gamiChain,
      transport: custom(window.ethereum),
    });

    this.walletClient = createWalletClient({
      chain: gamiChain,
      transport: custom(window.ethereum),
    });

    const [address] = await this.walletClient.requestAddresses();
    this.connectedAddress = address;
    return address;
  }

  async connectViaAA(socialIdentity: string): Promise<Address> {
    const hash = await this.hashSocialIdentity(socialIdentity);
    const address = `0x${hash.slice(0, 40)}` as Address;

    this.publicClient = createPublicClient({
      chain: gamiChain,
      transport: http(this.rpcUrl),
    });

    this.connectedAddress = address;
    return address;
  }

  async connectReadOnly(address: Address, options?: { rpcUrl?: string }): Promise<Address> {
    this.publicClient = createPublicClient({
      chain: gamiChain,
      transport: http(options?.rpcUrl ?? this.rpcUrl),
    });
    this.connectedAddress = address;
    return address;
  }

  private async hashSocialIdentity(identity: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(identity);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  async getTokenBalance(token: TokenSymbol): Promise<TokenBalance> {
    if (!this.publicClient || !this.connectedAddress) {
      throw new Error('Wallet not connected');
    }

    const config = SUPPORTED_TOKENS[token];
    let balanceRaw: bigint;

    if (config.isNative) {
      balanceRaw = await this.publicClient.getBalance({ address: this.connectedAddress });
    } else if (config.address) {
      balanceRaw = (await this.publicClient.readContract({
        address: config.address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [this.connectedAddress],
      })) as bigint;
    } else {
      balanceRaw = 0n;
    }

    return {
      symbol: token,
      name: config.name,
      balance: formatUnits(balanceRaw, config.decimals),
      balanceRaw,
      decimals: config.decimals,
    };
  }

  async getAllBalances(): Promise<TokenBalance[]> {
    const symbols = Object.keys(SUPPORTED_TOKENS) as TokenSymbol[];
    return Promise.all(symbols.map((s) => this.getTokenBalance(s)));
  }

  async sendTransfer(to: Address, amount: string, token: TokenSymbol): Promise<Hash> {
    if (!this.walletClient || !this.connectedAddress) {
      throw new Error('Wallet not connected for signing');
    }

    const config = SUPPORTED_TOKENS[token];
    const amountWei = parseUnits(amount, config.decimals);

    if (config.isNative) {
      return this.walletClient.sendTransaction({
        account: this.connectedAddress,
        to,
        value: amountWei,
        chain: gamiChain,
      });
    }

    if (!config.address) {
      throw new Error(`Token ${token} has no contract address`);
    }

    return this.walletClient.writeContract({
      account: this.connectedAddress,
      address: config.address,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, amountWei],
      chain: gamiChain,
    });
  }

  async waitForTransaction(txHash: Hash): Promise<{ status: 'success' | 'reverted' }> {
    if (!this.publicClient) {
      throw new Error('Public client not initialized');
    }
    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });
    return { status: receipt.status };
  }

  async checkMyLevel(): Promise<UserStats> {
    if (!this.publicClient || !this.connectedAddress) {
      throw new Error('Wallet not connected');
    }

    const [level, totalXP] = (await Promise.all([
      this.publicClient.readContract({
        address: GAMIXP_PRECOMPILE,
        abi: GAMIXP_ABI,
        functionName: 'getLevel',
        args: [this.connectedAddress],
      }),
      this.publicClient.readContract({
        address: GAMIXP_PRECOMPILE,
        abi: GAMIXP_ABI,
        functionName: 'getTotalXP',
        args: [this.connectedAddress],
      }),
    ])) as [bigint, bigint];

    const nextLevelXP = this.calculateXPForLevel(level + 1n);
    return { level, totalXP, xpToNextLevel: nextLevelXP - totalXP };
  }

  private calculateXPForLevel(level: bigint): bigint {
    if (level <= 1n) return 0n;
    return 1000n * (2n ** (level - 1n) - 1n);
  }

  async checkAgentBudget(agentAddress: Address, amount: bigint): Promise<BudgetCheck> {
    if (!this.publicClient) throw new Error('Wallet not connected');

    const result = (await this.publicClient.readContract({
      address: GAMI_TREASURY_PRECOMPILE,
      abi: TREASURY_ABI,
      functionName: 'checkBudget',
      args: [agentAddress, amount],
    })) as [boolean, bigint];

    return { allowed: result[0], remaining: result[1] };
  }

  async subscribeToLevelUps(
    callback: (user: Address, newLevel: bigint, totalXP: bigint) => void
  ): Promise<() => void> {
    if (!this.publicClient) throw new Error('Wallet not connected');

    return this.publicClient.watchContractEvent({
      address: GAMIXP_PRECOMPILE,
      abi: GAMIXP_ABI,
      eventName: 'LevelUp',
      onLogs: (logs) => {
        logs.forEach((log) => {
          const eventLog = log as { args?: { user?: Address; newLevel?: bigint; totalXP?: bigint } };
          const args = eventLog.args;
          if (args?.user && args?.newLevel !== undefined && args?.totalXP !== undefined) {
            callback(args.user, args.newLevel, args.totalXP);
          }
        });
      },
    });
  }

  disconnect(): void {
    this.publicClient = null;
    this.walletClient = null;
    this.connectedAddress = null;
  }

  getAddress(): Address | null {
    return this.connectedAddress;
  }

  getPublicClient(): PublicClient | null {
    return this.publicClient;
  }
}

export function createGamiWalletInstance(rpcUrl?: string): GamiWallet {
  return new GamiWallet(rpcUrl);
}
