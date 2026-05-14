import { useState, useMemo, useCallback } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const GRAINS = [
  { id: "black_wheat", name: "Black Wheat", category: "Wheat", benefit: "Rich in Antioxidants", price: "₹27 / 150gm", pricePerKg: 180 },
  { id: "khapli_wheat", name: "Khapli Wheat", category: "Wheat", benefit: "Ancient Heritage Grain", price: "₹45 / 200gm", pricePerKg: 225 },
  { id: "sharbati_wheat", name: "Sharbati Wheat", category: "Wheat", benefit: "Classic Chapati Base", price: "₹45 / 500gm", pricePerKg: 90 },
  { id: "bajra", name: "Bajra", category: "Millet", benefit: "Iron & Energy Boost", price: "₹13 / 100g", pricePerKg: 130 },
  { id: "barnyard_millet", name: "Barnyard Millet", category: "Millet", benefit: "Fasting Friendly", price: "₹27 / 100g", pricePerKg: 270 },
  { id: "brown_top_millet", name: "Brown Top Millet", category: "Millet", benefit: "Rare Superfood", price: "₹60 / 100g", pricePerKg: 600 },
  { id: "foxtail_millet", name: "Foxtail Millet", category: "Millet", benefit: "Rich in Iron", price: "₹30 / 100g", pricePerKg: 300 },
  { id: "jowar", name: "Jowar", category: "Millet", benefit: "Diabetic Friendly", price: "₹13 / 100g", pricePerKg: 130 },
  { id: "kodo_millet", name: "Kodo Millet", category: "Millet", benefit: "Blood Sugar Control", price: "₹25 / 100g", pricePerKg: 250 },
  { id: "little_millet", name: "Little Millet", category: "Millet", benefit: "Weight Management", price: "₹25 / 100g", pricePerKg: 250 },
  { id: "proso_millet", name: "Proso Millet", category: "Millet", benefit: "Low Glycemic Index", price: "₹28 / 100g", pricePerKg: 280 },
  { id: "ragi", name: "Ragi", category: "Millet", benefit: "Highest in Calcium", price: "₹25 / 100g", pricePerKg: 250 },
  { id: "chia_seeds", name: "Chia Seeds", category: "Seed", benefit: "High Fiber & Omega", price: "₹27 / 25gm", pricePerKg: 1080 },
  { id: "flax_seeds", name: "Flax Seeds", category: "Seed", benefit: "Omega-3 Rich", price: "₹15 / 25gm", pricePerKg: 600 },
  { id: "methi_dana", name: "Methi Dana", category: "Seed", benefit: "Blood Sugar Support", price: "₹20 / 25gm", pricePerKg: 800 },
  { id: "amaranth", name: "Amaranth", category: "Pulse", benefit: "Complete Protein Source", price: "₹28 / 100g", pricePerKg: 280 },
  { id: "besan", name: "Besan", category: "Pulse", benefit: "High Protein Pulse", price: "₹21 / 100g", pricePerKg: 210 },
  { id: "black_chana", name: "Black Chana", category: "Pulse", benefit: "High Fiber & Iron", price: "₹23 / 100g", pricePerKg: 230 },
  { id: "green_moong_dal", name: "Green Moong Dal", category: "Pulse", benefit: "Easy to Digest", price: "₹30 / 100g", pricePerKg: 300 },
  { id: "soyabean", name: "Soyabean", category: "Pulse", benefit: "Highest Protein Grain", price: "₹24 / 100g", pricePerKg: 240 },
  { id: "yellow_moong_dal", name: "Yellow Moong Dal", category: "Pulse", benefit: "Light Protein Source", price: "₹30 / 100g", pricePerKg: 300 },
  { id: "jau_barley", name: "Jau (Barley)", category: "Grain", benefit: "Heart Healthy", price: "₹15 / 100g", pricePerKg: 150 },
  { id: "kuttu", name: "Kuttu", category: "Grain", benefit: "Naturally Gluten-Free", price: "₹40 / 100g", pricePerKg: 400 },
  { id: "makki", name: "Makki", category: "Grain", benefit: "Rich in Vitamin A", price: "₹11 / 100g", pricePerKg: 110 },
  { id: "oats", name: "Oats", category: "Grain", benefit: "Reduces Cholesterol", price: "₹17 / 100g", pricePerKg: 170 },
  { id: "quinoa", name: "Quinoa", category: "Grain", benefit: "All 9 Amino Acids", price: "₹60 / 100g", pricePerKg: 600 },
  { id: "rice", name: "Rice", category: "Grain", benefit: "Light & Digestible", price: "₹15 / 100g", pricePerKg: 150 },
  { id: "singhara", name: "Singhara", category: "Grain", benefit: "Perfect for Fasting", price: "₹42 / 100g", pricePerKg: 420 },
];

