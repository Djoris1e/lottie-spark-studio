import { GiphyGif } from '@/types/editor';

// Giphy public API key for development/demo use
const GIPHY_API_KEY = 'GlVGYHkr3WSBnllca54iNt0yFbjz7L65';

const BASE_URL = 'https://api.giphy.com/v1/gifs';

export async function searchGiphy(query: string, limit = 20, offset = 0): Promise<GiphyGif[]> {
  if (!query.trim()) return [];
  
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    q: query,
    limit: String(limit),
    offset: String(offset),
    rating: 'g',
    lang: 'en',
  });

  const response = await fetch(`${BASE_URL}/search?${params}`);
  if (!response.ok) throw new Error('Giphy search failed');
  
  const data = await response.json();
  return data.data as GiphyGif[];
}

export async function getTrendingGiphy(limit = 20): Promise<GiphyGif[]> {
  const params = new URLSearchParams({
    api_key: GIPHY_API_KEY,
    limit: String(limit),
    rating: 'g',
  });

  const response = await fetch(`${BASE_URL}/trending?${params}`);
  if (!response.ok) throw new Error('Giphy trending failed');
  
  const data = await response.json();
  return data.data as GiphyGif[];
}
