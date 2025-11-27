"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Flame, RefreshCw, AlertCircle, Plus, Martini } from "lucide-react";

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

type Tab = "FOOD" | "DRINK";

// --- COMPONENTS ---

const ChefLoader = ({ type }: { type: Tab }) => (
  <div className="flex flex-col items-center gap-6">
    <div className="relative">
      <div className={`absolute inset-0 blur-xl opacity-20 animate-pulse ${type === "DRINK" ? "bg-jazz-accent" : "bg-accent"}`} />
      {type === "DRINK" ? (
        <Martini className="w-16 h-16 text-jazz-accent animate-bounce" strokeWidth={1.5} />
      ) : (
        <Flame className="w-16 h-16 text-accent animate-bounce" strokeWidth={1.5} />
      )}
    </div>
    <p className={`font-mono text-sm uppercase tracking-[0.2em] animate-pulse ${type === "DRINK" ? "text-jazz-text/70" : "text-ink/70"}`}>
      {type === "DRINK" ? "Mixologist is pouring..." : "Chef is thinking..."}
    </p>
  </div>
);

const RecipeTicket = ({ recipe, index, type, onCopy, isCopied }: { recipe: Recipe; index: number; type: Tab; onCopy: () => void; isCopied: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.2, duration: 0.5 }}
    className={`group border flex flex-col shadow-hard hover:shadow-hard-sm hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-200 h-full ${type === "DRINK" ? "bg-[#1A103C] border-jazz-accent/30" : "bg-[#FDFCF8] border-ink"
      }`}
  >
    {/* Header */}
    <div className={`p-5 flex justify-between items-start ${type === "DRINK" ? "bg-jazz-bg text-jazz-accent" : "bg-ink text-paper"}`}>
      <div>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-60 block mb-1">
          Ticket #{recipe.id}
        </span>
        <h3 className="font-serif text-3xl leading-[0.95]">{recipe.title}</h3>
      </div>
      {type === "DRINK" ? <Martini className="w-5 h-5 fill-current mt-1" /> : <Flame className="w-5 h-5 fill-current mt-1" />}
    </div>

    {/* Stats */}
    <div className={`flex border-b divide-x ${type === "DRINK" ? "bg-[#2A204C] border-jazz-accent/20 divide-jazz-accent/20 text-jazz-text" : "bg-paper border-ink divide-ink text-ink"}`}>
      <div className="flex-1 py-3 flex items-center justify-center gap-2">
        <Clock className="w-3 h-3 opacity-60" />
        <span className="font-mono text-xs font-bold">{recipe.prepTime}m</span>
      </div>
      <div className="flex-1 py-3 flex items-center justify-center">
        <span className="font-mono text-xs font-bold">{recipe.calories} kcal</span>
      </div>
      <div className={`flex-1 py-3 flex items-center justify-center ${type === "DRINK" ? "bg-jazz-accent/10 text-jazz-accent" : "bg-kale/10 text-kale"}`}>
        <span className="font-mono text-[10px] uppercase font-bold tracking-wider">
          {recipe.tags?.[0] || (type === "DRINK" ? "Classic" : "Fresh")}
        </span>
      </div>
    </div>

    {/* Body */}
    <div className={`p-6 md:p-8 flex-1 flex flex-col ${type === "DRINK" ? "text-jazz-text" : "text-ink"}`}>
      <p className="font-serif italic text-xl opacity-70 mb-8 leading-tight">
        "{recipe.tagline}"
      </p>

      <div className="grid gap-8 mb-8">
        {/* Ingredients */}
        <div>
          <h4 className={`font-mono text-[10px] uppercase tracking-widest border-b pb-2 mb-3 opacity-50 ${type === "DRINK" ? "border-jazz-accent/30" : "border-ink"}`}>
            Mise en place
          </h4>
          <ul className="space-y-2">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className={`flex justify-between text-sm border-b pb-1 ${type === "DRINK" ? "border-jazz-accent/10" : "border-ink/10"}`}>
                <span className="font-sans font-medium">{ing.item}</span>
                <span className="font-mono text-xs opacity-50">{ing.amount}</span>
              </li>
            )) || <li className="text-sm opacity-50">No ingredients listed</li>}
          </ul>
        </div>

        {/* Steps */}
        <div>
          <h4 className={`font-mono text-[10px] uppercase tracking-widest border-b pb-2 mb-3 opacity-50 ${type === "DRINK" ? "border-jazz-accent/30" : "border-ink"}`}>
            Execution
          </h4>
          <div className="space-y-5">
            {recipe.steps?.map((step, i) => (
              <div key={i} className="relative pl-6 group/step">
                <span className={`absolute left-0 top-0 font-mono text-[10px] font-bold ${type === "DRINK" ? "text-jazz-accent" : "text-accent"}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={`font-serif text-lg block mb-1 transition-colors ${type === "DRINK" ? "group-hover/step:text-jazz-accent" : "group-hover/step:text-accent"}`}>
                  {step.action}
                </span>
                <p className="font-sans text-sm opacity-70">{step.description}</p>
              </div>
            )) || <div className="text-sm opacity-50">Instructions pending...</div>}
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className={`mt-auto border-t p-4 flex justify-between items-center ${type === "DRINK" ? "bg-[#1A103C] border-jazz-accent/20" : "bg-paper border-ink"}`}>
      <span className="font-mono text-[10px] opacity-40">AI_GEN_V1</span>
      <button
        onClick={onCopy}
        className={`font-mono text-xs uppercase font-bold px-6 py-2 transition-colors ${type === "DRINK"
            ? "bg-jazz-accent text-jazz-bg hover:bg-white"
            : "bg-ink text-paper hover:bg-accent"
          }`}>
        {isCopied ? "Copied!" : (type === "DRINK" ? "Start Mixing" : "Start Cooking")}
      </button>
    </div>
  </motion.div>
);

// --- MAIN PAGE ---

export default function Home() {
  const [view, setView] = useState<"INPUT" | "LOADING" | "RESULTS" | "ERROR">("INPUT");
  const [activeTab, setActiveTab] = useState<Tab>("FOOD");

  // Food State
  const [craving, setCraving] = useState("");

  // Drink State
  const [drinkCraving, setDrinkCraving] = useState(""); // "What are we drinking?"
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [userIngredients, setUserIngredients] = useState<string[]>([]);
  const [customIngredient, setCustomIngredient] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  const commonIngredients = [
    "Gin", "Vodka", "Rum", "Whiskey", "Tequila", "Vermouth", "Campari",
    "Lemon", "Lime", "Mint", "Basil", "Rich Syrup", "Simple Syrup",
    "Coke", "Sprite", "Bitters", "Egg White"
  ];

  const allIngredients = [...commonIngredients, ...userIngredients];

  const toggleIngredient = (ing: string) => {
    if (selectedIngredients.includes(ing)) {
      setSelectedIngredients(prev => prev.filter(i => i !== ing));
    } else {
      setSelectedIngredients(prev => [...prev, ing]);
    }
  };

  const addCustomIngredient = () => {
    const trimmed = customIngredient.trim();
    if (trimmed) {
      if (!allIngredients.includes(trimmed)) {
        setUserIngredients(prev => [...prev, trimmed]);
      }
      if (!selectedIngredients.includes(trimmed)) {
        setSelectedIngredients(prev => [...prev, trimmed]);
      }
      setCustomIngredient("");
    }
  };

  const copyRecipe = async (recipe: Recipe) => {
    const text = `
${recipe.title.toUpperCase()}
"${recipe.tagline}"

STATS
Prep: ${recipe.prepTime}m | ${recipe.calories} kcal

INGREDIENTS
${recipe.ingredients.map(i => `- ${i.item}: ${i.amount}`).join("\n")}

INSTRUCTIONS
${recipe.steps.map((s, i) => `${i + 1}. ${s.action} - ${s.description}`).join("\n")}

Generated by Su Chef 👨‍🍳
    `.trim();

    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(recipe.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleSearch = async () => {
    const mainInput = activeTab === "FOOD" ? craving : drinkCraving;
    if (!mainInput.trim()) return;

    setView("LOADING");
    setErrorMsg("");

    try {
      const payload = {
        craving: mainInput,
        type: activeTab,
        ...(activeTab === "DRINK" && {
          ingredients: selectedIngredients,
          // Mood removed, using mainInput as context
        })
      };

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

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

  const reset = () => {
    setView("INPUT");
    setRecipes([]);
    setErrorMsg("");
  };

  return (
    <main className={`min-h-screen w-full flex flex-col p-6 md:p-12 transition-colors duration-500 ${activeTab === "DRINK" ? "bg-jazz-bg text-jazz-text" : "bg-paper text-ink"}`}>
      {/* Navigation / Header */}
      <header className="flex justify-between items-center mb-12 z-10">
        <div className="flex items-center gap-3">
          <img src="/icon.svg" alt="Su Chef Logo" className="w-5 h-5" />
          <span className="font-mono text-sm tracking-[0.2em] font-bold">SU CHEF</span>
        </div>

        {/* Tab Toggle */}
        {view === "INPUT" && (
          <div className={`flex items-center gap-2 p-1 rounded-full border ${activeTab === "DRINK" ? "border-jazz-accent/30 bg-jazz-bg" : "border-ink/10 bg-white"}`}>
            <button
              onClick={() => setActiveTab("FOOD")}
              className={`p-2 rounded-full transition-all ${activeTab === "FOOD" ? "bg-accent text-white shadow-sm" : "text-ink/40 hover:text-ink"}`}
            >
              <span className="text-lg">🥘</span>
            </button>
            <button
              onClick={() => setActiveTab("DRINK")}
              className={`p-2 rounded-full transition-all ${activeTab === "DRINK" ? "bg-jazz-accent text-jazz-bg shadow-sm" : "text-ink/40 hover:text-ink"}`}
            >
              <span className="text-lg">🍸</span>
            </button>
          </div>
        )}

        {(view === "RESULTS" || view === "ERROR") && (
          <button
            onClick={reset}
            className={`flex items-center gap-2 font-mono text-xs uppercase hover:opacity-70 ${activeTab === "DRINK" ? "text-jazz-accent" : "text-ink"}`}
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
              {activeTab === "FOOD" ? (
                // FOOD INPUT
                <>
                  <label className="block font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-[0.9]">
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
                </>
              ) : (
                // DRINK INPUT
                <div className="space-y-12">
                  <div>
                    <label className="block font-serif text-5xl md:text-7xl lg:text-8xl mb-6 leading-[0.9] text-jazz-text">
                      What are we <span className="italic text-jazz-accent">drinking?</span>
                    </label>
                    <input
                      type="text"
                      value={drinkCraving}
                      onChange={(e) => setDrinkCraving(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. A twist on a martini, jazzy rum cocktail..."
                      className="w-full bg-transparent border-b-4 border-jazz-accent/30 py-4 text-2xl md:text-4xl font-sans focus:border-jazz-accent outline-none placeholder:text-jazz-text/20 text-jazz-text"
                      autoFocus
                    />
                  </div>

                  {/* Ingredients Selection */}
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-jazz-accent mb-4 opacity-80">Cabinet Essentials</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {allIngredients.map(ing => (
                        <button
                          key={ing}
                          onClick={() => toggleIngredient(ing)}
                          className={`px-4 py-2 rounded-full text-sm font-mono transition-all border ${selectedIngredients.includes(ing)
                              ? "bg-jazz-accent text-jazz-bg border-jazz-accent"
                              : "bg-transparent text-jazz-text/60 border-jazz-text/20 hover:border-jazz-accent/50"
                            }`}
                        >
                          {ing}
                        </button>
                      ))}
                    </div>

                    {/* Custom Ingredient Input */}
                    <div className="flex gap-2 max-w-xs">
                      <input
                        type="text"
                        value={customIngredient}
                        onChange={(e) => setCustomIngredient(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomIngredient()}
                        placeholder="Add other..."
                        className="bg-transparent border-b border-jazz-text/20 py-1 text-sm font-mono text-jazz-text focus:border-jazz-accent outline-none w-full"
                      />
                      <button onClick={addCustomIngredient} className="text-jazz-accent hover:text-white">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSearch}
                      className="bg-jazz-accent text-jazz-bg px-8 py-4 font-mono text-lg uppercase font-bold hover:bg-white transition-colors rounded-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
                    >
                      Mix It Up
                    </button>
                  </div>
                </div>
              )}
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
              <div className="flex justify-center h-[50vh]"><ChefLoader type={activeTab} /></div>
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
              <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${activeTab === "DRINK" ? "text-jazz-accent" : "text-accent"}`} />
              <h2 className="font-serif text-3xl mb-2">Kitchen Error</h2>
              <p className={`font-mono text-sm mb-8 ${activeTab === "DRINK" ? "text-jazz-text/60" : "text-ink/60"}`}>{errorMsg}</p>
              <button
                onClick={reset}
                className={`px-6 py-3 font-mono uppercase font-bold transition-colors ${activeTab === "DRINK"
                    ? "bg-jazz-accent text-jazz-bg hover:bg-white"
                    : "bg-ink text-paper hover:bg-accent"
                  }`}
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
              <h2 className="font-serif text-4xl mb-12">
                {activeTab === "DRINK" ? `Service for "${drinkCraving}"` : `Service for "${craving}"`}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {recipes.map((r, i) => (
                  <RecipeTicket
                    key={i}
                    recipe={r}
                    index={i}
                    type={activeTab}
                    onCopy={() => copyRecipe(r)}
                    isCopied={copiedId === r.id}
                  />
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}