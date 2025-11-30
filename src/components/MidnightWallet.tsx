import { useEffect, useState } from 'react';
import tokenService, { tokenId } from '../services/tokenService';

export function MidnightWallet() {
  const [balance, setBalance] = useState<number>(tokenService.getBalance());

  useEffect(() => {
    const off = tokenService.onBalanceChange((b) => setBalance(b));
    return () => off();
  }, []);

  return (
    <div className="glass-panel neon-border p-4">
      <h4 className="text-sm font-semibold text-white/90 mb-2">Midnight Wallet</h4>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-white/60">Token</div>
          <div className="font-mono text-sm text-white">MDT</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">Balance</div>
          <div className="font-semibold text-lg">{balance} MDT</div>
        </div>
      </div>

      <div className="text-xs text-white/60 break-all mb-3">
        ID: <span className="font-mono text-[10px] text-white/80">{tokenId}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => tokenService.topUp(1)} className="px-3 py-2 rounded bg-cyan-600 font-medium">Top up +1</button>
        <button onClick={() => { if (tokenService.spendToken(1)) { /* spent */ } }} className="px-3 py-2 rounded bg-white/5">Spend 1 (test)</button>
      </div>
    </div>
  );
}

export default MidnightWallet;
