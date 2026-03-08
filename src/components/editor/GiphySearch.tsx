import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, TrendingUp, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor } from '@/context/EditorContext';
import { searchGiphy, getTrendingGiphy } from '@/lib/giphyApi';
import { GiphyGif } from '@/types/editor';

export function GiphySearch() {
  const { addGifLayer } = useEditor();
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<GiphyGif[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTrending, setShowTrending] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load trending on mount
  useEffect(() => {
    getTrendingGiphy(20)
      .then(setGifs)
      .catch(console.error);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setShowTrending(true);
      getTrendingGiphy(20).then(setGifs).catch(console.error);
      return;
    }
    setShowTrending(false);
    setLoading(true);
    try {
      const results = await searchGiphy(q, 20);
      setGifs(results);
    } catch (e) {
      console.error('Giphy search error:', e);
    }
    setLoading(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 400);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search GIFs..."
            className="pl-9 h-9 text-sm bg-secondary border-border"
            value={query}
            onChange={e => handleChange(e.target.value)}
          />
        </div>
      </div>

      <div className="px-3 py-1.5">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {showTrending && <TrendingUp className="h-3 w-3" />}
          <span>{showTrending ? 'Trending' : `Results for "${query}"`}</span>
          {loading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-1.5 p-3 pt-0">
          {gifs.map(gif => (
            <div
              key={gif.id}
              className="group relative rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
              onClick={() => addGifLayer(gif.title || 'GIF', gif.images.original.url)}
            >
              <div className="aspect-square relative bg-secondary/50">
                <img
                  src={gif.images.fixed_height.url}
                  alt={gif.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
          {gifs.length === 0 && !loading && (
            <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
              No GIFs found
            </div>
          )}
        </div>
        <div className="px-3 pb-2">
          <img
            src="https://developers.giphy.com/branch/master/static/attribution-e1a7e6e3cec7b0c2e28e79b45fd1e485.gif"
            alt="Powered by GIPHY"
            className="h-4 opacity-50 mx-auto"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