const PRESETS = [
  { id: "protein", label: "💪 Protein Rich", grains: { khapli_wheat: 27, besan: 13, ragi: 13, soyabean: 7, green_moong_dal: 13, yellow_moong_dal: 13, amaranth: 13 } },
  { id: "diabetes", label: "🌿 Diabetes Friendly", grains: { khapli_wheat: 28, jowar: 13, bajra: 13, methi_dana: 3, flax_seeds: 3, little_millet: 13, kodo_millet: 13, jau_barley: 13 } },
  { id: "calorie", label: "⚡ Calorie Conscious", grains: { khapli_wheat: 16, ragi: 15, jowar: 15, little_millet: 15, flax_seeds: 3, methi_dana: 3, foxtail_millet: 15, brown_top_millet: 15, chia_seeds: 3 } },
  { id: "gut", label: "🌿 Gut Health", grains: { jowar: 38, oats: 18, jau_barley: 18, flax_seeds: 4, green_moong_dal: 4, bajra: 18 } },
  { id: "senior", label: "🧓 Senior Friendly", grains: { khapli_wheat: 47, jowar: 22, ragi: 11, jau_barley: 11, yellow_moong_dal: 4, little_millet: 4 } },
  { id: "pcos", label: "🌸 PCOS Friendly", grains: { khapli_wheat: 32, jowar: 15, bajra: 8, ragi: 8, flax_seeds: 3, methi_dana: 3, little_millet: 15, kodo_millet: 15 } },
  { id: "cardio", label: "❤️ Cardiocare", grains: { jowar: 32, jau_barley: 15, oats: 15, flax_seeds: 3, quinoa: 3, proso_millet: 15, little_millet: 15 } },
];

const CATEGORY_COLORS = {
  Wheat: "#D4A373",
  Millet: "#52B788",
  Seed: "#F4A261",
  Pulse: "#E76F51",
  Grain: "#ADB5BD",
};

const CATEGORY_TEXT = {
  Wheat: "#7a5a35",
  Millet: "#1a5e3a",
  Seed: "#7a4a10",
  Pulse: "#7a2a10",
  Grain: "#3a3e44",
};

const NUTRITION = {
  Wheat: { kcal: 340, carbs: 71, protein: 12, fiber: 2.7, fat: 1.5 },
  Millet: { kcal: 360, carbs: 72, protein: 11, fiber: 3.5, fat: 3.5 },
  Seed: { kcal: 490, carbs: 30, protein: 18, fiber: 27, fat: 33 },
  Pulse: { kcal: 350, carbs: 60, protein: 22, fiber: 8, fat: 1.5 },
  Grain: { kcal: 350, carbs: 72, protein: 10, fiber: 4, fat: 2 },
};

