import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Button, Field, Input, SecondaryButton } from "../components/ui";

export function LoginPage() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const result = isSignup
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      : await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (isSignup && !result.data.session) {
      setMessage("Check your email to confirm your account, then sign in.");
      return;
    }
    navigate("/buyers");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-clay-50 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-3 grid h-11 w-11 place-items-center rounded-md bg-clay-500 font-semibold text-white">Q</div>
          <h1 className="text-2xl font-semibold text-ink">{isSignup ? "Create AM account" : "Sign in"}</h1>
          <p className="mt-1 text-sm text-stone-600">Internal Qalara buyer profiling workspace.</p>
        </div>
        <div className="grid gap-4">
          {isSignup && <Field label="Full name"><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required /></Field>}
          <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Field label="Password"><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></Field>
          {message && <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</div>}
          <Button type="submit" disabled={loading}>{loading ? "Please wait..." : isSignup ? "Create account" : "Sign in"}</Button>
          <SecondaryButton type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Use existing account" : "Create a new account"}
          </SecondaryButton>
        </div>
      </form>
    </div>
  );
}
