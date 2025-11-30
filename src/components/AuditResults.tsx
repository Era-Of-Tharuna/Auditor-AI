import { useState } from 'react';
import { AuditResult, UTxOIssue, PrivacyIssue } from '../types/audit';
import { RiskCard } from './RiskCard';
import { SectionCard } from './SectionCard';
import { ScoreCard } from './ScoreCard';
import { AlertCircle, Shield, Zap, Moon, Database, Gauge } from 'lucide-react';
import tokenService from '../services/tokenService';

interface AuditResultsProps {
  result: AuditResult;
}

function IssueItem({ title, description, detail }: { title: string; description: string; detail: string }) {
  return (
    <div className="border-l-4 border-orange-300 bg-orange-50 p-4 rounded mb-4">
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-700 mb-2">{description}</p>
      <p className="text-sm text-orange-900 font-mono bg-white p-2 rounded">{detail}</p>
    </div>
  );
}

export function AuditResults({ result }: AuditResultsProps) {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  };

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'generate_pdf_report':
          // open print dialog for current page (simple, no deps)
          window.print();
          showToast('Opened print dialog');
          break;
        case 'submit_cardano_metadata_tx':
          // Require 1 MDT to record on chain (UI-only simulation).
          if (!tokenService.spendToken(1)) {
            showToast('Insufficient MDT — require 1 MDT to record on chain');
            break;
          }
          // copy a representative hash (mock) to clipboard
          if (navigator.clipboard) {
            const sample = result.final_recommendation.slice(0, 80);
            await navigator.clipboard.writeText(sample);
            showToast('Recorded on-chain (mock) — 1 MDT spent');
          } else {
            showToast('Recorded (mock), but clipboard not available');
          }
          break;
        case 'export_mcl_rewrite':
          // download a small file containing a suggested MCL template
          const blob = new Blob([result.summary || 'MCL template'], { type: 'text/plain' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'mcl_rewrite_template.mcl';
          a.click();
          URL.revokeObjectURL(a.href);
          showToast('Downloaded MCL template');
          break;
          case 'show_code_fixes':
          // scroll to PDF Report Sections
          const pdfSection = document.querySelector('section') || document.querySelector('.pdf-section');
          if (pdfSection) {
            (pdfSection as HTMLElement).scrollIntoView({ behavior: 'smooth' });
          }
          showToast('Scrolled to fixes');
          break;
        case 'initialize_hydra_head':
          showToast('Hydra session initialization (stubbed)');
          break;
        case 'mint_audit_nft':
          showToast('Mint audit approval NFT (stubbed)');
          break;
        default:
          showToast('Action executed');
          break;
      }
    } catch (e) {
      console.error(e);
      showToast('Action failed');
    }
  };

  return (
    <div className="space-y-8">
      {/* Recommendation Banner */}
      <div className="relative rounded-2xl overflow-hidden group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-purple-600 to-cyan-500 opacity-40 blur-lg"></div>
        <div className="relative glass-panel p-6 flex items-start gap-4 neon-border">
          <div className="text-red-400 flex-shrink-0">
            <AlertCircle size={32} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Audit Recommendation</h3>
            <p className="text-lg text-white/90 mb-4">{result.final_recommendation}</p>

            <div className="flex flex-wrap gap-3 mt-2">
              {(result.ui_quick_actions || []).map((a, i) => (
                <button key={i} onClick={() => handleAction(a.action)} className="px-3 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 text-sm font-semibold">{a.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <SectionCard title="Executive Summary">
        <p className="text-gray-800 leading-relaxed text-lg">{result.summary}</p>
      </SectionCard>

      {/* Scores */}
      <ScoreCard scores={result.scores} />

      {/* Security Risks */}
      {result.security_risks.length > 0 && (
        <SectionCard
          title="Security Risks"
          icon={<Shield size={28} />}
        >
          <div className="space-y-4">
            {result.security_risks.map((risk, idx) => (
              <RiskCard key={idx} risk={risk} />
            ))}
          </div>
        </SectionCard>
      )}

      {/* UTxO Issues */}
      {result.utxo_issues.length > 0 && (
        <SectionCard
          title="UTxO Model Issues"
          icon={<Database size={28} />}
        >
          <div className="space-y-2">
            {result.utxo_issues.map((issue: UTxOIssue, idx) => (
              <IssueItem
                key={idx}
                title={issue.issue}
                description={issue.description}
                detail={issue.fix}
              />
            ))}
          </div>
        </SectionCard>
      )}

      {/* Privacy & MCL Issues */}
      {result.privacy_issues.length > 0 && (
        <SectionCard
          title="Privacy & Midnight MCL Issues"
          icon={<Moon size={28} />}
        >
          <div className="space-y-4">
            {result.privacy_issues.map((issue: PrivacyIssue, idx) => (
              <div key={idx} className="border-l-4 border-purple-300 bg-purple-50 p-4 rounded">
                <h4 className="font-semibold text-gray-900 mb-2">{issue.issue}</h4>
                <p className="text-sm text-gray-700 mb-3">
                  <strong>Risk:</strong> {issue.risk}
                </p>
                <div className="bg-white p-3 rounded border border-purple-200">
                  <p className="text-xs font-semibold text-purple-800 mb-1">Midnight MCL Fix:</p>
                  <p className="text-sm text-purple-900">{issue.recommended_mcl_fix}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Midnight Recommendations */}
      {result.midnight_recommendations.length > 0 && (
        <SectionCard title="Midnight Recommendations">
          <ul className="space-y-3">
            {result.midnight_recommendations.map((rec, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-blue-600 font-bold">✓</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Cardano Integration */}
      <SectionCard
        title="Cardano Integration & On-Chain Proofing"
        icon={<Zap size={28} />}
      >
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Audit Hash Storage Instructions</h4>
            <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded border border-blue-200">
              {result.cardano_integration.audit_hash_store_instructions}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Audit Approval Signal Design</h4>
            <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded border border-green-200">
              {result.cardano_integration.optional_approval_signal_design}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Hydra Scaling</h4>
            <p className="text-gray-700 leading-relaxed bg-orange-50 p-4 rounded border border-orange-200">
              {result.cardano_integration.hydra_scaling_note}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* PDF Report Sections */}
      <SectionCard title="PDF Report Sections">
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Gauge size={20} /> Executive Summary
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-300 whitespace-pre-wrap text-sm font-mono">
              {result.pdf_ready_sections.executive_summary}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Shield size={20} /> Detailed Findings
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-300 whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
              {result.pdf_ready_sections.detailed_findings}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Zap size={20} /> Fixes & Patches
            </h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-300 whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
              {result.pdf_ready_sections.fixes_and_patch_summaries}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Final Notes</h4>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded border border-gray-300 whitespace-pre-wrap text-sm font-mono max-h-96 overflow-y-auto">
              {result.pdf_ready_sections.final_notes_and_footers}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Cardano Meme */}
      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg shadow-lg p-8 border-2 border-dashed border-blue-300">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🐳 Cardano Meme Corner 🐳</h3>
        <p className="text-gray-800 text-lg italic leading-relaxed">
          {result.cardano_meme_for_demo}
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 bg-black/70 text-white px-4 py-3 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

