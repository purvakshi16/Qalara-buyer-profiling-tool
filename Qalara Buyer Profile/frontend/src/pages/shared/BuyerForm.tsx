import type { Buyer } from "../../lib/types";
import { buyerTypeOptions, categoryOptions, customerTypeOptions } from "../../lib/constants";
import { Badge, Field, Input, Select, Textarea } from "../../components/ui";

function setArrayValue(values: string[] | undefined, value: string, checked: boolean) {
  const current = values ?? [];
  return checked ? [...current, value] : current.filter((item) => item !== value);
}

export function BuyerForm({ buyer, onChange }: { buyer: Buyer; onChange: (buyer: Buyer) => void }) {
  const update = (patch: Partial<Buyer>) => onChange({ ...buyer, ...patch });

  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-ink">Apollo-enriched fields</h2>
          <Badge>via Apollo</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="First name"><Input value={buyer.firstName ?? ""} onChange={(e) => update({ firstName: e.target.value })} /></Field>
          <Field label="Last name"><Input value={buyer.lastName ?? ""} onChange={(e) => update({ lastName: e.target.value })} /></Field>
          <Field label="Email"><Input type="email" required value={buyer.email} onChange={(e) => update({ email: e.target.value })} /></Field>
          <Field label="Phone"><Input value={buyer.phone ?? ""} onChange={(e) => update({ phone: e.target.value })} /></Field>
          <Field label="LinkedIn URL"><Input value={buyer.linkedinUrl ?? ""} onChange={(e) => update({ linkedinUrl: e.target.value })} /></Field>
          <Field label="Job title"><Input value={buyer.jobTitle ?? ""} onChange={(e) => update({ jobTitle: e.target.value })} /></Field>
          <Field label="Seniority"><Input value={buyer.seniority ?? ""} onChange={(e) => update({ seniority: e.target.value })} /></Field>
          <Field label="Company"><Input value={buyer.companyName ?? ""} onChange={(e) => update({ companyName: e.target.value })} /></Field>
          <Field label="Website"><Input value={buyer.websiteUrl ?? ""} onChange={(e) => update({ websiteUrl: e.target.value })} /></Field>
          <Field label="Employee size"><Input value={buyer.employeeSize ?? ""} onChange={(e) => update({ employeeSize: e.target.value })} /></Field>
          <Field label="Revenue estimate"><Input value={buyer.revenueEstimate ?? ""} onChange={(e) => update({ revenueEstimate: e.target.value })} /></Field>
          <Field label="HQ country"><Input value={buyer.hqCountry ?? ""} onChange={(e) => update({ hqCountry: e.target.value })} /></Field>
          <Field label="Founded year"><Input type="number" value={buyer.foundedYear ?? ""} onChange={(e) => update({ foundedYear: e.target.value ? Number(e.target.value) : undefined })} /></Field>
          <Field label="Industry"><Input value={buyer.industry ?? ""} onChange={(e) => update({ industry: e.target.value })} /></Field>
        </div>
      </section>

      <section className="grid gap-4 rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
        <h2 className="text-base font-semibold text-ink">AM-selected fields</h2>
        <Field label="Buyer type"><Select value={buyer.buyerType ?? ""} onChange={(e) => update({ buyerType: e.target.value })}><option value="">Select</option>{buyerTypeOptions.map((option) => <option key={option}>{option}</option>)}</Select></Field>
        <Field label="Customer type"><Select value={buyer.customerType ?? ""} onChange={(e) => update({ customerType: e.target.value })}><option value="">Select</option>{customerTypeOptions.map((option) => <option key={option}>{option}</option>)}</Select></Field>
        <div className="grid gap-2">
          <span className="text-sm font-medium text-stone-700">Category interest</span>
          <div className="grid max-h-72 gap-2 overflow-auto rounded-md border border-stone-200 p-3 sm:grid-cols-2">
            {categoryOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 text-sm text-stone-700">
                <input type="checkbox" checked={buyer.categoryInterest?.includes(option) ?? false} onChange={(e) => update({ categoryInterest: setArrayValue(buyer.categoryInterest, option, e.target.checked) })} />
                {option}
              </label>
            ))}
          </div>
        </div>
        <Field label="Notes"><Textarea value={buyer.notes ?? ""} onChange={(e) => update({ notes: e.target.value })} /></Field>
      </section>
    </div>
  );
}
