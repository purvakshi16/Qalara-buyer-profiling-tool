import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Edit, RefreshCcw, Send, Trash2 } from "lucide-react";
import { api } from "../lib/api";
import type { Buyer } from "../lib/types";
import { Badge, Button, SecondaryButton } from "../components/ui";

function value(value?: string | number | null) {
  return value === undefined || value === null || value === "" ? "-" : value;
}

export function BuyerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getBuyer(id).then(setBuyer).catch((err) => setError(err.message));
  }, [id]);

  async function remove() {
    if (!id || !confirm("Soft delete this buyer profile?")) return;
    await api.deleteBuyer(id);
    navigate("/buyers");
  }

  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!buyer) return <div className="text-sm text-stone-600">Loading profile...</div>;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Badge tone={buyer.enrichmentStatus === "complete" ? "good" : buyer.enrichmentStatus === "failed" ? "bad" : "warn"}>{buyer.enrichmentStatus || "pending"}</Badge>
            <Badge>{buyer.hubspotContactId ? "HubSpot synced" : "Not synced"}</Badge>
          </div>
          <h1 className="text-2xl font-semibold text-ink">{buyer.firstName} {buyer.lastName}</h1>
          <p className="text-sm text-stone-600">{buyer.email} - {value(buyer.companyName)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/buyers/${buyer.id}/edit`}><Button><Edit size={16} /> Edit</Button></Link>
          <SecondaryButton disabled><RefreshCcw size={16} /> Re-enrich</SecondaryButton>
          <SecondaryButton disabled><Send size={16} /> Sync to HubSpot</SecondaryButton>
          <SecondaryButton onClick={remove}><Trash2 size={16} /> Delete</SecondaryButton>
        </div>
      </div>

      <section className="grid gap-5 rounded-lg border border-stone-200 bg-white p-5 shadow-soft md:grid-cols-3">
        <Info label="Phone" value={buyer.phone} />
        <Info label="Job title" value={buyer.jobTitle} />
        <Info label="Seniority" value={buyer.seniority} />
        <Info label="Website" value={buyer.websiteUrl} />
        <Info label="HQ country" value={buyer.hqCountry} />
        <Info label="Industry" value={buyer.industry} />
        <Info label="Employee size" value={buyer.employeeSize} />
        <Info label="Revenue estimate" value={buyer.revenueEstimate} />
        <Info label="Founded year" value={buyer.foundedYear} />
        <Info label="Buyer type" value={buyer.buyerType} />
        <Info label="Customer type" value={buyer.customerType} />
        <Info label="Last enriched" value={buyer.lastEnrichedAt ? new Date(buyer.lastEnrichedAt).toLocaleString() : "-"} />
      </section>

      <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-ink">Category interest</h2>
        <div className="flex flex-wrap gap-2">{buyer.categoryInterest?.length ? buyer.categoryInterest.map((item) => <Badge key={item}>{item}</Badge>) : <span className="text-sm text-stone-500">No categories selected.</span>}</div>
        <h2 className="pt-2 text-base font-semibold text-ink">Notes</h2>
        <p className="whitespace-pre-wrap text-sm text-stone-700">{buyer.notes || "No notes added."}</p>
      </section>
    </div>
  );
}

function Info({ label, value: infoValue }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</div>
      <div className="mt-1 text-sm text-ink">{value(infoValue)}</div>
    </div>
  );
}
