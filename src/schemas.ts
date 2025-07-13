import { z } from "zod";

const OrganicSchema = z
  .object({
    // --- Required properties ---
    position: z.number(),
    title: z.string(),
    link: z.url(),
    displayed_link: z.string(),
    snippet: z.string(),
    source: z.string(),

    // --- Optional properties ---
    redirect_link: z.url().optional(),
    favicon: z.url().optional(),
    thumbnail: z.url().optional(),
    date: z.string().optional(),
    duration: z.string().optional(),
    snippet_highlighted_words: z.array(z.string()).optional(),
    images: z.array(z.url()).optional(),

    // --- Nested objects ---
    sitelinks: z.record(z.string(), z.any()).optional(),
    rich_snippet: z.record(z.string(), z.any()).optional(),
    about_this_result: z.record(z.string(), z.any()).optional(),
  })
  // This allows the API to add new fields without breaking the app
  .loose();

// Describes the full API response, which contains a list of search results
export const SerpApiSchema = z
  .object({
    organic_results: z.array(OrganicSchema),
  })
  .loose();

// It automatically creates TypeScript types from our schemas
export type SerpApiResponse = z.infer<typeof SerpApiSchema>;
export type OrganicResult = z.infer<typeof OrganicSchema>;
