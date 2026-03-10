import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, TrendingUp, Loader2, Plus, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEditor } from '@/context/EditorContext';
import { searchLottieFiles, getFeaturedLottieFiles, LottieFilesResult } from '@/lib/lottiefilesApi';

export function LottieFilesSearch() {
  const { addLottieLayer } = useEditor();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LottieFilesResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFeatured, setShowFeatured] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    getFeaturedLottieFiles(20).then(setResults).catch(console.error);
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setShowFeatured(true);
      getFeaturedLottieFiles(20).then(setResults).catch(console.error);
      return;
    }
    setShowFeatured(false);
    setLoading(true);
    try {
      const r = await searchLottieFiles(q, 20);
      setResults(r);
    } catch (e) {
      console.error('LottieFiles search error:', e);
    }
    setLoading(false);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 400);
  };

  const handleAdd = async (item: LottieFilesResult) => {
    try {
      const resp = await fetch(item.lottieUrl);
      const data = await resp.json();
      addLottieLayer(item.name, data, item.lottieUrl);
    } catch (e) {
      console.error('Failed to fetch animation:', e);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search LottieFiles..."
            className="pl-9 h-9 text-sm bg-secondary border-border"
            value={query}
            onChange={e => handleChange(e.target.value)}
          />
        </div>
      </div>

      <div className="px-3 py-1.5">
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          {showFeatured && <TrendingUp className="h-3 w-3" />}
          <span>{showFeatured ? 'Featured' : `Results for "${query}"`}</span>
          {loading && <Loader2 className="h-3 w-3 animate-spin ml-auto" />}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-1.5 p-3 pt-0">
          {results.map(item => (
            <div
              key={item.id}
              className="group relative rounded-lg border border-border overflow-hidden cursor-pointer hover:border-primary/50 transition-all bg-secondary/50"
              onClick={() => handleAdd(item)}
            >
              <div className="aspect-square relative">
                {item.gifUrl ? (
                  <img
                    src={item.gifUrl}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-[10px] px-2 text-center">
                    {item.name}
                  </div>
                )}
              </div>
              <div className="p-1.5 border-t border-border">
                <p className="text-xs text-foreground truncate">{item.name}</p>
                {item.createdBy?.name && (
                  <p className="text-[10px] text-muted-foreground truncate">by {item.createdBy.name}</p>
                )}
              </div>
              <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Plus className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && !loading && (
            <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
              No animations found
            </div>
          )}
        </div>
        <div className="px-3 pb-2 text-center">
          <a
            href="https://lottiefiles.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-2.5 w-2.5" />
            Powered by LottieFiles
          </a>
        </div>
      </ScrollArea>
    </div>
  );
}
