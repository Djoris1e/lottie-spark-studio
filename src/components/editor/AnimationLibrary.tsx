import { useState, useRef } from 'react';
import { Search, Upload, Folder, Image, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { builtinAnimations } from '@/data/builtinAnimations';
import { LottieAnimationData, ANIMATION_CATEGORIES, AnimationCategory } from '@/types/editor';
import { useEditor } from '@/context/EditorContext';
import { AnimationCard } from './AnimationCard';
import { GiphySearch } from './GiphySearch';
import { LottieFilesSearch } from './LottieFilesSearch';

export function AnimationLibrary() {
  const { addLottieLayer } = useEditor();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AnimationCategory | 'all'>('all');
  const [uploadedAnimations, setUploadedAnimations] = useState<LottieAnimationData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredBuiltin = builtinAnimations.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const allAnimations = [...filteredBuiltin, ...uploadedAnimations.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )];

  const handleAddAnimation = async (anim: LottieAnimationData & { animationData?: object; rawData?: object }) => {
    try {
      let data = anim.animationData || anim.rawData;
      if (!data && anim.url) {
        const resp = await fetch(anim.url);
        data = await resp.json();
      }
      if (!data) {
        console.error('No animation data available');
        return;
      }
      addLottieLayer(anim.name, data, anim.url || '');
    } catch (e) {
      console.error('Failed to load animation:', e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          const anim: LottieAnimationData & { rawData: any } = {
            id: 'upload-' + crypto.randomUUID(),
            name: file.name.replace('.json', ''),
            url: URL.createObjectURL(file),
            category: 'stickers',
            source: 'upload',
            rawData: data,
          };
          setUploadedAnimations(prev => [...prev, anim]);
        } catch {
          console.error('Invalid Lottie JSON file');
        }
      };
      reader.readAsText(file);
    });
    e.target.value = '';
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <Tabs defaultValue="lottie" className="flex-1 flex flex-col">
        <div className="px-3 pt-2">
          <TabsList className="w-full h-8 bg-secondary">
            <TabsTrigger value="lottie" className="text-xs flex-1">Lottie</TabsTrigger>
            <TabsTrigger value="giphy" className="text-xs flex-1 gap-1">
              <Image className="h-3 w-3" />
              GIFs
            </TabsTrigger>
            <TabsTrigger value="uploads" className="text-xs flex-1">Uploads</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lottie" className="flex-1 mt-0 flex flex-col">
          <div className="p-3 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search animations..."
                className="pl-9 h-9 text-sm bg-secondary border-border"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1 px-3 py-1">
            <Button
              size="sm"
              variant={selectedCategory === 'all' ? 'default' : 'secondary'}
              className="text-[10px] h-6 px-2"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {ANIMATION_CATEGORIES.map(cat => (
              <Button
                key={cat.value}
                size="sm"
                variant={selectedCategory === cat.value ? 'default' : 'secondary'}
                className="text-[10px] h-6 px-2"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-2 gap-2 p-3">
              {allAnimations.map(anim => (
                <AnimationCard key={anim.id} animation={anim} onAdd={handleAddAnimation} />
              ))}
              {allAnimations.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
                  No animations found
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="giphy" className="flex-1 mt-0">
          <GiphySearch />
        </TabsContent>

        <TabsContent value="uploads" className="flex-1 mt-0">
          <div className="p-3">
            <Button
              variant="outline"
              className="w-full mb-3 border-dashed border-border"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Lottie JSON
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-2 gap-2">
                {uploadedAnimations.map(anim => (
                  <AnimationCard key={anim.id} animation={anim} onAdd={handleAddAnimation} />
                ))}
                {uploadedAnimations.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-muted-foreground text-sm">
                    <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No uploads yet
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
