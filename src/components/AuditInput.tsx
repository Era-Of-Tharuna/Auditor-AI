import { useState } from 'react';
import { Zap } from 'lucide-react';

interface AuditInputProps {
  onSubmit: (code: string) => void;
  isLoading: boolean;
}

export function AuditInput({ onSubmit, isLoading }: AuditInputProps) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code);
    }
  };

  const handleExample = () => {
    setCode(`{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
mkValidator datum redeemer ctx =
    let
        amount = case unsafeDataAsI datum of
                    n -> n
                    _ -> 0
        signed = True
        action = redeemer
        utxoOk = True
        validAmount = amount >= 0
        timeValid = True
        condition = validAmount && signed && utxoOk && timeValid
    in
        if condition then () else error ()`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h1 className="text-4xl font-bold mb-2 text-gray-900">
        Cardano AI Auditor Agent
      </h1>
      <p className="text-gray-600 mb-6 text-lg">
        Expert analysis of Aiken, Plutus, EUTxO, Midnight, and MCL privacy contracts
      </p>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-gray-700">
          Smart Contract Code
        </label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your Aiken / Plutus contract here..."
          className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm bg-white text-black placeholder-gray-500 caret-black focus:border-blue-500 focus:outline-none resize-none"
          disabled={isLoading}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !code.trim()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Zap size={20} />
            {isLoading ? 'Running Audit...' : 'Run Audit'}
          </button>

          <button
            onClick={handleExample}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            Load Example
          </button>
        </div>
      </div>
    </div>
  );
}