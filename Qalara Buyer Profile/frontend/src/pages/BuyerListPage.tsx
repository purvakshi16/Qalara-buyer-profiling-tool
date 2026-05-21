import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { api } from "../lib/api";
import type { Buyer } from "../lib/types";
import { Badge, Button, Field, Input, Select } from "../components/ui";
import { buyerTypeOptions, categoryOptions } from "../lib/constants";

export function BuyerListPage() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ buyerType: "", country: "", category: "", status: "" });

  useEffect(() => {
    api.listBuyers()
      .then(setBuyers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => buyers.filter((buyer) => {
    return (!filters.buyerType || buyer.buyerType === filters.buyerType)
      && (!filters.country || buyer.hqCountry?.toLowerCase().includes(filters.country.toLowerCase()))
      && (!filters.category || buyer.categoryInterest?.includes(filters.category))
      && (!filters.status || buyer.enrichmentStatus === filters.status);
  }), [buyers, filters]);

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Buyer profiles</h1>
          <p className="text-sm text-stone-600">Apollo-enriched profiles created by your account.</p>
        </div>
        <Link to="/buyers/new"><Button><Plus size={16} /> New Profile</Button></Link>
      </div>

      <section className="grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-4">
        <Field label="Buyer type"><Select value={filters.buyerType} onChange={(e) => setFilters({ ...filters, buyerType: e.target.value })}><option value="">All</option>{buyerTypeOptions.map((option) => <option key={option}>{option}</option>)}</Select></Field>
        <Field label="Country"><Input value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value })} placeholder="Search country" /></Field>
        <Field label="Category"><Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}><option value="">All</option>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</Select></Field>
        <Field label="Status"><Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="">All</option><option>complete</option><option>partial</option><option>failed</option><option>pending</option></Select></Field>
      </section>

      <section className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
        {loading ? <div className="p-6 text-sm text-stone-600">Loading profiles...</div> : error ? <div className="p-6 text-sm text-red-700">{error}</div> : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-4 py-3">Name</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Country</th><th className="px-4 py-3">Buyer Type</th><th className="px-4 py-3">India Imports</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((buyer) => (
                <tr key={buyer.id} className="border-t border-stone-100 hover:bg-clay-50">
                  <td className="px-4 py-3"><Link className="font-medium text-ink hover:text-clay-700" to={`/buyers/${buyer.id}`}>{buyer.firstName} {buyer.lastName}<div className="text-xs font-normal text-stone-500">{buyer.email}</div></Link></td>
                  <td className="px-4 py-3">{buyer.companyName || "-"}</td>
                  <td className="px-4 py-3">{buyer.hqCountry || "-"}</td>
                  <td className="px-4 py-3">{buyer.buyerType || "-"}</td>
                  <td className="px-4 py-3">{buyer.importsFromIndia ? "Yes" : "No"}</td>
                  <td className="px-4 py-3"><Badge tone={buyer.enrichmentStatus === "complete" ? "good" : buyer.enrichmentStatus === "failed" ? "bad" : "warn"}>{buyer.enrichmentStatus || "pending"}</Badge></td>
                  <td className="px-4 py-3">{buyer.createdAt ? new Date(buyer.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))}
              {!filtered.length && <tr><td className="px-4 py-8 text-center text-stone-500" colSpan={7}>No buyer profiles yet.</td></tr>}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
