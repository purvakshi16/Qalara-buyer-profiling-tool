import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "../lib/api";
import type { BuyerSeed } from "../lib/types";
import { Button, Field, Input } from "../components/ui";

const initialSeed: BuyerSeed = { firstName: "", lastName: "", email: "", linkedinUrl: "", companyName: "", websiteUrl: "" };

export function NewBuyerPage() {
  const navigate = useNavigate();
  const [seed, setSeed] = useState(initialSeed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const enriched = await api.enrichBuyer(seed);
      sessionStorage.setItem("reviewBuyer", JSON.stringify(enriched));
      navigate("/buyers/new/review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enrich buyer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-ink">New buyer profile</h1>
        <p className="text-sm text-stone-600">Start with a few fields. Apollo will enrich the contact and company profile.</p>
      </div>
      <form onSubmit={submit} className="grid max-w-3xl gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First name"><Input value={seed.firstName ?? ""} onChange={(e) => setSeed({ ...seed, firstName: e.target.value })} /></Field>
          <Field label="Last name"><Input value={seed.lastName ?? ""} onChange={(e) => setSeed({ ...seed, lastName: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" required value={seed.email} onChange={(e) => setSeed({ ...seed, email: e.target.value })} /></Field>
          <Field label="LinkedIn URL"><Input value={seed.linkedinUrl ?? ""} onChange={(e) => setSeed({ ...seed, linkedinUrl: e.target.value })} /></Field>
          <Field label="Company name"><Input value={seed.companyName ?? ""} onChange={(e) => setSeed({ ...seed, companyName: e.target.value })} /></Field>
          <Field label="Website URL"><Input value={seed.websiteUrl ?? ""} onChange={(e) => setSeed({ ...seed, websiteUrl: e.target.value })} /></Field>
        </div>
        {loading && (
          <div className="grid gap-2 rounded-md border border-clay-100 bg-clay-50 p-4 text-sm text-stone-700">
            <span>Fetching contact data via Apollo...</span>
            <span className="text-stone-500">Phase 2 enrichment services are scaffolded and will join this flow later.</span>
          </div>
        )}
        {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
        <Button type="submit" disabled={loading}><Search size={16} /> Enrich & Build Profile</Button>
      </form>
    </div>
  );
}
