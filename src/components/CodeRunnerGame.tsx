import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Heart, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeItem {
  id: string;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
}

interface CodeRunnerGameProps {
  language: string;
  onComplete: (score: number, collected: number, total: number) => void;
  onExit: () => void;
}

const codeItems: Record<string, { correct: string[]; wrong: string[] }> = {
  html: {
    correct: ['<div>', '</div>', '<p>', '</p>', '<h1>', '<img>', '<a href>', '<button>', '<form>', '<input>', '<head>', '<body>'],
    wrong: ['<dive>', '</dib>', '<paragraph>', '<h7>', '<image>', '<link href>', '<btn>', '<frm>', '<inpt>', '<hed>', '<bdy>', '<//p>'],
  },
  css: {
    correct: ['display: flex', 'margin: 10px', 'color: blue', 'padding: 5px', 'border-radius', 'font-size', 'background', 'position: relative'],
    wrong: ['display: flexx', 'margn: 10px', 'colour: blue', 'pading: 5px', 'border-radus', 'font-siz', 'backgrond', 'postion: relative'],
  },
  javascript: {
    correct: ['const x =', 'let y =', 'function()', 'return', 'console.log', 'if (true)', 'for (let i)', 'array.map()'],
    wrong: ['cosnt x =', 'lett y =', 'funtion()', 'retrun', 'consol.log', 'if true)', 'for let i)', 'array.mapp()'],
  },
  python: {
    correct: ['def func():', 'import os', 'print()', 'for i in', 'if x ==', 'return', 'class:', 'self.'],
    wrong: ['def func()', 'imprt os', 'prnt()', 'for i on', 'if x =', 'retrun', 'clas:', 'slef.'],
  },
  ds: {
    correct: ['array[i]', 'node.next', 'stack.push()', 'queue.pop()', 'tree.root', 'graph.edges', 'O(n)', 'O(log n)'],
    wrong: ['array(i)', 'node->next', 'stack.psuh()', 'queue.poop()', 'tree.roo', 'graph.egdes', 'O(m)', 'O(lon n)'],
  },
  dbms: {
    correct: ['SELECT *', 'FROM table', 'WHERE id =', 'JOIN ON', 'GROUP BY', 'ORDER BY', 'INSERT INTO', 'UPDATE SET'],
    wrong: ['SELEC *', 'FORM table', 'WERE id =', 'JION ON', 'GROUP BY,', 'ORDERY BY', 'INSRT INTO', 'UPDAT SET'],
  },
};

