import { useState } from 'react';
import { AuditInput } from './components/AuditInput';
import { AuditResults } from './components/AuditResults';
import { LoadingSpinner } from './components/LoadingSpinner';
import { SignInModal } from './components/SignInModal';
import { MidnightWallet } from './components/MidnightWallet';
import { runContractAudit } from './services/auditService';
import { AuditResult } from './types/audit';
import tokenService from './services/tokenService';

function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuditSubmit = async (code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await runContractAudit(code);
      // Generate a lightweight client-side summary based on the submitted code
      const generateSummary = (src: string) => {
        const s = src.toLowerCase();
        const parts: string[] = [];

        if (s.includes('{-# inlinable') || s.includes('mkvalidator')) {
          parts.push('Detected on-chain validator logic (Plutus/Aiken style).');
        }
        if (s.includes('unsafedataasi') || s.includes('unsafe')) {
          parts.push('Contains unsafe data parsing patterns; type-safety risk present.');
        }
        if (s.includes('frombuiltindata') || s.includes('isdata')) {
          parts.push('Uses safe data decoding patterns (fromBuiltinData/isData).');
        }
        if (s.includes('txsignedby') || s.includes('txinfosignatories')) {
          parts.push('Signature checks detected (txSignedBy patterns).');
        }
        if (s.includes('findowninput') || s.includes('valuepaidto') || s.includes('txinfovalidrange')) {
          parts.push('UTxO/time-range checks detected or suggested (findOwnInput/valuePaidTo/txInfoValidRange).');
        }
        if (s.includes('redeemer') || s.includes('action =')) {
          parts.push('Redeemer/action handling appears present — action-specific logic may exist.');
        }
        if (s.includes('witness') || s.includes('proof') || s.includes('mcl') || s.includes('midnight')) {
          parts.push('Privacy-oriented constructs (witness/proof/MCL) detected; consider zk proofs for confidentiality.');
        }

        if (parts.length === 0) {
          return 'Basic static analysis performed — the contract needs a deeper audit for security and privacy issues.';
        }

        return parts.join(' ');
      };

      // Inject dynamic summary without modifying core audit logic
      try {
        // clone to avoid mutating service internals unexpectedly and include token info
        const enriched = {
          ...result,
          summary: generateSummary(code),
          midnight_token: {
            id: tokenService.tokenId,
            balance_required: 1,
            balance: tokenService.getBalance(),
          },
        } as typeof result & { midnight_token: { id: string; balance_required: number; balance: number } };
        setAuditResult(enriched);
      } catch (e) {
        setAuditResult(result);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#051028] via-[#071129] to-[#030617] text-white">
      <header className="w-full py-4 px-6 sticky top-0 z-50 backdrop-blur-md bg-black/20 border-b border-white/6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="font-extrabold">AI</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">Cardano AI Auditor</h1>
              <p className="text-xs text-white/60">Advanced privacy & security audits</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => window.open('/docs', '_blank')} className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition">Docs</button>
            <button onClick={() => setShowSignIn(true)} className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 font-semibold shadow-lg">Sign in</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
          <aside className="lg:col-span-3 col-span-1 sticky top-24 self-start">
          <div className="glass-panel p-6 neon-border mb-6">
            <h2 className="text-sm text-white/70 uppercase tracking-wider mb-3">Overview</h2>
            <p className="text-white/80 text-sm">Run audits, review findings, and export reports.</p>
          </div>

          <div className="glass-panel p-6 neon-border space-y-4">
            <h3 className="text-sm font-bold text-white/90">Quick Actions</h3>
            <div className="flex flex-col gap-3 mt-3">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 font-medium">New Audit</button>
              <button onClick={() => window.print()} className="text-left px-4 py-2 rounded-lg bg-white/5">Generate PDF</button>
              <button onClick={() => { const blob = new Blob(['// MCL template placeholder'], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'mcl_template.mcl'; a.click(); URL.revokeObjectURL(a.href);} } className="text-left px-4 py-2 rounded-lg bg-white/5">Export MCL</button>
            </div>
          </div>
          <div className="mt-6">
            <MidnightWallet />
          </div>
        </aside>        {/* Main */}
        <main className="lg:col-span-9 col-span-1">
          <AuditInput onSubmit={handleAuditSubmit} isLoading={isLoading} />

          {error && (
            <div className="bg-[rgba(255,0,0,0.06)] border-l-4 border-red-600 rounded-lg p-6 mb-8">
              <p className="text-red-300 font-semibold">Error</p>
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {auditResult && !isLoading && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <button
                  onClick={() => {
                    setAuditResult(null);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-white/5 text-white rounded-lg hover:bg-white/10 transition"
                >
                  ← Run Another Audit
                </button>
              </div>

              <div className="space-y-8">
                <AuditResults result={auditResult} />
              </div>
              <SignInModal open={showSignIn} setOpen={setShowSignIn} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
