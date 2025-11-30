import { Dispatch, SetStateAction } from 'react';

interface SignInModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function SignInModal({ open, setOpen }: SignInModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative glass-panel p-6 w-full max-w-md mx-4 neon-border shadow-2xl">
        <h3 className="text-xl font-bold mb-3 text-white">Sign In</h3>
        <p className="text-sm text-white/70 mb-4">This is a UI-only sign in modal (no backend). Use it as a placeholder for real auth flows.</p>
        <form onSubmit={(e) => { e.preventDefault(); setOpen(false); }}>
          <label className="block text-sm text-white/70">Email</label>
          <input className="w-full rounded-md p-2 mt-1 mb-3 bg-black/40 text-white border border-white/10" placeholder="you@example.com" />
          <label className="block text-sm text-white/70">Password</label>
          <input type="password" className="w-full rounded-md p-2 mt-1 mb-4 bg-black/40 text-white border border-white/10" placeholder="••••••••" />
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-white/5 text-white">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
}
