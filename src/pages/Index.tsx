import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Video, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(262 83% 58% / 0.4), transparent 70%)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, hsl(173 80% 40% / 0.4), transparent 70%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center z-10 max-w-2xl px-6"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-xs text-muted-foreground"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Powered by Lottie animations
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
          <span className="text-primary">Lottie</span> Video{' '}
          <span className="text-accent">Maker</span>
        </h1>

        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Create stunning social media videos by combining Lottie animations with customizable text. Export in 9:16 portrait format.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <Link to="/editor">
            <Button size="lg" className="glow-primary text-sm">
              <Play className="h-4 w-4 mr-2" />
              Open Editor
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 text-center">
          {[
            { icon: Layers, label: 'Drag & Drop Layers', desc: 'Combine multiple animations' },
            { icon: Video, label: '9:16 Portrait', desc: 'Reels, TikTok, Shorts ready' },
            { icon: Sparkles, label: 'Export as Video', desc: 'Download MP4 instantly' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="p-4 rounded-xl bg-card/50 border border-border"
            >
              <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
