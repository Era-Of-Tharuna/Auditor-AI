const TOKEN_ID = '02000000000000000000000000000000000000000000000000000000000000000000';
const STORAGE_KEY = 'midnight_mdt_balance_v1';

type BalanceListener = (balance: number) => void;

let listeners: BalanceListener[] = [];

function readStored(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch (e) {
    return 0;
  }
}

function writeStored(n: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.max(0, Math.floor(n))));
    listeners.forEach((l) => l(readStored()));
  } catch (e) {
    // ignore
  }
}

export const tokenId = TOKEN_ID;

export function getBalance(): number {
  return readStored();
}

export function topUp(amount: number = 1) {
  const current = readStored();
  const next = current + Math.max(0, Math.floor(amount));
  writeStored(next);
  return next;
}

// Attempt to spend `amount` tokens. Returns true if spent, false if insufficient balance.
export function spendToken(amount: number = 1): boolean {
  const current = readStored();
  const amt = Math.max(0, Math.floor(amount));
  if (current >= amt && amt > 0) {
    writeStored(current - amt);
    return true;
  }
  return false;
}

export function onBalanceChange(cb: BalanceListener) {
  listeners.push(cb);
  try {
    cb(readStored());
  } catch (e) {
    // ignore
  }
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

// Initialize storage if missing
if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === null) {
  localStorage.setItem(STORAGE_KEY, '0');
}

export default {
  tokenId: TOKEN_ID,
  getBalance,
  spendToken,
  topUp,
  onBalanceChange,
};
