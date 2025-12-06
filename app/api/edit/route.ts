import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // 1. SECURITY FIX: Read from Environment Variable
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return NextResponse.json(
            { error: "Server configuration error: Missing API Key." },
            { status: 500 }
        );
    }

    try {
        const { recipe, request } = await req.json();

        // 2. THE LADDER (Try preferred models in order)
        const modelsToTry = [
            "gemini-pro-latest",
            "gemini-2.5-flash",
            "gemini-flash-latest",
            "gemini-pro"
        ];

        console.log(`Processing edit request for Recipe #${recipe.id}: "${request}"`);

        const prompt = `
      You are a Michelin-star Executive Chef. 
      You have issued a ticket (recipe), but the customer has sent it back with a request.
      
      ORIGINAL RECIPE JSON:
      ${JSON.stringify(recipe)}

      CUSTOMER REQUEST:
      "${request}"

      RULES:
      1. Modify the recipe to accommodate the request.
      2. Keep the same JSON structure (id, title, tagline, prepTime, calories, tags, ingredients, steps).
      3. Update the 'id' by appending a version suffix (e.g. "-v2").
      4. Adjust title/tagline/ingredients/steps/stats logically. Make as little changes as possible to the original recipe. 
      5. Return ONLY a raw JSON object (not an array, just the single modified recipe object).
    `;

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
                const firstBrace = text.indexOf("{");
                const lastBrace = text.lastIndexOf("}");
                if (firstBrace !== -1 && lastBrace !== -1) {
                    text = text.substring(firstBrace, lastBrace + 1);
                }

                return NextResponse.json(JSON.parse(text));

            } catch (e) {
                // Continue loop
            }
        }

        throw new Error("All models busy.");

    } catch (error: any) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Failed to edit recipe." }, { status: 500 });
    }
}
