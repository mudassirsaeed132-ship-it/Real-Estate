import { useMemo } from "react";
import { precheckActions, usePrecheckStore } from "../model/precheckStore";

function Label({ children }) {
  return <div className="text-[12px] font-semibold text-[#111827]">{children}</div>;
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-[#EDEDED] bg-white px-4 text-[13px] outline-none"
    />
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative h-5 w-9 rounded-full border transition",
        checked ? "border-[#D66355] bg-[#D66355]" : "border-[#EDEDED] bg-white",
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white shadow transition",
          checked ? "right-0.5" : "left-0.5 bg-[#111827]/20",
        ].join(" ")}
      />
    </button>
  );
}

function UploadBox({ files, onFiles }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#D1D5DB] p-6 text-center">
      <input
        type="file"
        multiple
        className="hidden"
        id="precheck_upload"
        onChange={(e) => onFiles(Array.from(e.target.files || []))}
      />
      <label htmlFor="precheck_upload" className="cursor-pointer text-[12px] text-[#9CA3AF]">
        Click to browse or <br /> drag and drop your files
      </label>

      {files?.length ? (
        <div className="mt-3 text-[11px] text-[#6B7280]">
          {files.length} file(s) selected
        </div>
      ) : null}
    </div>
  );
}

export default function PersonalInfoStep({ onCalculate }) {
  const form = usePrecheckStore((s) => s.form);
  const uploads = usePrecheckStore((s) => s.uploads);
  const loading = usePrecheckStore((s) => s.loading.calc);

  const employment = form.employment;

  const equityOptions = useMemo(
    () => ["$565", "$2,000", "$5,000", "$10,000", "$25,000", "$50,000"],
    []
  );

  return (
    <div className="space-y-5">
      <div>
        <Label>Gross annual income</Label>
        <div className="mt-2">
          <Input value={form.income} onChange={(v) => precheckActions.setForm({ income: v })} />
        </div>
      </div>

      <div>
        <Label>Available equity/ own funds</Label>
        <div className="mt-2">
          <select
            value={form.equity}
            onChange={(e) => precheckActions.setForm({ equity: e.target.value })}
            className="h-11 w-full rounded-xl border border-[#EDEDED] bg-white px-4 text-[13px] outline-none"
          >
            {equityOptions.map((x) => (
              <option key={x} value={x.replace(/[^0-9.]/g, "")}>
                {x}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-[12px] text-[#111827]">Includes pension funds</div>
          <Toggle
            checked={!!form.includePension}
            onChange={(v) => precheckActions.setForm({ includePension: v })}
          />
        </div>
      </div>

      <div>
        <Label>Monthly Expenses</Label>
        <div className="mt-2">
          <Input
            value={form.monthlyExpenses}
            onChange={(v) => precheckActions.setForm({ monthlyExpenses: v })}
          />
        </div>
      </div>

      <div>
        <Label>Employment</Label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => precheckActions.setForm({ employment: "employed" })}
            className={[
              "h-12 rounded-xl border text-[13px] font-semibold",
              employment === "employed"
                ? "border-[#D66355] bg-[#FDE2E0] text-[#D66355]"
                : "border-[#EDEDED] bg-white text-[#111827]",
            ].join(" ")}
          >
            Employed
          </button>

          <button
            type="button"
            onClick={() => precheckActions.setForm({ employment: "self" })}
            className={[
              "h-12 rounded-xl border text-[13px] font-semibold",
              employment === "self"
                ? "border-[#D66355] bg-[#FDE2E0] text-[#D66355]"
                : "border-[#EDEDED] bg-white text-[#111827]",
            ].join(" ")}
          >
            Self-employed
          </button>
        </div>
      </div>

      <div>
        <Label>Upload Documents (optional)</Label>
        <div className="mt-2">
          <UploadBox files={uploads} onFiles={precheckActions.setUploads} />
        </div>
      </div>

      <button
        type="button"
        disabled={loading}
        onClick={onCalculate}
        className="h-12 w-full rounded-xl bg-[#D66355] text-[13px] font-semibold text-white hover:bg-[#C85A4E] disabled:opacity-60"
      >
        {loading ? "Calculating..." : "Calculate Affordability"}
      </button>
    </div>
  );
}