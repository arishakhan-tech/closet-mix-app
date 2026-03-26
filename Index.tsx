import { useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Shirt, Sparkles, Heart } from "lucide-react";
import UploadModal from "@/components/UploadModal";
import ClosetGrid from "@/components/ClosetGrid";
import OutfitGenerator from "@/components/OutfitGenerator";
import SavedOutfits from "@/components/SavedOutfits";
import { getItems, type ClothingItem } from "@/lib/closet-store";

const Index = () => {
  const [items, setItems] = useState<ClothingItem[]>(getItems);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setItems(getItems());
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">My Closet</h1>
            <p className="text-xs text-muted-foreground">
              {items.length} {items.length === 1 ? "piece" : "pieces"} in your wardrobe
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} size="icon" className="rounded-full shadow-md">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="closet" className="space-y-6">
          <TabsList className="w-full grid grid-cols-3 bg-muted/60 rounded-xl p-1">
            <TabsTrigger value="closet" className="gap-1.5 font-sans rounded-lg data-[state=active]:shadow-sm">
              <Shirt className="w-4 h-4" />
              Closet
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-1.5 font-sans rounded-lg data-[state=active]:shadow-sm">
              <Sparkles className="w-4 h-4" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-1.5 font-sans rounded-lg data-[state=active]:shadow-sm">
              <Heart className="w-4 h-4" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="closet">
            <ClosetGrid items={items} onRemove={refresh} />
          </TabsContent>

          <TabsContent value="generate">
            <OutfitGenerator items={items} />
          </TabsContent>

          <TabsContent value="saved">
            <SavedOutfits refreshKey={refreshKey} />
          </TabsContent>
        </Tabs>
      </main>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onAdded={refresh} />
    </div>
  );
};

export default Index;