function GrainCard({ grain, selected, onToggle }) {
  return (
    <div
      onClick={() => onToggle(grain.id)}
      style={{
        background: selected ? "#f0faf5" : "#fff",
        border: selected ? "2px solid #2D6A4F" : "1.5px solid #e8e0d0",
        borderRadius: 14,
        padding: "14px 12px 12px",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.18s ease",
        boxShadow: selected ? "0 2px 12px rgba(45,106,79,0.13)" : "0 1px 4px rgba(0,0,0,0.06)",
        userSelect: "none",
      }}
    >
      {selected && (
        <div style={{
          position: "absolute", top: 8, right: 8,
          background: "#2D6A4F", borderRadius: "50%",
          width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      <span style={{
        display: "inline-block",
        background: CATEGORY_COLORS[grain.category],
        color: CATEGORY_TEXT[grain.category],
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        borderRadius: 4,
        padding: "2px 7px",
        marginBottom: 7,
        textTransform: "uppercase",
      }}>{grain.category}</span>
      <div style={{ fontWeight: 700, fontSize: 14, color: "#1B1B1B", marginBottom: 3, lineHeight: 1.3 }}>{grain.name}</div>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 6, lineHeight: 1.4 }}>{grain.benefit}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#F4A261" }}>{grain.price}</div>
    </div>
  );
}

function StepBar({ step }) {
  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "#FEFAE0", borderBottom: "1.5px solid #e8e0d0",
      padding: "14px 20px 12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 0, maxWidth: 600, margin: "0 auto" }}>
        {[1, 2, 3].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 3 ? 1 : "none" }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: step >= s ? "#2D6A4F" : "#e8e0d0",
              color: step >= s ? "#fff" : "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, flexShrink: 0,
              transition: "all 0.2s",
            }}>{step > s ? "✓" : s}</div>
            <div style={{ fontSize: 12, marginLeft: 8, fontWeight: step === s ? 700 : 400, color: step === s ? "#2D6A4F" : "#6B7280", whiteSpace: "nowrap" }}>
              {s === 1 ? "Choose Grains" : s === 2 ? "Set Quantities" : "Review"}
            </div>
            {s < 3 && <div style={{ flex: 1, height: 2, background: step > s ? "#2D6A4F" : "#e8e0d0", margin: "0 10px", minWidth: 20, transition: "background 0.3s" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlendChart({ selectedGrains, percentages }) {
  const data = selectedGrains
    .filter(g => (percentages[g.id] || 0) > 0)
    .map(g => ({ name: g.name, value: percentages[g.id] || 0, category: g.category }));
  if (!data.length) return null;
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={52} outerRadius={85} paddingAngle={2} dataKey="value">
          {data.map((entry) => <Cell key={entry.name} fill={CATEGORY_COLORS[entry.category]} />)}
        </Pie>
        <Tooltip formatter={(v, name) => [`${v}%`, name]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function CategoryBlendList({ selectedGrains, percentages }) {
  const categories = ["Wheat", "Millet", "Seed", "Pulse", "Grain"];
  return (
    <div style={{ marginTop: 12 }}>
      {categories.map(cat => {
        const grains = selectedGrains.filter(g => g.category === cat && (percentages[g.id] || 0) > 0);
        if (!grains.length) return null;
        const catTotal = grains.reduce((s, g) => s + (percentages[g.id] || 0), 0);
        return (
          <div key={cat} style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: CATEGORY_COLORS[cat], flexShrink: 0 }} />
              <span style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6,
                color: CATEGORY_TEXT[cat], background: CATEGORY_COLORS[cat],
                padding: "2px 7px", borderRadius: 4,
              }}>{cat}</span>
              <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>{catTotal}%</span>
            </div>
            {grains.map(g => (
              <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 17, marginBottom: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: CATEGORY_COLORS[cat], flexShrink: 0, opacity: 0.7 }} />
                <span style={{ flex: 1, fontSize: 13, color: "#374151" }}>{g.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2D6A4F", minWidth: 34, textAlign: "right" }}>{percentages[g.id] || 0}%</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function calcNutrition(selectedGrains, percentages) {
  let kcal = 0, carbs = 0, protein = 0, fiber = 0, fat = 0;
  selectedGrains.forEach(g => {
    const pct = (percentages[g.id] || 0) / 100;
    const n = NUTRITION[g.category];
    kcal += n.kcal * pct;
    carbs += n.carbs * pct;
    protein += n.protein * pct;
    fiber += n.fiber * pct;
    fat += n.fat * pct;
  });
  const factor = 30 / 100;
  return {
    kcal: Math.round(kcal * factor * 10) / 10,
    carbs: Math.round(carbs * factor * 10) / 10,
    protein: Math.round(protein * factor * 10) / 10,
    fiber: Math.round(fiber * factor * 10) / 10,
    fat: Math.round(fat * factor * 10) / 10,
  };
}

function calcBenefitTags(selectedGrains, percentages) {
  const total = selectedGrains.reduce((s, g) => s + (percentages[g.id] || 0), 0);
  if (total === 0) return [];
  const pulsePct = selectedGrains.filter(g => g.category === "Pulse").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const milletPct = selectedGrains.filter(g => g.category === "Millet").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const seedPct = selectedGrains.filter(g => g.category === "Seed").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const wheatPct = selectedGrains.filter(g => g.category === "Wheat").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const oatsBarleyPct = selectedGrains.filter(g => ["oats", "jau_barley"].includes(g.id)).reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const tags = [];
  if (pulsePct > 30) tags.push("✅ High in Plant Protein");
  if (milletPct > 40) { tags.push("✅ Low Glycemic Index"); tags.push("✅ Diabetic Friendly"); }
  if (seedPct > 10) tags.push("✅ Rich in Omega-3");
  if (oatsBarleyPct > 30) { tags.push("✅ Gut Friendly"); tags.push("✅ Heart Healthy"); }
  if (milletPct > 40 && wheatPct < 30) tags.push("✅ Calorie Conscious");
  return tags;
}

function calcGI(selectedGrains, percentages) {
  const milletPulsePct = selectedGrains.filter(g => g.category === "Millet" || g.category === "Pulse").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const wheatPct = selectedGrains.filter(g => g.category === "Wheat").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  if (milletPulsePct >= wheatPct) return { gi: "45–52", label: "Low" };
  return { gi: "~60", label: "Medium" };
}

function calcCostPerKg(selectedGrains, percentages) {
  let cost = 0;
  selectedGrains.forEach(g => {
    cost += (g.pricePerKg * (percentages[g.id] || 0)) / 100;
  });
  return Math.round(cost);
}

function getCookingTips(selectedGrains, percentages) {
  const milletPct = selectedGrains.filter(g => g.category === "Millet").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const wheatPct = selectedGrains.filter(g => g.category === "Wheat").reduce((s, g) => s + (percentages[g.id] || 0), 0);
  const isSenior = wheatPct > 40 && milletPct < 30;
  if (isSenior) return [
    { label: "DOUGH", text: "Lukewarm water, knead 5–6 min — don't over-knead. Dough is softer than regular wheat. Easy on the hands." },
    { label: "TASTE", text: "Mild, delicate flavour — easy on the palate and digestion. Add ghee directly to dough for extra softness." },
    { label: "ROLLING", text: "Very forgiving dough — rolls smoothly. Medium thickness ideal for consistent softness. Easy on teeth and digestion." },
    { label: "COOKING", text: "Medium flame. These rotis cook quickly and stay soft. Remove before they turn crispy." },
    { label: "PRO HACK", text: "Add 1 tsp ajwain + pinch of turmeric to the dough — aids digestion naturally and reduces bloating." },
  ];
  if (milletPct > 40) return [
    { label: "DOUGH", text: "Warm water, knead 8 min, rest 20–25 min before rolling. Dough feels denser than wheat." },
    { label: "TASTE", text: "Earthy flavour — add ghee while cooking for beautifully aromatic chapatis." },
    { label: "ROLLING", text: "Roll medium to thick — thin rotis crack with high millet content. Use butter paper if sticking." },
    { label: "COOKING", text: "Medium flame only. Millets brown faster than wheat — flip when edges look dry." },
    { label: "PRO HACK", text: "Add 1 boiled mashed potato to dough — acts as a natural binder, prevents cracking." },
  ];
  return [
    { label: "DOUGH", text: "Warm water, knead 7–8 min, rest 15–20 min. Each grain absorbs at its own pace — resting unifies texture." },
    { label: "TASTE", text: "Complex, layered flavour. Try adding ¼ tsp ajwain or cumin — brings out the best of your grain combination." },
    { label: "ROLLING", text: "Start with medium thickness. If it cracks, add a touch more water. If it tears, roll slightly thicker." },
    { label: "COOKING", text: "Medium flame is safest. Watch the first batch closely — every custom blend behaves slightly differently." },
    { label: "PRO HACK", text: "Add 1 tsp oil while kneading — creates a moisture barrier, keeps rotis soft for hours." },
  ];
}

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [percentages, setPercentages] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePreset, setActivePreset] = useState(null);
  const [tipsOpen, setTipsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [blendName, setBlendName] = useState("My Custom Atta");
  const [tempName, setTempName] = useState("My Custom Atta");

  const selectedGrains = useMemo(() => GRAINS.filter(g => selectedIds.includes(g.id)), [selectedIds]);
  const totalPct = useMemo(() => selectedGrains.reduce((s, g) => s + (percentages[g.id] || 0), 0), [selectedGrains, percentages]);
  const nutrition = useMemo(() => calcNutrition(selectedGrains, percentages), [selectedGrains, percentages]);
  const benefitTags = useMemo(() => calcBenefitTags(selectedGrains, percentages), [selectedGrains, percentages]);
  const gi = useMemo(() => calcGI(selectedGrains, percentages), [selectedGrains, percentages]);
  const costPerKg = useMemo(() => calcCostPerKg(selectedGrains, percentages), [selectedGrains, percentages]);
  const cookingTips = useMemo(() => getCookingTips(selectedGrains, percentages), [selectedGrains, percentages]);

  const filteredGrains = activeCategory === "All" ? GRAINS : GRAINS.filter(g => g.category === activeCategory);

  const toggleGrain = useCallback((id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        const next = prev.filter(x => x !== id);
        setPercentages(p => { const n = { ...p }; delete n[id]; return n; });
        return next;
      }
      if (prev.length >= 10) return prev;
      return [...prev, id];
    });
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((preset) => {
    setActivePreset(preset.id);
    const ids = Object.keys(preset.grains);
    setSelectedIds(ids);
    setPercentages(preset.grains);
  }, []);

  const openCopyModal = useCallback(() => {
    setTempName(blendName);
    setShowRenameModal(true);
  }, [blendName]);

  const confirmCopy = useCallback(() => {
    const name = tempName.trim() || "My Custom Atta";
    setBlendName(name);
    setShowRenameModal(false);
    const categories = ["Wheat", "Millet", "Seed", "Pulse", "Grain"];
    let lines = [`🌾 ${name}\n`];
    categories.forEach(cat => {
      const grains = selectedGrains.filter(g => g.category === cat && (percentages[g.id] || 0) > 0);
      if (grains.length) {
        lines.push(`${cat}:`);
        grains.forEach(g => lines.push(`  ${g.name}: ${percentages[g.id]}%`));
      }
    });
    lines.push(`\nEst. Cost: ₹${costPerKg}/kg`);
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [tempName, selectedGrains, percentages, costPerKg]);

  const downloadPDF = useCallback(() => {
    const name = tempName.trim() || "My Custom Atta";
    setBlendName(name);
    setShowRenameModal(false);

    const categories = ["Wheat", "Millet", "Seed", "Pulse", "Grain"];
    const CAT_COLORS = { Wheat: "#D4A373", Millet: "#52B788", Seed: "#F4A261", Pulse: "#E76F51", Grain: "#ADB5BD" };
    const CAT_TEXT = { Wheat: "#7a5a35", Millet: "#1a5e3a", Seed: "#7a4a10", Pulse: "#7a2a10", Grain: "#3a3e44" };
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const grainRowsHtml = categories.map(cat => {
      const grains = selectedGrains.filter(g => g.category === cat && (percentages[g.id] || 0) > 0);
      if (!grains.length) return "";
      const catTotal = grains.reduce((s, g) => s + (percentages[g.id] || 0), 0);
      return `<div style="margin-bottom:12px">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <span style="font-size:9px;font-weight:700;text-transform:uppercase;padding:2px 7px;border-radius:4px;background:${CAT_COLORS[cat]};color:${CAT_TEXT[cat]}">${cat}</span>
          <span style="font-size:10px;color:#9ca3af;margin-left:auto">${catTotal}%</span>
        </div>
        ${grains.map(g => `
          <div style="display:flex;align-items:center;gap:7px;padding-left:14px;margin-bottom:3px">
            <span style="width:6px;height:6px;border-radius:50%;background:${CAT_COLORS[cat]};display:inline-block;flex-shrink:0"></span>
            <span style="flex:1;font-size:12px;color:#374151">${g.name}</span>
            <span style="font-size:12px;font-weight:700;color:#2D6A4F;min-width:30px;text-align:right">${percentages[g.id]}%</span>
          </div>`).join("")}
      </div>`;
    }).join("");

    const tagsHtml = benefitTags.length
      ? benefitTags.map(t => `<span style="background:#e9f5ef;color:#2D6A4F;font-size:10px;font-weight:600;padding:4px 9px;border-radius:14px;border:1px solid #95d5b2;display:inline-block;margin:2px">${t}</span>`).join("")
      : `<span style="font-size:11px;color:#9ca3af">No specific benefit tags for this blend</span>`;

    const tipsHtml = cookingTips.map(t =>
      `<div style="display:flex;gap:8px;margin-bottom:8px">
        <span style="font-size:11px;font-weight:700;color:#F4A261;white-space:nowrap;min-width:72px">${t.label}</span>
        <span style="font-size:11px;color:#374151;line-height:1.5">${t.text}</span>
      </div>`
    ).join("");

    const nutrCells = [["Carbs", nutrition.carbs], ["Protein", nutrition.protein], ["Fiber", nutrition.fiber], ["Fat", nutrition.fat]]
      .map(([label, val]) => `<td style="width:25%;padding:0 4px">
        <div style="background:#fefae0;border-radius:8px;padding:8px 10px">
          <div style="font-size:10px;color:#6B7280;margin-bottom:2px">${label}</div>
          <div style="font-size:16px;font-weight:800;color:#1B1B1B">${val}<span style="font-size:10px;font-weight:400;color:#6B7280">g</span></div>
        </div></td>`).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;background:#FEFAE0;color:#1B1B1B;padding:28px 32px;font-size:13px}
</style></head><body>
<div style="max-width:780px;margin:0 auto">
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:14px;border-bottom:2px solid #2D6A4F">
    <div>
      <div style="font-size:10px;color:#6B7280;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Make Your Own Atta &middot; Custom Blend</div>
      <div style="font-size:22px;font-weight:800;color:#2D6A4F">${name}</div>
    </div>
    <div style="background:#2D6A4F;color:#fff;border-radius:20px;padding:6px 16px;font-size:13px;font-weight:700">&#8377;${costPerKg}/kg</div>
  </div>
  <table style="width:100%;border-collapse:separate;border-spacing:12px 0;margin-bottom:16px"><tr valign="top">
    <td style="width:48%">
      <div style="background:#fff;border-radius:12px;border:1.5px solid #e8e0d0;padding:14px 16px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:10px">Blend Composition</div>
        ${grainRowsHtml}
      </div>
    </td>
    <td style="width:52%">
      <div style="background:#fff;border-radius:12px;border:1.5px solid #e8e0d0;padding:14px 16px;margin-bottom:12px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:10px">Nutrition &middot; per chapati (30g)</div>
        <div style="font-size:28px;font-weight:800;color:#2D6A4F;margin-bottom:10px">${nutrition.kcal} <span style="font-size:13px;font-weight:400;color:#6B7280">kcal</span></div>
        <table style="width:100%;border-collapse:separate;border-spacing:4px"><tr>${nutrCells}</tr></table>
        <div style="font-size:9px;color:#9ca3af;margin-top:6px">Approximate values &mdash; may vary by grain quality &amp; season</div>
        <div style="margin-top:8px">
          <span style="background:#e9f5ef;color:#2D6A4F;font-weight:700;font-size:11px;padding:4px 12px;border-radius:14px">GI ${gi.gi}</span>
          <span style="background:${gi.label === "Low" ? "#e9f5ef" : "#fff8ed"};color:${gi.label === "Low" ? "#2D6A4F" : "#b45309"};font-weight:700;font-size:11px;padding:4px 12px;border-radius:14px;margin-left:6px">${gi.label}</span>
        </div>
      </div>
      <div style="background:#fff;border-radius:12px;border:1.5px solid #e8e0d0;padding:14px 16px">
        <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:8px">Suggested Benefits</div>
        <div>${tagsHtml}</div>
        <div style="font-size:9px;color:#9ca3af;margin-top:8px">General suggestion. Consult your doctor for medical conditions.</div>
      </div>
    </td>
  </tr></table>
  <div style="background:#fff;border-radius:12px;border:1.5px solid #e8e0d0;padding:14px 16px;margin-bottom:16px">
    <div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#6B7280;margin-bottom:10px">Cooking Tips</div>
    ${tipsHtml}
  </div>
  <div style="padding-top:12px;border-top:1px solid #e8e0d0;font-size:9px;color:#9ca3af;display:flex;justify-content:space-between">
    <span>Generated by Make Your Own Atta</span><span>${today}</span>
  </div>
</div>
</body></html>`;

    // Encode as data URI and trigger download
    const encoded = "data:text/html;charset=utf-8," + encodeURIComponent(html);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = name.replace(/[^a-z0-9]/gi, "_") + ".html";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 500);
  }, [tempName, selectedGrains, percentages, costPerKg, nutrition, benefitTags, gi, cookingTips]);

  const resetAll = useCallback(() => {
    setStep(1); setSelectedIds([]); setPercentages({});
    setActiveCategory("All"); setActivePreset(null); setTipsOpen(false);
    setBlendName("My Custom Atta"); setTempName("My Custom Atta");
  }, []);

  const pctBarColor = totalPct === 100 ? "#2D6A4F" : totalPct > 100 ? "#ef4444" : "#F4A261";

  return (
    <div style={{ background: "#FEFAE0", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <StepBar step={step} />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 40px" }}>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <div style={{ padding: "24px 0 12px" }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#2D6A4F", margin: "0 0 4px" }}>Make Your Own Atta</h1>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>Choose 2–10 grains to build your perfect blend</p>
            </div>

            {/* Presets */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Health Blends</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {PRESETS.map(p => (
                  <button key={p.id} onClick={() => applyPreset(p)} style={{
                    padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: "1.5px solid", transition: "all 0.18s",
                    borderColor: activePreset === p.id ? "#2D6A4F" : "#d1c9b5",
                    background: activePreset === p.id ? "#2D6A4F" : "#fff",
                    color: activePreset === p.id ? "#fff" : "#374151",
                  }}>{p.label}</button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {["All", "Wheat", "Millet", "Seed", "Pulse", "Grain"].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  border: "1.5px solid",
                  borderColor: activeCategory === cat ? "#2D6A4F" : "#d1c9b5",
                  background: activeCategory === cat ? "#e9f5ef" : "#fff",
                  color: activeCategory === cat ? "#2D6A4F" : "#6B7280",
                  transition: "all 0.15s",
                }}>{cat}</button>
              ))}
            </div>

            {/* Selected count */}
            <div style={{
              marginBottom: 14, padding: "10px 14px",
              background: selectedIds.length >= 2 ? "#e9f5ef" : "#fff8ed",
              borderRadius: 10, fontSize: 13, fontWeight: 600,
              color: selectedIds.length >= 2 ? "#2D6A4F" : "#b45309",
              border: "1.5px solid",
              borderColor: selectedIds.length >= 2 ? "#95d5b2" : "#fde68a",
            }}>
              {selectedIds.length === 0 ? "Select at least 2 grains to continue" : `${selectedIds.length} grain${selectedIds.length > 1 ? "s" : ""} selected — ${10 - selectedIds.length} more allowed`}
            </div>

            {/* Grain grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
              {filteredGrains.map(g => (
                <GrainCard key={g.id} grain={g} selected={selectedIds.includes(g.id)} onToggle={toggleGrain} />
              ))}
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setStep(2)} disabled={selectedIds.length < 2} style={{
                padding: "13px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: selectedIds.length >= 2 ? "#2D6A4F" : "#d1c9b5",
                color: "#fff", border: "none", cursor: selectedIds.length >= 2 ? "pointer" : "not-allowed",
                transition: "all 0.18s",
              }}>Set Quantities →</button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <div style={{ padding: "24px 0 16px" }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2D6A4F", margin: "0 0 4px" }}>Set Quantities</h2>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>All percentages must add up to 100%</p>
            </div>

            {/* Chart + sliders layout */}
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
              {/* Chart */}
              <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e0d0", padding: "16px 12px 12px", minWidth: 260, flex: "0 0 290px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6B7280", textAlign: "center", marginBottom: 4 }}>Blend Preview</div>
                <BlendChart selectedGrains={selectedGrains} percentages={percentages} />
                <CategoryBlendList selectedGrains={selectedGrains} percentages={percentages} />
                {totalPct > 0 && (
                  <div style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#F4A261", marginTop: 8, paddingTop: 10, borderTop: "1px solid #e8e0d0" }}>
                    Est. ₹{costPerKg}/kg
                  </div>
                )}
              </div>

              {/* Sliders */}
              <div style={{ flex: 1, minWidth: 260 }}>
                {/* Progress bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Total</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: pctBarColor }}>{totalPct}%</span>
                  </div>
                  <div style={{ height: 10, background: "#e8e0d0", borderRadius: 8, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${Math.min(totalPct, 100)}%`,
                      background: pctBarColor, borderRadius: 8, transition: "width 0.2s, background 0.2s",
                    }} />
                  </div>
                  {totalPct !== 100 && (
                    <div style={{ fontSize: 12, color: totalPct > 100 ? "#ef4444" : "#b45309", marginTop: 5 }}>
                      {totalPct > 100 ? `Over by ${totalPct - 100}% — reduce some grains` : `${100 - totalPct}% remaining`}
                    </div>
                  )}
                </div>

                {selectedGrains.map((g, i) => (
                  <div key={g.id} style={{
                    background: "#fff", borderRadius: 12, border: "1.5px solid #e8e0d0",
                    padding: "14px 16px", marginBottom: 10,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: CATEGORY_COLORS[g.category], flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, fontSize: 14, flex: 1, color: "#1B1B1B" }}>{g.name}</span>
                      <input type="number" min="0" max="100" step="1"
                        value={percentages[g.id] || 0}
                        onChange={e => setPercentages(p => ({ ...p, [g.id]: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                        style={{
                          width: 58, textAlign: "center", fontWeight: 700, fontSize: 14,
                          border: "1.5px solid #e8e0d0", borderRadius: 7, padding: "4px 6px",
                          background: "#fefae0", color: "#2D6A4F",
                        }} />
                      <span style={{ fontSize: 14, color: "#6B7280", width: 14 }}>%</span>
                    </div>
                    <input type="range" min="0" max="100" step="1"
                      value={percentages[g.id] || 0}
                      onChange={e => setPercentages(p => ({ ...p, [g.id]: parseInt(e.target.value) }))}
                      style={{ width: "100%", accentColor: "#2D6A4F", height: 6 }} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(1)} style={{
                padding: "11px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: "#fff", border: "1.5px solid #d1c9b5", color: "#374151", cursor: "pointer",
              }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={totalPct !== 100} style={{
                padding: "13px 32px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                background: totalPct === 100 ? "#2D6A4F" : "#d1c9b5",
                color: "#fff", border: "none", cursor: totalPct === 100 ? "pointer" : "not-allowed",
                transition: "all 0.18s",
              }}>Review Summary →</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <div style={{ padding: "24px 0 16px" }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#2D6A4F", margin: "0 0 4px" }}>Your Custom Atta Blend</h2>
              <p style={{ color: "#6B7280", margin: 0, fontSize: 14 }}>Here's your personalised grain blend summary</p>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start" }}>
              {/* Chart + grain list */}
              <div style={{ background: "#fff", borderRadius: 16, border: "1.5px solid #e8e0d0", padding: 20, flex: "0 0 290px", minWidth: 260 }}>
                <BlendChart selectedGrains={selectedGrains} percentages={percentages} />
                <CategoryBlendList selectedGrains={selectedGrains} percentages={percentages} />
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e8e0d0", fontSize: 13, fontWeight: 700, color: "#F4A261" }}>
                  Est. Cost: ₹{costPerKg}/kg
                </div>
              </div>

              {/* Nutrition + tags */}
              <div style={{ flex: 1, minWidth: 260 }}>
                {/* Nutrition */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e0d0", padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6B7280", marginBottom: 12 }}>Nutrition · per chapati (30g blend)</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
                    <span style={{ fontSize: 11, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5 }}>Energy</span>
                    <span style={{ fontSize: 30, fontWeight: 800, color: "#2D6A4F" }}>{nutrition.kcal}</span>
                    <span style={{ fontSize: 14, color: "#6B7280" }}>kcal</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Carbs", value: nutrition.carbs },
                      { label: "Protein", value: nutrition.protein },
                      { label: "Fiber", value: nutrition.fiber },
                      { label: "Fat", value: nutrition.fat },
                    ].map(n => (
                      <div key={n.label} style={{ background: "#fefae0", borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>{n.label}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: "#1B1B1B" }}>{n.value}<span style={{ fontSize: 12, fontWeight: 400, marginLeft: 2, color: "#6B7280" }}>g</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 10 }}>Approximate values — may vary by grain quality & season</div>
                </div>

                {/* GI */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e0d0", padding: "14px 18px", marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6B7280", marginBottom: 10 }}>Glycemic Index Estimate</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ background: "#e9f5ef", color: "#2D6A4F", fontWeight: 700, fontSize: 14, padding: "6px 14px", borderRadius: 20 }}>GI {gi.gi}</span>
                    <span style={{ background: gi.label === "Low" ? "#e9f5ef" : "#fff8ed", color: gi.label === "Low" ? "#2D6A4F" : "#b45309", fontWeight: 700, fontSize: 14, padding: "6px 14px", borderRadius: 20 }}>{gi.label}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>Approximate — consult your dietician for medical conditions.</div>
                </div>

                {/* Benefit tags */}
                {benefitTags.length > 0 && (
                  <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e0d0", padding: "14px 18px", marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6B7280", marginBottom: 10 }}>Suggested Benefits</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {benefitTags.map(tag => (
                        <span key={tag} style={{
                          background: "#e9f5ef", color: "#2D6A4F", fontSize: 13, fontWeight: 600,
                          padding: "6px 12px", borderRadius: 20, border: "1px solid #95d5b2",
                        }}>{tag}</span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>General suggestion. Consult your doctor for medical conditions.</div>
                  </div>
                )}

                {/* Cooking tips accordion */}
                <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e8e0d0", overflow: "hidden" }}>
                  <button onClick={() => setTipsOpen(o => !o)} style={{
                    width: "100%", padding: "14px 18px", background: "none", border: "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#374151",
                  }}>
                    <span>🍞 Cooking Tips</span>
                    <span style={{ transition: "transform 0.2s", transform: tipsOpen ? "rotate(180deg)" : "none", fontSize: 18, color: "#2D6A4F" }}>▾</span>
                  </button>
                  {tipsOpen && (
                    <div style={{ padding: "0 18px 16px", borderTop: "1px solid #e8e0d0" }}>
                      {cookingTips.map(tip => (
                        <div key={tip.label} style={{ marginTop: 12 }}>
                          <span style={{ fontWeight: 700, color: "#F4A261", fontSize: 13 }}>{tip.label} — </span>
                          <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{tip.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ marginTop: 24, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => setStep(2)} style={{
                padding: "11px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                background: "#fff", border: "1.5px solid #d1c9b5", color: "#374151", cursor: "pointer",
              }}>← Back</button>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button onClick={openCopyModal} style={{
                  padding: "11px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: "#2D6A4F", border: "none",
                  color: "#fff", cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap",
                }}>{copied ? "✅ Copied!" : "📋 Copy Blend"}</button>
                <button onClick={resetAll} style={{
                  padding: "11px 20px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: "#fff", border: "1.5px solid #F4A261", color: "#F4A261", cursor: "pointer", whiteSpace: "nowrap",
                }}>🔄 Start Over</button>
              </div>
            </div>

            {/* Rename & Copy Modal */}
            {showRenameModal && (
              <div style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100,
                display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
              }}
                onClick={(e) => { if (e.target === e.currentTarget) setShowRenameModal(false); }}
              >
                <div style={{
                  background: "#FEFAE0", borderRadius: 18, padding: 28, width: "100%", maxWidth: 440,
                  border: "2px solid #2D6A4F", boxShadow: "0 8px 40px rgba(45,106,79,0.22)",
                }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#2D6A4F", marginBottom: 5 }}>Name Your Blend</div>
                  <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 18 }}>Give your custom atta a name before saving or sharing</div>
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && confirmCopy()}
                    maxLength={60}
                    autoFocus
                    placeholder="e.g. My Diabetes Friendly Atta"
                    style={{
                      width: "100%", padding: "12px 14px", borderRadius: 10, fontSize: 15, fontWeight: 600,
                      border: "2px solid #2D6A4F", background: "#fff", color: "#1B1B1B",
                      outline: "none", boxSizing: "border-box", marginBottom: 18,
                    }}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <button onClick={confirmCopy} style={{
                      width: "100%", padding: "13px", borderRadius: 10, fontSize: 14, fontWeight: 700,
                      background: "#2D6A4F", border: "none", color: "#fff", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}>
                      📋 Copy Blend to Clipboard
                    </button>
                    <button onClick={() => setShowRenameModal(false)} style={{
                      width: "100%", padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                      background: "transparent", border: "1px solid #d1c9b5", color: "#6B7280", cursor: "pointer",
                    }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