export function CodeRunnerGame({ language, onComplete, onExit }: CodeRunnerGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<CodeItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [collected, setCollected] = useState(0);
  const [missed, setMissed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalSpawned, setTotalSpawned] = useState(0);
  const [combo, setCombo] = useState(0);
  const [showEffect, setShowEffect] = useState<{ type: 'correct' | 'wrong'; x: number } | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const langItems = codeItems[language] || codeItems.javascript;
  const targetScore = 15;

  const spawnItem = useCallback(() => {
    const isCorrect = Math.random() > 0.4;
    const options = isCorrect ? langItems.correct : langItems.wrong;
    const text = options[Math.floor(Math.random() * options.length)];
    
    const newItem: CodeItem = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      isCorrect,
      x: Math.random() * 80 + 10,
      y: -10,
      speed: 1 + Math.random() * 0.5,
    };
    
    setItems(prev => [...prev, newItem]);
    setTotalSpawned(prev => prev + 1);
  }, [langItems]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isPlaying) return;
    
    if (e.key === 'ArrowLeft') {
      setPlayerX(prev => Math.max(5, prev - 8));
    } else if (e.key === 'ArrowRight') {
      setPlayerX(prev => Math.min(95, prev + 8));
    }
  }, [isPlaying]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPlaying || !gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percentage = (touchX / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, percentage)));
  }, [isPlaying]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPlaying || !gameRef.current) return;
    
    const rect = gameRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const percentage = (mouseX / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, percentage)));
  }, [isPlaying]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const spawnInterval = setInterval(() => {
      if (totalSpawned < 30) {
        spawnItem();
      }
    }, 1500);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, spawnItem, totalSpawned]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    const gameLoop = (timestamp: number) => {
      if (timestamp - lastTimeRef.current > 16) {
        lastTimeRef.current = timestamp;
        
        setItems(prevItems => {
          const newItems: CodeItem[] = [];
          
          prevItems.forEach(item => {
            const newY = item.y + item.speed;
            
            // Check collision with player
            if (newY >= 85 && newY <= 95 && Math.abs(item.x - playerX) < 12) {
              if (item.isCorrect) {
                setScore(prev => prev + (10 * (combo + 1)));
                setCollected(prev => prev + 1);
                setCombo(prev => prev + 1);
                setShowEffect({ type: 'correct', x: item.x });
              } else {
                setLives(prev => prev - 1);
                setCombo(0);
                setShowEffect({ type: 'wrong', x: item.x });
              }
              setTimeout(() => setShowEffect(null), 500);
              return;
            }
            
            // Remove items that go off screen
            if (newY > 100) {
              if (item.isCorrect) {
                setMissed(prev => prev + 1);
                setCombo(0);
              }
              return;
            }
            
            newItems.push({ ...item, y: newY });
          });
          
          return newItems;
        });
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameOver, playerX, combo]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setIsPlaying(false);
    }
    
    if (collected >= targetScore) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [lives, collected]);

  const startGame = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsPlaying(true);
      setCountdown(null);
    }
  }, [countdown]);

  const resetGame = () => {
    setPlayerX(50);
    setItems([]);
    setScore(0);
    setLives(3);
    setCollected(0);
    setMissed(0);
    setIsPlaying(false);
    setGameOver(false);
    setTotalSpawned(0);
    setCombo(0);
    setCountdown(null);
    lastTimeRef.current = 0;
  };

  const handleComplete = () => {
    onComplete(score, collected, collected + missed);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Code Runner</h2>
            <p className="text-sm text-muted-foreground">
              Collect correct syntax, dodge the bugs!
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit}>
          Exit
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="xp" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {score} pts
          </Badge>
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-5 w-5 transition-all",
                  i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Collected:</span>
          <span className="font-bold text-primary">{collected}/{targetScore}</span>
        </div>
      </div>

      {/* Combo Indicator */}
      {combo > 1 && isPlaying && (
        <div className="text-center animate-scale-in">
          <Badge variant="xp" className="text-lg px-4 py-1">
            🔥 {combo}x Combo!
          </Badge>
        </div>
      )}

      {/* Progress */}
      <Progress value={(collected / targetScore) * 100} className="h-2" />

      {/* Game Area */}
      <Card 
        ref={gameRef}
        className="relative h-[400px] overflow-hidden cursor-none select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Start Screen */}
        {!isPlaying && !gameOver && countdown === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-float">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold">Ready to Run?</h3>
              <p className="text-muted-foreground max-w-xs">
                Move with arrow keys or mouse. Collect <span className="text-green-500 font-bold">correct syntax</span>, 
                avoid <span className="text-red-500 font-bold">buggy code</span>!
              </p>
            </div>
            <Button variant="hero" size="lg" onClick={startGame} className="gap-2">
              <Play className="h-5 w-5" />
              Start Game
            </Button>
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-background/80 backdrop-blur-sm">
            <span className="font-display text-8xl font-black text-primary animate-scale-in">
              {countdown || 'GO!'}
            </span>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className={cn(
                "h-20 w-20 mx-auto rounded-2xl flex items-center justify-center animate-scale-in",
                collected >= targetScore 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              )}>
                {collected >= targetScore ? (
                  <Sparkles className="h-10 w-10 text-white" />
                ) : (
                  <Heart className="h-10 w-10 text-white" />
                )}
              </div>
              <h3 className="font-display text-2xl font-bold">
                {collected >= targetScore ? 'Level Complete!' : 'Game Over!'}
              </h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">{score} points</p>
                <p className="text-muted-foreground">
                  Collected: {collected} | Missed: {missed}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetGame} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Play Again
              </Button>
              <Button variant="hero" onClick={handleComplete}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Falling Items */}
        {items.map(item => (
          <div
            key={item.id}
            className={cn(
              "absolute px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors",
              "shadow-lg border-2",
              item.isCorrect 
                ? "bg-green-500/90 border-green-400 text-white" 
                : "bg-red-500/90 border-red-400 text-white"
            )}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {item.text}
          </div>
        ))}

        {/* Collection Effects */}
        {showEffect && (
          <div
            className={cn(
              "absolute text-4xl animate-scale-in pointer-events-none",
              showEffect.type === 'correct' ? "text-green-500" : "text-red-500"
            )}
            style={{
              left: `${showEffect.x}%`,
              top: '80%',
              transform: 'translateX(-50%)',
            }}
          >
            {showEffect.type === 'correct' ? '✓' : '✗'}
          </div>
        )}

        {/* Player */}
        {(isPlaying || countdown !== null) && (
          <div
            className="absolute bottom-4 w-20 h-10 transition-all duration-75"
            style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-r from-primary to-primary/80 border-2 border-primary-foreground/20 shadow-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">PLAYER</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/50 rounded-full blur-sm" />
          </div>
        )}

        {/* Controls Hint */}
        {isPlaying && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground/50">
            ← → or mouse to move
          </div>
        )}
      </Card>

      {/* Pause/Resume */}
      {isPlaying && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPlaying(false)}
            className="gap-2"
          >
            <Pause className="h-4 w-4" />
            Pause
          </Button>
        </div>
      )}

      {!isPlaying && !gameOver && countdown === null && items.length > 0 && (
        <div className="flex justify-center">
          <Button 
            variant="hero" 
            size="sm"
            onClick={() => setIsPlaying(true)}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Resume
          </Button>
        </div>
      )}
    </div>
  );
}
