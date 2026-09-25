"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { HiCalculator, HiLightningBolt, HiRefresh } from "react-icons/hi";
import { GiMuscleUp, GiWeightScale } from "react-icons/gi";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "bmi" | "calories";
type Goal = "loss" | "maintain" | "gain";
type Activity = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;

interface BMIResult {
    value: number;
    category: string;
    color: string;
    advice: string;
    percent: number; // 0-100 for dial
}

interface CaloriesResult {
    bmr: number;
    tdee: number;
    target: number;
    protein: number;
    carbs: number;
    fat: number;
}

// ─── BMI helpers ─────────────────────────────────────────────────────────────
function calcBMI(weightKg: number, heightCm: number): BMIResult {
    const h = heightCm / 100;
    const bmi = weightKg / (h * h);
    const v = Math.round(bmi * 10) / 10;

    if (v < 18.5)
        return { value: v, category: "Underweight", color: "#6ee7f9", advice: "Focus on muscle-building nutrition programs.", percent: (v / 40) * 100 };
    if (v < 25)
        return { value: v, category: "Healthy", color: "#00f08a", advice: "Keep it up — maintain with strength training.", percent: (v / 40) * 100 };
    if (v < 30)
        return { value: v, category: "Overweight", color: "#f8d65d", advice: "HIIT + cardio sessions will accelerate results.", percent: (v / 40) * 100 };
    return { value: v, category: "Obese", color: "#fb7185", advice: "A personalised PT plan will transform your body.", percent: Math.min((v / 40) * 100, 100) };
}

// ─── Mifflin-St Jeor TDEE ────────────────────────────────────────────────────
function calcCalories(
    weightKg: number,
    heightCm: number,
    age: number,
    isMale: boolean,
    activity: Activity,
    goal: Goal
): CaloriesResult {
    const bmr = isMale
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const tdee = Math.round(bmr * activity);
    const target =
        goal === "loss" ? tdee - 500 : goal === "gain" ? tdee + 300 : tdee;
    const protein = Math.round(weightKg * 2.0);
    const fat = Math.round((target * 0.25) / 9);
    const carbs = Math.round((target - protein * 4 - fat * 9) / 4);
    return { bmr: Math.round(bmr), tdee, target, protein, carbs: Math.max(carbs, 0), fat };
}

// ─── SVG Radial Dial ─────────────────────────────────────────────────────────
function BMIDial({ bmi, color, shouldReduceMotion }: { bmi: BMIResult; color: string; shouldReduceMotion: boolean | null }) {
    const radius = 52;
    const circ = 2 * Math.PI * radius;
    // Map BMI 10–40 onto arc. Arc goes 270° (¾ circle), so offset = circumference*0.75
    const arcLength = circ * 0.75;
    const mapped = Math.max(0, Math.min(1, (bmi.value - 10) / 30));
    const dashOffset = arcLength - mapped * arcLength;

    return (
        <div className="relative flex items-center justify-center w-36 h-36 mx-auto mb-4">
            <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-[225deg]">
                {/* Track */}
                <circle
                    cx="64" cy="64" r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="10"
                    strokeDasharray={`${arcLength} ${circ}`}
                    strokeLinecap="round"
                />
                {/* Filled arc */}
                <motion.circle
                    cx="64" cy="64" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="10"
                    strokeDasharray={`${arcLength} ${circ}`}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: arcLength }}
                    animate={{ strokeDashoffset: shouldReduceMotion ? dashOffset : dashOffset }}
                    transition={{ duration: shouldReduceMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
                    style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                    strokeDashoffset={dashOffset}
                />
            </svg>
            {/* Centre label */}
            <div className="relative text-center z-10">
                <div className="font-display text-3xl font-bold" style={{ color }}>
                    {bmi.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/50">BMI</div>
            </div>
        </div>
    );
}

// ─── Macro bar ────────────────────────────────────────────────────────────────
function MacroBar({ label, grams, color, max }: { label: string; grams: number; color: string; max: number }) {
    const pct = Math.min((grams / max) * 100, 100);
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-xs">
                <span className="text-white/60 uppercase tracking-wider">{label}</span>
                <span className="font-bold" style={{ color }}>{grams}g</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>
        </div>
    );
}

