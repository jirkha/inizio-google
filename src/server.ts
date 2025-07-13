import "dotenv/config";
import express, { Request, Response, Application } from "express";
import cors from "cors";
import { z } from "zod";
import { SerpApiSchema } from "./schemas";

const app: Application = express();

app.use(cors());
app.use(express.static("public"));

app.get("/api/inizio-google", async (req: Request, res: Response) => {
  const { query } = req.query;

  if (typeof query !== "string" || query.trim() === "") {
    return res
      .status(400)
      .json({ error: "Query parameter must be a non-empty string." });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    console.error("SERPAPI_KEY is not configured in the environment.");
    return res.status(500).json({
      error: "Chyba na straně serveru: API klíč není správně nastaven.",
    });
  }

  // 'encodeURIComponent' makes the string safe to be used inside a URL
  const apiUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&hl=cs&gl=cz&api_key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // Set res.status from the response.status
      return res.status(response.status).json({
        error: `Služba pro vyhledávání je dočasně nedostupná (chyba ${response.status}). Zkuste to prosím později.`,
      });
    }

    const data = await response.json();
    const validatedData = SerpApiSchema.parse(data);
    res.json(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 'error.issues' is a Zod property
      console.error("SerpApi response validation failed:", error.issues);
      return res.status(502).json({
        error:
          "Data z externí služby mají neočekávaný formát. Zkuste to prosím později.",
      });
    }

    console.error("An unexpected error occurred:", error);
    return res.status(500).json({
      error: "Na serveru došlo k neočekávané chybě. Zkuste to prosím později.",
    });
  }
});

// The '10' is a safety measure that tells it to use the decimal system (0-9)
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// set `process.env.NODE_ENV` to "test" when Jest is running
if (process.env.NODE_ENV !== "test") { 
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// `server.test.ts` imports 'app' object and test it without the server running
export default app;

