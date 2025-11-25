"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Flame, RefreshCw, AlertCircle } from "lucide-react";

// --- TYPES ---
type Recipe = {
  id: string;
  title: string;
  tagline: string;
  prepTime: number;
  calories: number;
  tags: string[];
  ingredients: { item: string; amount: string }[];
  steps: { action: string; description: string }[];
};

// --- COMPONENTS ---

const ChefLoader = () => (
  <div className="flex flex-col items-center gap-6">
    <div className="relative">
      <div className="absolute inset-0 bg-accent blur-xl opacity-20 animate-pulse" />
      <Flame className="w-16 h-16 text-accent animate-bounce" strokeWidth={1.5} />
    </div>
    <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink/70 animate-pulse">
      Chef is thinking...
    </p>
  </div>
);

const RecipeTicket = ({ recipe, index }: { recipe: Recipe; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className="group bg-[#FDFCF8] border border-ink flex flex-col shadow-hard hover:shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 h-full"
  >
    {/* Header */}
    <div className="bg-ink text-paper p-5 flex justify-between items-start">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-1">
          Ticket #{recipe.id}
        </span>
        <h3 className="font-serif text-3xl leading-[0.95]">{recipe.title}</h3>
      </div>
      <Flame className="w-5 h-5 text-accent fill-current mt-1" />
    </div>

    {/* Stats */}
    <div className="flex border-b border-ink divide-x divide-ink bg-paper">
      <div className="flex-1 py-3 flex items-center justify-center gap-2">
        <Clock className="w-3 h-3 text-ink/60" />
        <span className="font-mono text-xs font-bold">{recipe.prepTime}m</span>
      </div>
      <div className="flex-1 py-3 flex items-center justify-center">
        <span className="font-mono text-xs font-bold">{recipe.calories} kcal</span>
      </div>
      <div className="flex-1 py-3 flex items-center justify-center bg-kale/10 text-kale">
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
          {recipe.tags?.[0] || "Fresh"}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className="p-6 md:p-8 flex-1 flex flex-col">
      <p className="font-serif italic text-xl text-ink/70 mb-8 leading-tight">
        "{recipe.tagline}"
      </p>

      <div className="grid gap-8 mb-8">
        {/* Ingredients */}
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest border-b border-ink pb-2 mb-3 opacity-50">
            Mise en place
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className="flex justify-between text-sm border-b border-ink/10 pb-1">
                <span className="font-sans font-medium">{ing.item}</span>
                <span className="font-mono text-xs text-ink/50">{ing.amount}</span>
              </li>
            )) || <li className="text-sm opacity-50">No ingredients listed</li>}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest border-b border-ink pb-2 mb-3 opacity-50">
            Execution
          </h4>
          <div className="space-y-5">
            {recipe.steps?.map((step, i) => (
              <div key={i} className="relative pl-6 group/step">
                <span className="absolute left-0 top-0 font-mono text-[10px] text-accent font-bold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-lg block mb-1 group-hover/step:text-accent transition-colors">
                  {step.action}
                </span>
                <p className="font-sans text-sm text-ink/70">{step.description}</p>
              </div>
            )) || <div className="text-sm opacity-50">Instructions pending...</div>}
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-auto border-t border-ink p-4 bg-paper flex justify-between items-center">
      <span className="font-mono text-[10px] text-ink/40">AI_GEN_V1</span>
      <button className="bg-ink text-paper font-mono text-xs uppercase font-bold px-6 py-2 hover:bg-accent transition-colors">
        Start Cooking
      </button>
    </div>
  </motion.div>
);

// --- MAIN PAGE ---

export default function Home() {
  const [view, setView] = useState<"INPUT" | "LOADING" | "RESULTS" | "ERROR">("INPUT");
  const [craving, setCraving] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSearch = async () => {
    if (!craving.trim()) return;
    setView("LOADING");
    setErrorMsg("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ craving }),
      });

      const data = await res.json();

      // Defensive: Ensure data is an array before setting state
      if (Array.isArray(data)) {
        setRecipes(data);
        setView("RESULTS");
      } else {
        console.error("API returned unexpected format:", data);
        setErrorMsg(data.error || "The Chef returned an unreadable ticket.");
        setView("ERROR");
      }
    } catch (e) {
      console.error("Network Error:", e);
      setErrorMsg("Failed to reach the kitchen server.");
      setView("ERROR");
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col p-6 md:p-12">
      {/* Navigation / Header */}
      <header className="flex justify-between items-center mb-12 z-10">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-accent rotate-45" />
          <span className="font-mono text-sm tracking-[0.2em] font-bold">SOUS CHEF</span>
        </div>
        {(view === "RESULTS" || view === "ERROR") && (
          <button 
            onClick={() => setView("INPUT")} 
            className="flex items-center gap-2 font-mono text-xs uppercase hover:text-accent"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        )}
      </header>

      {/* Content Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full justify-center">
        <AnimatePresence mode="wait">
          
          {/* VIEW: INPUT */}
          {view === "INPUT" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-3xl"
            >
              <label className="block font-serif text-5xl md:text-7xl lg:text-8xl text-ink mb-8 leading-[0.9]">
                What are we cooking <span className="italic text-accent">tonight?</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={craving}
                  onChange={(e) => setCraving(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g. Spicy noodles, crispy fish..."
                  className="w-full bg-transparent border-b-4 border-ink/10 py-4 text-2xl md:text-4xl font-sans focus:border-accent outline-none placeholder:text-ink/20"
                  autoFocus
                />
                <button 
                  onClick={handleSearch} 
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-4"
                >
                  <ArrowRight className="w-8 h-8 text-accent" />
                </button>
              </div>
            </motion.div>
          )}

          {/* VIEW: LOADING */}
          {view === "LOADING" && (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
            >
              <div className="flex justify-center h-[50vh]"><ChefLoader /></div>
            </motion.div>
          )}

          {/* VIEW: ERROR */}
          {view === "ERROR" && (
            <motion.div 
              key="error" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center w-full max-w-xl mx-auto"
            >
              <AlertCircle className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="font-serif text-3xl mb-2">Kitchen Error</h2>
              <p className="font-mono text-sm text-ink/60 mb-8">{errorMsg}</p>
              <button 
                onClick={() => setView("INPUT")} 
                className="bg-ink text-paper px-6 py-3 font-mono uppercase font-bold hover:bg-accent transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* VIEW: RESULTS */}
          {view === "RESULTS" && (
            <motion.div 
              key="results" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="w-full pb-12"
            >
              <h2 className="font-serif text-4xl mb-12">Service for "{craving}"</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recipes.map((r, i) => <RecipeTicket key={i} recipe={r} index={i} />)}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}