export const GAMIXP_ABI = [
  {
    type: 'function',
    name: 'addXP',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: 'success', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getLevel',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'level', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalXP',
    inputs: [{ name: 'user', type: 'address' }],
    outputs: [{ name: 'xp', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'LevelUp',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'newLevel', type: 'uint256', indexed: false },
      { name: 'totalXP', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const TREASURY_ABI = [
  {
    type: 'function',
    name: 'checkBudget',
    inputs: [
      { name: 'agent', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [
      { name: 'allowed', type: 'bool' },
      { name: 'remaining', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getInflationRate',
    inputs: [],
    outputs: [{ name: 'rate', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'transfer',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'Transfer',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
] as const;
