import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Heart, Sparkles, Play, Pause, RotateCcw, Target, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';

interface CodeItem {
  id: string;
  text: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
}

interface Task {
  description: string;
  requiredSyntax: string[];
  hint: string;
}

interface CodeRunnerGameProps {
  language: string;
  onComplete: (score: number, collected: number, total: number) => void;
  onExit: () => void;
}

const tasksByLanguage: Record<string, Task[]> = {
  html: [
    { description: "Create a paragraph element", requiredSyntax: ['<p>', '</p>'], hint: "Use opening and closing paragraph tags" },
    { description: "Create a heading with a link", requiredSyntax: ['<h1>', '<a href>'], hint: "Combine heading and anchor tags" },
    { description: "Build a form with an input", requiredSyntax: ['<form>', '<input>'], hint: "Use form and input elements" },
    { description: "Create a page structure", requiredSyntax: ['<head>', '<body>'], hint: "HTML document needs head and body" },
    { description: "Add an image inside a div", requiredSyntax: ['<div>', '<img>'], hint: "Container with an image inside" },
  ],
  css: [
    { description: "Center an element with flexbox", requiredSyntax: ['display: flex', 'margin: 10px'], hint: "Use flexbox for centering" },
    { description: "Style text with color and size", requiredSyntax: ['color: blue', 'font-size'], hint: "Apply text styling properties" },
    { description: "Add spacing and rounded corners", requiredSyntax: ['padding: 5px', 'border-radius'], hint: "Use padding and border-radius" },
    { description: "Create a positioned element", requiredSyntax: ['position: relative', 'background'], hint: "Position with background" },
  ],
  javascript: [
    { description: "Declare variables", requiredSyntax: ['const x =', 'let y ='], hint: "Use const and let for variables" },
    { description: "Create a function that returns", requiredSyntax: ['function()', 'return'], hint: "Define function with return" },
    { description: "Log output and use conditional", requiredSyntax: ['console.log', 'if (true)'], hint: "Debug and conditional logic" },
    { description: "Loop through an array", requiredSyntax: ['for (let i)', 'array.map()'], hint: "Iteration methods" },
  ],
  python: [
    { description: "Define a function", requiredSyntax: ['def func():', 'return'], hint: "Function definition syntax" },
    { description: "Import and print", requiredSyntax: ['import os', 'print()'], hint: "Import module and output" },
    { description: "Create a class with self", requiredSyntax: ['class:', 'self.'], hint: "OOP in Python" },
    { description: "Loop with conditional", requiredSyntax: ['for i in', 'if x =='], hint: "Iteration and comparison" },
  ],
  ds: [
    { description: "Access array and linked list", requiredSyntax: ['array[i]', 'node.next'], hint: "Data structure navigation" },
    { description: "Stack and queue operations", requiredSyntax: ['stack.push()', 'queue.pop()'], hint: "LIFO and FIFO operations" },
    { description: "Tree and graph structures", requiredSyntax: ['tree.root', 'graph.edges'], hint: "Hierarchical and network data" },
    { description: "Understand time complexity", requiredSyntax: ['O(n)', 'O(log n)'], hint: "Big O notation" },
  ],
  dbms: [
    { description: "Select data from a table", requiredSyntax: ['SELECT *', 'FROM table'], hint: "Basic SELECT query" },
    { description: "Filter with conditions", requiredSyntax: ['WHERE id =', 'JOIN ON'], hint: "Filtering and joining" },
    { description: "Group and sort results", requiredSyntax: ['GROUP BY', 'ORDER BY'], hint: "Aggregation and sorting" },
    { description: "Modify database records", requiredSyntax: ['INSERT INTO', 'UPDATE SET'], hint: "Data manipulation" },
  ],
};