// ─── Slider input ─────────────────────────────────────────────────────────────
function Slider({ label, value, min, max, unit, onChange, color = "var(--primary)" }: {
    label: string; value: number; min: number; max: number; unit: string;
    onChange: (v: number) => void; color?: string;
}) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs text-white/60 uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold" style={{ color }}>{value}<span className="text-white/40 text-xs ml-0.5">{unit}</span></span>
            </div>
            <div className="relative h-6 flex items-center">
                <div className="absolute inset-x-0 h-1.5 rounded-full bg-white/10" />
                <div
                    className="absolute left-0 h-1.5 rounded-full transition-all duration-100"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                />
                <input
                    type="range" min={min} max={max} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="calc-slider absolute inset-0 w-full opacity-0 cursor-pointer h-6"
                    aria-label={label}
                />
                {/* Thumb indicator */}
                <div
                    className="absolute w-4 h-4 rounded-full border-2 shadow-lg transition-all duration-100 pointer-events-none"
                    style={{ left: `calc(${pct}% - 8px)`, backgroundColor: color, borderColor: "rgba(0,0,0,0.3)" }}
                />
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function FitnessCalculator() {
    const [tab, setTab] = useState<Tab>("bmi");
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [age, setAge] = useState(28);
    const [isMale, setIsMale] = useState(true);
    const [activity, setActivity] = useState<Activity>(1.55);
    const [goal, setGoal] = useState<Goal>("maintain");
    const [animKey, setAnimKey] = useState(0);
    const shouldReduceMotion = useReducedMotion();

    const bmiResult = calcBMI(weight, height);
    const calResult = calcCalories(weight, height, age, isMale, activity, goal);

    const reset = useCallback(() => {
        setWeight(70); setHeight(170); setAge(28);
        setIsMale(true); setActivity(1.55); setGoal("maintain");
        setAnimKey(k => k + 1);
    }, []);

    // Re-trigger dial animation when values change
    useEffect(() => { setAnimKey(k => k + 1); }, [weight, height, age, isMale, activity, goal]);

    const activityLabels: Record<Activity, string> = {
        1.2: "Sedentary", 1.375: "Light", 1.55: "Moderate", 1.725: "Active", 1.9: "Very Active"
    };

    const goalColors: Record<Goal, string> = {
        loss: "#fb7185", maintain: "#00f08a", gain: "#6ee7f9"
    };

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[var(--primary)]">Fitness Tools</p>
                    <h2 className="mt-0.5 text-xl font-bold text-[var(--card-foreground)] leading-tight">
                        Body <span className="text-[var(--primary)]">Calculator</span>
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }}
                        onClick={reset}
                        transition={{ duration: 0.4 }}
                        aria-label="Reset calculator"
                        className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-[var(--primary)] hover:border-[var(--primary)]/40 transition-colors"
                    >
                        <HiRefresh className="w-4 h-4" />
                    </motion.button>
                    <motion.div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--primary)]/15 text-[var(--primary)]"
                        animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <HiCalculator className="h-5 w-5" />
                    </motion.div>
                </div>
            </div>

            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-4 bg-white/[0.03]">
                {(["bmi", "calories"] as Tab[]).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 ${
                            tab === t
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "text-white/50 hover:text-white"
                        }`}
                    >
                        {t === "bmi" ? <GiWeightScale className="w-3.5 h-3.5" /> : <GiMuscleUp className="w-3.5 h-3.5" />}
                        {t === "bmi" ? "BMI" : "Calories"}
                    </button>
                ))}
            </div>

            {/* Shared sliders */}
            <div className="space-y-3 mb-4">
                <Slider label="Weight" value={weight} min={40} max={150} unit="kg" onChange={setWeight} color="var(--primary)" />
                <Slider label="Height" value={height} min={140} max={220} unit="cm" onChange={setHeight} color="var(--cyan)" />
                {tab === "calories" && (
                    <Slider label="Age" value={age} min={15} max={80} unit="yr" onChange={setAge} color="var(--secondary)" />
                )}
            </div>

            {/* Calories-only controls */}
            <AnimatePresence mode="wait">
                {tab === "calories" && (
                    <motion.div
                        key="cal-controls"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3 mb-4 overflow-hidden"
                    >
                        {/* Gender */}
                        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                            {[true, false].map((male) => (
                                <button
                                    key={String(male)}
                                    onClick={() => setIsMale(male)}
                                    className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                                        isMale === male
                                            ? "bg-[var(--cyan)]/20 text-[var(--cyan)] border-[var(--cyan)]/30 border"
                                            : "text-white/40 hover:text-white"
                                    }`}
                                >
                                    {male ? "Male" : "Female"}
                                </button>
                            ))}
                        </div>

                        {/* Activity level */}
                        <div className="space-y-1.5">
                            <span className="text-xs text-white/60 uppercase tracking-wider">Activity Level</span>
                            <div className="grid grid-cols-5 gap-1">
                                {([1.2, 1.375, 1.55, 1.725, 1.9] as Activity[]).map((lvl) => (
                                    <button
                                        key={lvl}
                                        onClick={() => setActivity(lvl)}
                                        title={activityLabels[lvl]}
                                        className={`rounded-lg py-1 text-[10px] font-bold uppercase transition-all duration-200 ${
                                            activity === lvl
                                                ? "bg-[var(--secondary)]/20 text-[var(--secondary)] border border-[var(--secondary)]/30"
                                                : "bg-white/5 text-white/40 border border-white/10 hover:text-white"
                                        }`}
                                    >
                                        {activityLabels[lvl].slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Goal */}
                        <div className="flex rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
                            {(["loss", "maintain", "gain"] as Goal[]).map((g) => (
                                <button
                                    key={g}
                                    onClick={() => setGoal(g)}
                                    className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                                        goal === g
                                            ? "text-[var(--primary-foreground)]"
                                            : "text-white/40 hover:text-white"
                                    }`}
                                    style={goal === g ? { backgroundColor: goalColors[g] } : {}}
                                >
                                    {g === "loss" ? "Cut" : g === "maintain" ? "Maintain" : "Bulk"}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence mode="wait">
                {tab === "bmi" ? (
                    <motion.div
                        key={`bmi-${animKey}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1"
                    >
                        <BMIDial key={animKey} bmi={bmiResult} color={bmiResult.color} shouldReduceMotion={shouldReduceMotion} />

                        {/* Category badge */}
                        <div className="text-center mb-3">
                            <motion.span
                                key={bmiResult.category}
                                initial={{ scale: 0.85, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border"
                                style={{
                                    color: bmiResult.color,
                                    borderColor: `${bmiResult.color}44`,
                                    backgroundColor: `${bmiResult.color}14`,
                                }}
                            >
                                {bmiResult.category}
                            </motion.span>
                        </div>

                        {/* BMI scale */}
                        <div className="relative h-2 rounded-full overflow-hidden mb-2"
                            style={{ background: "linear-gradient(90deg, #6ee7f9 0%, #00f08a 30%, #f8d65d 60%, #fb7185 100%)" }}
                        >
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-black/40 shadow-lg"
                                initial={{ left: "0%" }}
                                animate={{ left: `${Math.min(bmiResult.percent, 97)}%` }}
                                transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: [0.22, 1, 0.36, 1] }}
                            />
                        </div>
                        <div className="flex justify-between text-[9px] text-white/30 uppercase tracking-wider mb-3">
                            <span>Under</span><span>Healthy</span><span>Over</span><span>Obese</span>
                        </div>

                        {/* Advice */}
                        <div className="rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.02] border border-white/10 p-3">
                            <div className="flex items-start gap-2">
                                <HiLightningBolt className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: bmiResult.color }} />
                                <p className="text-xs text-white/70 leading-relaxed">{bmiResult.advice}</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key={`cal-${animKey}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1 space-y-3"
                    >
                        {/* TDEE display */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: "BMR", value: calResult.bmr, color: "var(--cyan)" },
                                { label: "TDEE", value: calResult.tdee, color: "var(--secondary)" },
                                { label: "Target", value: calResult.target, color: goalColors[goal] },
                            ].map((item) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 text-center"
                                >
                                    <div className="font-display text-xl font-bold" style={{ color: item.color }}>
                                        {item.value.toLocaleString()}
                                    </div>
                                    <div className="text-[9px] uppercase tracking-wider text-white/40 mt-0.5">{item.label} kcal</div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Macros */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 space-y-2.5">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Daily Macros</p>
                            <MacroBar label="Protein" grams={calResult.protein} color="#00f08a" max={300} />
                            <MacroBar label="Carbs" grams={calResult.carbs} color="#f8d65d" max={500} />
                            <MacroBar label="Fat" grams={calResult.fat} color="#fb7185" max={150} />
                        </div>

                        {/* CTA hint */}
                        <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]/8 border border-[var(--primary)]/20 p-3">
                            <div className="flex items-center gap-2">
                                <HiLightningBolt className="w-4 h-4 text-[var(--secondary)] flex-shrink-0" />
                                <p className="text-xs text-white/70 leading-relaxed">
                                    Our nutritionist can build a{" "}
                                    <span style={{ color: goalColors[goal] }} className="font-semibold">
                                        {goal === "loss" ? "fat loss" : goal === "gain" ? "muscle gain" : "maintenance"}
                                    </span>{" "}
                                    meal plan tailored to you.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
