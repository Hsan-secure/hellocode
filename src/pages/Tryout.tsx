import { useState, useRef, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, RotateCcw, Code2, Terminal, Copy, Check } from 'lucide-react';

type SupportedLanguage = 'html' | 'css' | 'javascript' | 'python';

const LANGUAGE_CONFIG: Record<SupportedLanguage, { name: string; icon: string; defaultCode: string }> = {
  html: {
    name: 'HTML',
    icon: '🌐',
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>Start coding here...</p>
</body>
</html>`,
  },
  css: {
    name: 'HTML + CSS + JS',
    icon: '🎨',
    defaultCode: `<!DOCTYPE html>
<html>
<head>
<style>
  body {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #667eea, #764ba2);
  }
  .card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
  }
  h1 { color: #333; }
  p { color: #666; }
  button {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 8px;
    background: #667eea;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.2s;
  }
  button:hover { transform: scale(1.05); }
  #counter { font-size: 2rem; color: #333; margin: 1rem 0; }
</style>
</head>
<body>
  <div class="card">
    <h1>Interactive Card</h1>
    <p>Click the button to count!</p>
    <div id="counter">0</div>
    <button onclick="increment()">Click Me</button>
  </div>

  <script>
    let count = 0;
    function increment() {
      count++;
      document.getElementById('counter').textContent = count;
    }
  </script>
</body>
</html>`,
  },
  javascript: {
    name: 'JavaScript',
    icon: '⚡',
    defaultCode: `// JavaScript Tryout
// Your console.log output will appear below

console.log("Hello, World!");

// Try some examples:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled:", doubled);

// Functions
function greet(name) {
  return "Hello, " + name + "!";
}
console.log(greet("Coder"));

// Loops
for (let i = 1; i <= 5; i++) {
  console.log("Count:", i);
}`,
  },
  python: {
    name: 'Python',
    icon: '🐍',
    defaultCode: `# Python Tryout (simulated)
# Basic Python output will be shown below

print("Hello, World!")

# Variables
name = "Coder"
age = 20
print(f"Name: {name}, Age: {age}")

# Lists
numbers = [1, 2, 3, 4, 5]
squared = [n**2 for n in numbers]
print("Squared:", squared)

# Loops
for i in range(1, 6):
    print(f"Count: {i}")`,
  },
};

// Simple Python interpreter (handles print, basic expressions)
function runPython(code: string): string[] {
  const output: string[] = [];
  const lines = code.split('\n');
  const variables: Record<string, any> = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    // Handle print()
    const printMatch = line.match(/^print\((.+)\)$/);
    if (printMatch) {
      let content = printMatch[1];
      // Handle f-strings simply
      content = content.replace(/f"([^"]*)"/, (_, inner) => {
        return '"' + inner.replace(/\{([^}]+)\}/g, (__, varName) => {
          return variables[varName.trim()] ?? varName;
        }) + '"';
      });
      content = content.replace(/f'([^']*)'/, (_, inner) => {
        return '"' + inner.replace(/\{([^}]+)\}/g, (__, varName) => {
          return variables[varName.trim()] ?? varName;
        }) + '"';
      });
      try {
        // Evaluate simple expressions
        const evalContent = content.replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
          if (match in variables) return JSON.stringify(variables[match]);
          return match;
        });
        // eslint-disable-next-line no-eval
        const result = eval(evalContent);
        output.push(String(result));
      } catch {
        // Strip quotes for simple strings
        const stripped = content.replace(/^["']|["']$/g, '');
        output.push(stripped);
      }
      continue;
    }

    // Handle variable assignment
    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
      try {
        const expr = assignMatch[2].replace(/\b([a-zA-Z_]\w*)\b/g, (match) => {
          if (match in variables) return JSON.stringify(variables[match]);
          return match;
        });
        // eslint-disable-next-line no-eval
        variables[assignMatch[1]] = eval(expr);
      } catch {
        variables[assignMatch[1]] = assignMatch[2];
      }
      continue;
    }

    // Handle for loops simply
    const forMatch = line.match(/^for\s+(\w+)\s+in\s+range\((.+)\):$/);
    if (forMatch) {
      // Just note it - complex execution not supported
      continue;
    }
  }

  if (output.length === 0) {
    output.push('(No output - use print() to see results)');
  }

  return output;
}

const Tryout = () => {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [code, setCode] = useState(LANGUAGE_CONFIG.javascript.defaultCode);
  const [output, setOutput] = useState<string[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    setCode(LANGUAGE_CONFIG[lang].defaultCode);
    setOutput([]);
    setPreviewHtml('');
  };

  const runCode = useCallback(() => {
    setIsRunning(true);
    setOutput([]);

    setTimeout(() => {
      if (language === 'html' || language === 'css') {
        setPreviewHtml(code);
        setOutput(['✅ Rendered successfully! See the preview below.']);
      } else if (language === 'javascript') {
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };
        console.error = (...args) => {
          logs.push('❌ Error: ' + args.map(a => String(a)).join(' '));
        };
        console.warn = (...args) => {
          logs.push('⚠️ Warning: ' + args.map(a => String(a)).join(' '));
        };

        try {
          // eslint-disable-next-line no-eval
          eval(code);
        } catch (err: any) {
          logs.push(`❌ Error: ${err.message}`);
        }

        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        setOutput(logs.length > 0 ? logs : ['(No output - use console.log() to see results)']);
      } else if (language === 'python') {
        try {
          const result = runPython(code);
          setOutput(result);
        } catch (err: any) {
          setOutput([`❌ Error: ${err.message}`]);
        }
      }

      setIsRunning(false);
    }, 300);
  }, [code, language]);

  const resetCode = () => {
    setCode(LANGUAGE_CONFIG[language].defaultCode);
    setOutput([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <Badge variant="xp" className="mb-4">
            <Code2 className="h-4 w-4 mr-2" />
            Code Playground
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            <span className="text-gradient-primary">Tryout</span> Arena
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Write code, run it instantly, and see real-time output. Practice makes perfect!
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={language} onValueChange={(v) => handleLanguageChange(v as SupportedLanguage)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(LANGUAGE_CONFIG) as SupportedLanguage[]).map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {LANGUAGE_CONFIG[lang].icon} {LANGUAGE_CONFIG[lang].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={runCode} disabled={isRunning} variant="hero" className="gap-2">
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>

          <Button variant="outline" onClick={resetCode} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>

          <Button variant="ghost" onClick={copyCode} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>

          <span className="ml-auto text-xs text-muted-foreground hidden sm:block">
            Ctrl + Enter to run
          </span>
        </div>

        {/* Editor + Output */}
        <div className="grid lg:grid-cols-1 gap-4">
          {/* Code Editor */}
          <Card className="overflow-hidden border-2 border-border">
            <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-success/60" />
              </div>
              <span className="text-xs text-muted-foreground ml-2">
                {LANGUAGE_CONFIG[language].icon} {LANGUAGE_CONFIG[language].name} Editor
              </span>
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[350px] p-4 font-mono text-sm bg-background text-foreground resize-y focus:outline-none"
              spellCheck={false}
              placeholder="Start typing your code here..."
            />
          </Card>

          {/* HTML/CSS Preview */}
          {(language === 'html' || language === 'css') && previewHtml && (
            <Card className="overflow-hidden border-2 border-border">
              <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
                <span className="text-xs text-muted-foreground">🖥️ Live Preview</span>
              </div>
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[300px] bg-white"
                sandbox="allow-scripts"
                title="Code Preview"
              />
            </Card>
          )}

          {/* Console Output */}
          <Card className="overflow-hidden border-2 border-border">
            <div className="bg-muted/50 px-4 py-2 border-b border-border flex items-center gap-2">
              <Terminal className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Output Console</span>
            </div>
            <div className="min-h-[150px] max-h-[300px] overflow-y-auto p-4 font-mono text-sm bg-background">
              {output.length === 0 ? (
                <p className="text-muted-foreground italic">Click "Run Code" to see output here...</p>
              ) : (
                output.map((line, i) => (
                  <div key={i} className="py-0.5">
                    <span className="text-muted-foreground mr-2 select-none">{`>`}</span>
                    <span className={line.startsWith('❌') ? 'text-destructive' : line.startsWith('⚠️') ? 'text-yellow-500' : 'text-foreground'}>
                      {line}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Tryout;