const wrongSyntax: Record<string, string[]> = {
  html: ['<dive>', '</dib>', '<paragraph>', '<h7>', '<image>', '<link href>', '<btn>', '<frm>', '<inpt>', '<hed>', '<bdy>', '<//p>'],
  css: ['display: flexx', 'margn: 10px', 'colour: blue', 'pading: 5px', 'border-radus', 'font-siz', 'backgrond', 'postion: relative'],
  javascript: ['cosnt x =', 'lett y =', 'funtion()', 'retrun', 'consol.log', 'if true)', 'for let i)', 'array.mapp()'],
  python: ['def func()', 'imprt os', 'prnt()', 'for i on', 'if x =', 'retrun', 'clas:', 'slef.'],
  ds: ['array(i)', 'node->next', 'stack.psuh()', 'queue.poop()', 'tree.roo', 'graph.egdes', 'O(m)', 'O(lon n)'],
  dbms: ['SELEC *', 'FORM table', 'WERE id =', 'JION ON', 'GROUP BY,', 'ORDERY BY', 'INSRT INTO', 'UPDAT SET'],
};

export function CodeRunnerGame({ language, onComplete, onExit }: CodeRunnerGameProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const { playCorrect, playWrong, playStreak, playLevelComplete, playClick } = useSoundEffects();
  
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<CodeItem[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [combo, setCombo] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Task system
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [collectedSyntax, setCollectedSyntax] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const totalTasks = 3;
  
  // Visual effects
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; x: number; y: number; type: 'correct' | 'wrong' | 'combo' }[]>([]);
  const [screenShake, setScreenShake] = useState(false);
  const [screenFlash, setScreenFlash] = useState<'correct' | 'wrong' | null>(null);
  const [particles, setParticles] = useState<{ id: string; x: number; y: number; color: string }[]>([]);

  const langTasks = tasksByLanguage[language] || tasksByLanguage.javascript;
  const langWrong = wrongSyntax[language] || wrongSyntax.javascript;
  const currentTask = langTasks[currentTaskIndex % langTasks.length];

  const addFloatingText = useCallback((text: string, x: number, y: number, type: 'correct' | 'wrong' | 'combo') => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts(prev => [...prev, { id, text, x, y, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  }, []);

  const addParticles = useCallback((x: number, y: number, color: string) => {
    const newParticles = Array.from({ length: 8 }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x,
      y,
      color,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 600);
  }, []);

  const spawnItem = useCallback(() => {
    // Spawn required syntax more often, wrong syntax, and some distractors
    const random = Math.random();
    let text: string;
    let isCorrect: boolean;

    if (random < 0.4) {
      // Spawn required syntax
      const remaining = currentTask.requiredSyntax.filter(s => !collectedSyntax.includes(s));
      if (remaining.length > 0) {
        text = remaining[Math.floor(Math.random() * remaining.length)];
        isCorrect = true;
      } else {
        // All collected, spawn any correct
        text = currentTask.requiredSyntax[Math.floor(Math.random() * currentTask.requiredSyntax.length)];
        isCorrect = true;
      }
    } else if (random < 0.7) {
      // Spawn wrong syntax
      text = langWrong[Math.floor(Math.random() * langWrong.length)];
      isCorrect = false;
    } else {
      // Spawn other correct syntax as distractors (not needed for task)
      const allCorrect = langTasks.flatMap(t => t.requiredSyntax);
      const distractors = allCorrect.filter(s => !currentTask.requiredSyntax.includes(s));
      if (distractors.length > 0) {
        text = distractors[Math.floor(Math.random() * distractors.length)];
        isCorrect = false; // Not correct for current task
      } else {
        text = langWrong[Math.floor(Math.random() * langWrong.length)];
        isCorrect = false;
      }
    }
    
    const newItem: CodeItem = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      isCorrect: currentTask.requiredSyntax.includes(text) && !collectedSyntax.includes(text),
      x: Math.random() * 80 + 10,
      y: -10,
      speed: 0.8 + Math.random() * 0.4,
    };
    
    setItems(prev => [...prev, newItem]);
  }, [langWrong, langTasks, currentTask, collectedSyntax]);

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
      spawnItem();
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, gameOver, spawnItem]);

  // Check task completion
  useEffect(() => {
    if (currentTask.requiredSyntax.every(s => collectedSyntax.includes(s))) {
      // Task completed!
      setCompletedTasks(prev => prev + 1);
      setCollectedSyntax([]);
      setCurrentTaskIndex(prev => prev + 1);
      setItems([]);
      
      if (soundEnabled) playLevelComplete();
      addFloatingText('TASK COMPLETE! 🎉', 50, 50, 'combo');
      setScreenFlash('correct');
      setTimeout(() => setScreenFlash(null), 300);
      
      // Check if all tasks done
      if (completedTasks + 1 >= totalTasks) {
        setGameOver(true);
        setIsPlaying(false);
      }
    }
  }, [collectedSyntax, currentTask, completedTasks, soundEnabled, playLevelComplete, addFloatingText]);

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
                const points = 10 * (combo + 1);
                setScore(prev => prev + points);
                setCollectedSyntax(prev => [...prev, item.text]);
                setCombo(prev => prev + 1);
                
                if (soundEnabled) {
                  if (combo >= 2) playStreak();
                  else playCorrect();
                }
                
                addFloatingText(`+${points}`, item.x, 80, 'correct');
                addParticles(item.x, 85, '#22c55e');
                setScreenFlash('correct');
                setTimeout(() => setScreenFlash(null), 150);
                
                if (combo >= 2) {
                  addFloatingText(`${combo + 1}x COMBO!`, item.x, 70, 'combo');
                }
              } else {
                setLives(prev => prev - 1);
                setCombo(0);
                
                if (soundEnabled) playWrong();
                
                addFloatingText('-1 ❤️', item.x, 80, 'wrong');
                setScreenShake(true);
                setScreenFlash('wrong');
                setTimeout(() => {
                  setScreenShake(false);
                  setScreenFlash(null);
                }, 300);
              }
              return;
            }
            
            // Remove items that go off screen
            if (newY > 100) {
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
  }, [isPlaying, gameOver, playerX, combo, soundEnabled, playCorrect, playWrong, playStreak, addFloatingText, addParticles]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
      setIsPlaying(false);
      if (soundEnabled) playWrong();
    }
  }, [lives, soundEnabled, playWrong]);

  const startGame = () => {
    if (soundEnabled) playClick();
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
    if (soundEnabled) playClick();
    setPlayerX(50);
    setItems([]);
    setScore(0);
    setLives(3);
    setIsPlaying(false);
    setGameOver(false);
    setCombo(0);
    setCountdown(null);
    setCurrentTaskIndex(0);
    setCollectedSyntax([]);
    setCompletedTasks(0);
    setFloatingTexts([]);
    setParticles([]);
    lastTimeRef.current = 0;
  };

  const handleComplete = () => {
    if (soundEnabled) playClick();
    onComplete(score, completedTasks, totalTasks);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Code Runner</h2>
            <p className="text-sm text-muted-foreground">
              Complete tasks by collecting correct syntax!
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSound}>
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Task Card */}
      {(isPlaying || countdown !== null) && (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-foreground">Task {completedTasks + 1}/{totalTasks}</h3>
                <Badge variant="outline" className="text-xs">{currentTask.hint}</Badge>
              </div>
              <p className="text-sm text-foreground font-medium mb-3">{currentTask.description}</p>
              <div className="flex flex-wrap gap-2">
                {currentTask.requiredSyntax.map((syntax, i) => (
                  <Badge 
                    key={i}
                    variant={collectedSyntax.includes(syntax) ? "xp" : "secondary"}
                    className={cn(
                      "font-mono text-xs transition-all duration-300",
                      collectedSyntax.includes(syntax) && "animate-scale-in"
                    )}
                  >
                    {collectedSyntax.includes(syntax) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {syntax}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

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
                  i < lives ? "text-red-500 fill-red-500" : "text-muted-foreground/30",
                  i === lives - 1 && lives < 3 && "animate-pulse"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tasks:</span>
          <span className="font-bold text-primary">{completedTasks}/{totalTasks}</span>
        </div>
      </div>

      {/* Combo Indicator */}
      {combo > 1 && isPlaying && (
        <div className="text-center animate-scale-in">
          <Badge variant="xp" className="text-lg px-4 py-1 animate-pulse">
            🔥 {combo}x Combo!
          </Badge>
        </div>
      )}

      {/* Progress */}
      <Progress value={(completedTasks / totalTasks) * 100} className="h-2" />

      {/* Game Area */}
      <Card 
        ref={gameRef}
        className={cn(
          "relative h-[400px] overflow-hidden cursor-none select-none transition-all",
          screenShake && "animate-[shake_0.3s_ease-in-out]",
          screenFlash === 'correct' && "ring-4 ring-green-500/50",
          screenFlash === 'wrong' && "ring-4 ring-red-500/50"
        )}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        style={{
          animation: screenShake ? 'shake 0.3s ease-in-out' : undefined,
        }}
      >
        {/* Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Screen Flash Overlay */}
        {screenFlash && (
          <div className={cn(
            "absolute inset-0 pointer-events-none z-10 transition-opacity duration-150",
            screenFlash === 'correct' ? "bg-green-500/20" : "bg-red-500/20"
          )} />
        )}

        {/* Start Screen */}
        {!isPlaying && !gameOver && countdown === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-20 bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center animate-float">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="font-display text-2xl font-bold">Ready to Code?</h3>
              <p className="text-muted-foreground max-w-xs">
                Complete <span className="text-primary font-bold">{totalTasks} coding tasks</span> by collecting 
                the <span className="text-green-500 font-bold">correct syntax</span>. 
                Avoid <span className="text-red-500 font-bold">buggy code</span>!
              </p>
              <div className="bg-muted/50 rounded-lg p-3 max-w-xs mx-auto">
                <p className="text-xs text-muted-foreground">
                  <strong>First Task:</strong> {langTasks[0].description}
                </p>
              </div>
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
                completedTasks >= totalTasks 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500" 
                  : "bg-gradient-to-br from-red-500 to-orange-500"
              )}>
                {completedTasks >= totalTasks ? (
                  <Sparkles className="h-10 w-10 text-white" />
                ) : (
                  <Heart className="h-10 w-10 text-white" />
                )}
              </div>
              <h3 className="font-display text-2xl font-bold">
                {completedTasks >= totalTasks ? 'All Tasks Complete! 🎉' : 'Game Over!'}
              </h3>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-primary">{score} points</p>
                <p className="text-muted-foreground">
                  Tasks Completed: {completedTasks}/{totalTasks}
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

        {/* Floating Text Effects */}
        {floatingTexts.map(ft => (
          <div
            key={ft.id}
            className={cn(
              "absolute pointer-events-none font-bold text-lg z-30",
              "animate-[floatUp_1s_ease-out_forwards]",
              ft.type === 'correct' && "text-green-500",
              ft.type === 'wrong' && "text-red-500",
              ft.type === 'combo' && "text-yellow-500 text-xl"
            )}
            style={{
              left: `${ft.x}%`,
              top: `${ft.y}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {ft.text}
          </div>
        ))}

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute pointer-events-none z-30"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-[particleBurst_0.6s_ease-out_forwards]"
                style={{
                  backgroundColor: p.color,
                  transform: `rotate(${i * 45}deg) translateY(-20px)`,
                  animationDelay: `${i * 20}ms`,
                }}
              />
            ))}
          </div>
        ))}

        {/* Falling Items */}
        {items.map(item => (
          <div
            key={item.id}
            className={cn(
              "absolute px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors",
              "shadow-lg border-2 animate-[wobble_0.5s_ease-in-out_infinite]",
              item.isCorrect 
                ? "bg-green-500/90 border-green-400 text-white shadow-green-500/30" 
                : "bg-red-500/90 border-red-400 text-white shadow-red-500/30"
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

        {/* Player */}
        {(isPlaying || countdown !== null) && (
          <div
            className="absolute bottom-4 w-24 h-12 transition-all duration-75"
            style={{ left: `${playerX}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-full h-full rounded-lg bg-gradient-to-r from-primary to-primary/80 border-2 border-primary-foreground/20 shadow-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
              <span className="text-primary-foreground font-bold text-xs relative z-10">COLLECT</span>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-primary/30 rounded-full blur-md" />
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

      {/* Custom Keyframes Style */}
      <style>{`
        @keyframes floatUp {
          0% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-50px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes wobble {
          0%, 100% { transform: translateX(-50%) rotate(-2deg); }
          50% { transform: translateX(-50%) rotate(2deg); }
        }
        @keyframes particleBurst {
          0% { opacity: 1; transform: rotate(var(--angle)) translateY(0) scale(1); }
          100% { opacity: 0; transform: rotate(var(--angle)) translateY(-30px) scale(0); }
        }
      `}</style>
    </div>
  );
}
