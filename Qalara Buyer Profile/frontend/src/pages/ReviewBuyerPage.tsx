import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { api } from "../lib/api";
import type { Buyer } from "../lib/types";
import { BuyerForm } from "./shared/BuyerForm";
import { Button } from "../components/ui";

export function ReviewBuyerPage() {
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const enrichmentFailed = buyer?.enrichmentStatus === "failed";

  useEffect(() => {
    const stored = sessionStorage.getItem("reviewBuyer");
    if (!stored) {
      navigate("/buyers/new");
      return;
    }
    setBuyer(JSON.parse(stored));
  }, [navigate]);

  async function save() {
    if (!buyer) return;
    setSaving(true);
    setError("");
    try {
      const saved = await api.createBuyer(buyer);
      sessionStorage.removeItem("reviewBuyer");
      navigate(`/buyers/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save buyer.");
    } finally {
      setSaving(false);
    }
  }

  if (!buyer) return null;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Review enriched profile</h1>
          <p className="text-sm text-stone-600">Edit Apollo-enriched and manual fields before saving.</p>
        </div>
        <Button onClick={save} disabled={saving || enrichmentFailed}><Save size={16} /> {saving ? "Saving..." : "Save Profile"}</Button>
      </div>
      {enrichmentFailed && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Apollo did not return usable enrichment for this profile. Go back and adjust the seed fields before saving.
        </div>
      )}
      {error && <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
      {buyer.sourceErrors && Object.keys(buyer.sourceErrors).length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Some enrichment sources returned partial data. You can still review, edit, and save once the profile is useful.
        </div>
      )}
      <BuyerForm buyer={buyer} onChange={setBuyer} />
    </div>
  );
}
