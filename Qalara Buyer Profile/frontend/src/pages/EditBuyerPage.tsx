import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { api } from "../lib/api";
import type { Buyer } from "../lib/types";
import { BuyerForm } from "./shared/BuyerForm";
import { Button } from "../components/ui";

export function EditBuyerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.getBuyer(id).then(setBuyer).catch((err) => setError(err.message));
  }, [id]);

  async function save() {
    if (!id || !buyer) return;
    setSaving(true);
    setError("");
    try {
      const saved = await api.updateBuyer(id, buyer);
      navigate(`/buyers/${saved.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update buyer.");
    } finally {
      setSaving(false);
    }
  }

  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!buyer) return <div className="text-sm text-stone-600">Loading profile...</div>;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Edit buyer profile</h1>
          <p className="text-sm text-stone-600">{buyer.email}</p>
        </div>
        <Button onClick={save} disabled={saving}><Save size={16} /> {saving ? "Saving..." : "Save changes"}</Button>
      </div>
      <BuyerForm buyer={buyer} onChange={setBuyer} />
    </div>
  );
}
