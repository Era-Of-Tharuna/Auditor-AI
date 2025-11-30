export interface SecurityRisk {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affected_code_snippet: string;
  fix_suggestion: string;
}

export interface UTxOIssue {
  issue: string;
  description: string;
  fix: string;
}

export interface PrivacyIssue {
  issue: string;
  description?: string;
  risk: string;
  recommended_mcl_fix: string;
}

export interface CardanoIntegration {
  audit_hash_store_instructions: string;
  optional_approval_signal_design: string;
  hydra_scaling_note: string;
}

export interface Scores {
  security: number;
  privacy: number;
  utxo_logic: number;
}

export interface PDFSections {
  executive_summary: string;
  detailed_findings: string;
  fixes_and_patch_summaries: string;
  final_notes_and_footers: string;
}

export interface AuditResult {
  summary: string;
  security_risks: SecurityRisk[];
  utxo_issues: UTxOIssue[];
  privacy_issues: PrivacyIssue[];
  midnight_recommendations: string[];
  cardano_integration: CardanoIntegration;
  scores: Scores;
  final_recommendation: string;
  ui_quick_actions: Array<{ label: string; action: string }>;
  pdf_ready_sections: PDFSections;
  cardano_meme_for_demo: string;
  // Optional UI-only token info injected by the client
  midnight_token?: {
    id: string;
    balance_required: number;
    balance: number;
  };
}
