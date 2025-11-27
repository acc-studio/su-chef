import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // 1. SECURITY FIX: Read from Environment Variable
  // Do NOT put the actual string here anymore.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error: Missing API Key." },
      { status: 500 }
    );
  }

  try {
    const { craving, type, ingredients, mood } = await req.json();

    // 2. THE LADDER (Try preferred models in order)
    const modelsToTry = [
      "gemini-pro-latest",       // Based on your successful diagnostic
      "gemini-2.5-flash",
      "gemini-flash-latest",
      "gemini-pro"
    ];

    console.log(`Processing request for: "${craving}" (Type: ${type})`);

    let prompt = "";
    if (type === "DRINK") {
      const ingredientList = ingredients?.length ? `Use these ingredients if possible: ${ingredients.join(", ")}.` : "";
      const moodContext = mood ? `The user is feeling: "${mood}".` : "";

      prompt = `
        You are a World-Class Mixologist. User Request: "${craving}".
        ${moodContext}
        ${ingredientList}
        Rules: 
        1. Create a cocktail recipe.
        2. Use metric measurements (ml, cl, dashes).
        3. Be creative but accessible.
        4. Return ONLY a raw JSON array.
        5. Return 2 distinct options.
        JSON Schema:
        [{
          "id": "201", "title": "Cocktail Name", "tagline": "A short, jazzy description", "prepTime": 5, "calories": 150,
          "tags": ["Gin", "Fruity"], "ingredients": [{"item": "Gin", "amount": "50ml"}],
          "steps": [{"action": "Shake", "description": "Shake vigorously with ice."}]
        }]
      `;
    } else {
      // Default to FOOD
      prompt = `
        You are a Michelin-star chef API. User Request: "${craving}".
        Rules: 1. Ready in < 60 mins. 2. Use ingredients available in Turkey not necessarily only in a usual Turkish supermarket but also in gourmet supermarkets or asian stores. 3. Use metric, using spoons for measurements when it makes more sense. 3. Return recipes only looking at the craving, do not add a Turkish twist without being asked e.g. "smash burger" by default is an American smash burger. 4. Return ONLY a raw JSON array. 5. Return 2 recipes.
        JSON Schema:
        [{
          "id": "101", "title": "T", "tagline": "T", "prepTime": 10, "calories": 500,
          "tags": ["T"], "ingredients": [{"item": "I", "amount": "1"}],
          "steps": [{"action": "V", "description": "D"}]
        }]
      `;
    }

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });

        if (!response.ok) continue; // Try next model

        const data = await response.json();
        let text = data.candidates[0].content.parts[0].text;

        // Clean Markdown
        const firstBracket = text.indexOf("[");
        const lastBracket = text.lastIndexOf("]");
        if (firstBracket !== -1 && lastBracket !== -1) {
          text = text.substring(firstBracket, lastBracket + 1);
        }

        return NextResponse.json(JSON.parse(text));

      } catch (e) {
        // Continue loop
      }
    }

    throw new Error("All models busy.");

  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to generate." }, { status: 500 });
  }
}