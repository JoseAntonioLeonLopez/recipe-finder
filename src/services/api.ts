import axios, { type AxiosInstance } from 'axios';

// Get API key from environment variables
const API_KEY: string = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

if (!API_KEY) {
  console.error("SPOONACULAR_API_KEY not set in .env file");
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    // Add the API key to every request automatically
    apiKey: API_KEY,
  },
});

// --- Type Definitions for Spoonacular Data ---
export interface RecipeSummary {
  id: number;
  title: string;
  image: string;
  imageType: string;
}

export interface SearchResult {
  offset: number;
  number: number;
  results: RecipeSummary[];
  totalResults: number;
}

export interface SearchParams {
  query: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  type?: string;
  maxReadyTime?: number;
  offset?: number;
  number?: number;
}

// --- Input Sanitization/Validation Utility ---
/**
 * Simple sanitization: trim whitespace and escape basic HTML tags (to mitigate XSS).
 * For production, use a library like DOMPurify if allowing richer content.
 */
function sanitizeInput(input: string | number | undefined): string | number | undefined {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, (match) => (match === '<' ? '&lt;' : '&gt;'));
  }
  return input;
}

// --- API Functions ---
export const RecipeService = {
  /**
   * Search for recipes using complex filters.
   */
  async searchRecipes(params: SearchParams): Promise<SearchResult> {
    
    // 1. Sanitize all string parameters
    const sanitizedParams: SearchParams = {
        query: sanitizeInput(params.query) as string,
        cuisine: sanitizeInput(params.cuisine) as string,
        diet: sanitizeInput(params.diet) as string,
        intolerances: sanitizeInput(params.intolerances) as string,
        type: sanitizeInput(params.type) as string,
        maxReadyTime: sanitizeInput(params.maxReadyTime) as number,
        offset: params.offset,
        number: params.number,
    };
    
    try {
      const response = await api.get<SearchResult>('complexSearch', {
        params: {
            ...sanitizedParams,
            number: sanitizedParams.number || 12, 
            _cacheBuster: Date.now(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw new Error('Failed to fetch recipes from Spoonacular API.');
    }
  },

  /**
   * Get detailed information for a specific recipe.
   */
  async getRecipeDetails(id: number): Promise<unknown> {
    try {
      const response = await api.get(`/${id}/information`, {
        params: {
          includeNutrition: true,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe ${id} details:`, error);
      throw new Error(`Failed to fetch recipe ${id} details.`);
    }
  },
};