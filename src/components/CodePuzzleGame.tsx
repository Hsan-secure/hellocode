import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Puzzle, Check, X, Lightbulb, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PuzzleQuestion {
  id: string;
  type: 'drag-drop' | 'fill-blank';
  question: string;
  codeTemplate: string;
  blanks: string[];
  options: string[];
  correctOrder: number[];
  explanation: string;
  hint: string;
  language: string;
}

interface CodePuzzleGameProps {
  language: string;
  onComplete: (score: number, correct: number, total: number) => void;
  onExit: () => void;
}

const puzzleQuestions: Record<string, PuzzleQuestion[]> = {
  html: [
    {
      id: 'html-puzzle-1',
      type: 'drag-drop',
      question: 'Arrange the HTML tags to create a proper document structure:',
      codeTemplate: '___\n  ___\n    ___\n  ___\n  ___\n    ___\n  ___\n___',
      blanks: ['<!DOCTYPE html>', '<html>', '<head>', '<title>My Page</title>', '</head>', '<body>', '</body>', '</html>'],
      options: ['</html>', '<head>', '</body>', '<html>', '<!DOCTYPE html>', '<body>', '</head>', '<title>My Page</title>'],
      correctOrder: [4, 3, 1, 7, 6, 5, 2, 0],
      explanation: 'HTML documents start with DOCTYPE, followed by html, head (with title), and body tags.',
      hint: 'Start with DOCTYPE, then the html opening tag.',
      language: 'html'
    },
    {
      id: 'html-puzzle-2',
      type: 'fill-blank',
      question: 'Complete the code to create a link that opens in a new tab:',
      codeTemplate: '<a ___="https://example.com" ___="_blank">Visit</a>',
      blanks: ['href', 'target'],
      options: ['href', 'src', 'target', 'rel', 'link'],
      correctOrder: [0, 2],
      explanation: 'The href attribute specifies the URL, and target="_blank" opens in a new tab.',
      hint: 'href is for the URL, target controls where it opens.',
      language: 'html'
    },
    {
      id: 'html-puzzle-3',
      type: 'drag-drop',
      question: 'Build an HTML form with proper structure:',
      codeTemplate: '___\n  ___\n  ___\n  ___\n___',
      blanks: ['<form action="/submit" method="post">', '<label for="name">Name:</label>', '<input type="text" id="name" name="name">', '<button type="submit">Submit</button>', '</form>'],
      options: ['<button type="submit">Submit</button>', '</form>', '<label for="name">Name:</label>', '<form action="/submit" method="post">', '<input type="text" id="name" name="name">'],
      correctOrder: [3, 2, 4, 0, 1],
      explanation: 'Forms have opening tag, labels, inputs, buttons, and closing tag.',
      hint: 'Start with the form tag, add label, input, button, then close.',
      language: 'html'
    },
  ],
  css: [
    {
      id: 'css-puzzle-1',
      type: 'fill-blank',
      question: 'Complete the flexbox centering code:',
      codeTemplate: '.container {\n  display: ___;\n  justify-content: ___;\n  align-items: ___;\n}',
      blanks: ['flex', 'center', 'center'],
      options: ['flex', 'grid', 'center', 'start', 'end', 'block'],
      correctOrder: [0, 2, 2],
      explanation: 'Use display: flex with justify-content and align-items set to center.',
      hint: 'Flexbox uses display: flex and center values for centering.',
      language: 'css'
    },
    {
      id: 'css-puzzle-2',
      type: 'drag-drop',
      question: 'Order the CSS box model from inside to outside:',
      codeTemplate: '1. ___\n2. ___\n3. ___\n4. ___',
      blanks: ['content', 'padding', 'border', 'margin'],
      options: ['margin', 'border', 'content', 'padding'],
      correctOrder: [2, 3, 1, 0],
      explanation: 'The box model goes: content → padding → border → margin.',
      hint: 'Content is at the center, margin is the outermost.',
      language: 'css'
    },
  ],
  javascript: [
    {
      id: 'js-puzzle-1',
      type: 'fill-blank',
      question: 'Complete the arrow function:',
      codeTemplate: 'const add = (a, b) ___ a ___ b;',
      blanks: ['=>', '+'],
      options: ['=>', '->', '+', '-', '==', '==='],
      correctOrder: [0, 2],
      explanation: 'Arrow functions use => and this adds two numbers with +.',
      hint: 'Arrow functions use the fat arrow => syntax.',
      language: 'javascript'
    },
    {
      id: 'js-puzzle-2',
      type: 'drag-drop',
      question: 'Arrange to create a proper async/await function:',
      codeTemplate: '___\n  ___\n  ___\n  ___\n___',
      blanks: ['async function fetchData() {', 'try {', 'const response = await fetch(url);', 'return response.json();', '} catch (error) { console.log(error); } }'],
      options: ['return response.json();', 'async function fetchData() {', 'try {', '} catch (error) { console.log(error); } }', 'const response = await fetch(url);'],
      correctOrder: [1, 2, 4, 0, 3],
      explanation: 'Async functions use async keyword, try/catch, and await for promises.',
      hint: 'Start with async function, then try block, await, return, and catch.',
      language: 'javascript'
    },
  ],
  python: [
    {
      id: 'py-puzzle-1',
      type: 'fill-blank',
      question: 'Complete the Python function definition:',
      codeTemplate: '___ greet(name):\n    ___ f"Hello, {name}!"',
      blanks: ['def', 'return'],
      options: ['def', 'function', 'return', 'print', 'yield'],
      correctOrder: [0, 2],
      explanation: 'Python uses def for function definition and return to return values.',
      hint: 'Python functions start with def and use return.',
      language: 'python'
    },
    {
      id: 'py-puzzle-2',
      type: 'drag-drop',
      question: 'Build a Python class with constructor:',
      codeTemplate: '___\n  ___\n    ___',
      blanks: ['class Person:', 'def __init__(self, name):', 'self.name = name'],
      options: ['self.name = name', 'class Person:', 'def __init__(self, name):'],
      correctOrder: [1, 2, 0],
      explanation: 'Python classes use class keyword, __init__ for constructor, and self for instance attributes.',
      hint: 'Start with class, then __init__ method, then assignment.',
      language: 'python'
    },
  ],
  ds: [
    {
      id: 'ds-puzzle-1',
      type: 'drag-drop',
      question: 'Order the steps to reverse a linked list:',
      codeTemplate: '1. ___\n2. ___\n3. ___\n4. ___',
      blanks: ['Initialize prev = null, current = head', 'Store next = current.next', 'Reverse link: current.next = prev', 'Move pointers: prev = current, current = next'],
      options: ['Move pointers: prev = current, current = next', 'Initialize prev = null, current = head', 'Reverse link: current.next = prev', 'Store next = current.next'],
      correctOrder: [1, 3, 2, 0],
      explanation: 'Reversing a linked list requires storing next, reversing the link, then moving pointers.',
      hint: 'First initialize, then store next, reverse, and move.',
      language: 'ds'
    },
  ],
  dbms: [
    {
      id: 'dbms-puzzle-1',
      type: 'fill-blank',
      question: 'Complete the SQL JOIN query:',
      codeTemplate: 'SELECT users.name, orders.total\n___ users\n___ orders ___ users.id = orders.user_id;',
      blanks: ['FROM', 'JOIN', 'ON'],
      options: ['FROM', 'WHERE', 'JOIN', 'ON', 'AND', 'SELECT'],
      correctOrder: [0, 2, 3],
      explanation: 'SQL JOINs use FROM for the first table, JOIN for the second, and ON for the condition.',
      hint: 'FROM specifies the table, JOIN adds another, ON defines the relationship.',
      language: 'dbms'
    },
  ],
};

export function CodePuzzleGame({ language, onComplete, onExit }: CodePuzzleGameProps) {
  const questions = puzzleQuestions[language] || puzzleQuestions.html;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];
  const blanksCount = currentQuestion.blanks.length;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  useEffect(() => {
    setAvailableOptions([...currentQuestion.options]);
    setSelectedAnswers([]);
    setIsCorrect(null);
    setShowHint(false);
    setShowExplanation(false);
  }, [currentIndex, currentQuestion.options]);

  const handleDragStart = (option: string) => {
    setDraggedItem(option);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDropOnBlank = (index: number) => {
    if (!draggedItem || selectedAnswers.length > index) return;
    
    const newSelected = [...selectedAnswers];
    newSelected[index] = draggedItem;
    setSelectedAnswers(newSelected);
    setAvailableOptions(availableOptions.filter(o => o !== draggedItem));
    setDraggedItem(null);
  };

  const handleOptionClick = (option: string) => {
    if (selectedAnswers.length >= blanksCount) return;
    
    const newSelected = [...selectedAnswers, option];
    setSelectedAnswers(newSelected);
    setAvailableOptions(availableOptions.filter(o => o !== option));
  };

  const handleRemoveAnswer = (index: number) => {
    const removedAnswer = selectedAnswers[index];
    const newSelected = selectedAnswers.filter((_, i) => i !== index);
    setSelectedAnswers(newSelected);
    setAvailableOptions([...availableOptions, removedAnswer]);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setAvailableOptions([...currentQuestion.options]);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  const handleSubmit = () => {
    const correct = currentQuestion.correctOrder.every(
      (correctIdx, i) => currentQuestion.options[correctIdx] === selectedAnswers[i]
    );
    
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      setCorrectCount(prev => prev + 1);
      setScore(prev => prev + (showHint ? 50 : 100));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(score, correctCount, questions.length);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setHintsUsed(prev => prev + 1);
  };

  const renderCodeTemplate = () => {
    const parts = currentQuestion.codeTemplate.split('___');
    return (
      <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 space-y-2">
        {parts.map((part, index) => (
          <div key={index} className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground whitespace-pre">{part}</span>
            {index < parts.length - 1 && (
              <div
                className={cn(
                  "min-w-[120px] min-h-[36px] border-2 border-dashed rounded-md px-3 py-1 flex items-center justify-center transition-all",
                  selectedAnswers[index] 
                    ? "border-primary bg-primary/10 cursor-pointer hover:bg-primary/20" 
                    : "border-muted-foreground/30 bg-background",
                  draggedItem && !selectedAnswers[index] && "border-primary animate-pulse"
                )}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDropOnBlank(index)}
                onClick={() => selectedAnswers[index] && handleRemoveAnswer(index)}
              >
                {selectedAnswers[index] ? (
                  <span className="text-primary font-medium text-xs">{selectedAnswers[index]}</span>
                ) : (
                  <span className="text-muted-foreground/50 text-xs">Drop here</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Puzzle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Code Puzzle</h2>
            <p className="text-sm text-muted-foreground">
              Question {currentIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="xp" className="gap-1">
            <Sparkles className="h-3 w-3" />
            {score} pts
          </Badge>
          <Button variant="ghost" size="sm" onClick={onExit}>
            Exit
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question Card */}
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <Badge variant="outline" className="capitalize">
            {currentQuestion.type === 'drag-drop' ? 'Drag & Drop' : 'Fill in the Blanks'}
          </Badge>
          <h3 className="text-lg font-semibold text-foreground">{currentQuestion.question}</h3>
        </div>

        {/* Code Template */}
        {renderCodeTemplate()}

        {/* Available Options */}
        {!showExplanation && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {currentQuestion.type === 'drag-drop' ? 'Drag the pieces or click to add:' : 'Click to fill in the blanks:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option, index) => (
                <div
                  key={`${option}-${index}`}
                  draggable
                  onDragStart={() => handleDragStart(option)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleOptionClick(option)}
                  className={cn(
                    "px-3 py-2 rounded-lg border-2 cursor-grab active:cursor-grabbing transition-all",
                    "bg-card hover:bg-accent hover:border-primary text-sm font-mono",
                    "hover:scale-105 active:scale-95",
                    draggedItem === option && "opacity-50 scale-95"
                  )}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hint */}
        {showHint && !showExplanation && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">{currentQuestion.hint}</p>
          </div>
        )}

        {/* Result & Explanation */}
        {showExplanation && (
          <div className={cn(
            "p-4 rounded-lg border-2 space-y-3",
            isCorrect 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-red-500/10 border-red-500/30"
          )}>
            <div className="flex items-center gap-2">
              {isCorrect ? (
                <>
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center animate-scale-in">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">Correct!</span>
                </>
              ) : (
                <>
                  <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center animate-scale-in">
                    <X className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-red-600 dark:text-red-400">Not quite right</span>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
            {!isCorrect && (
              <div className="text-sm">
                <span className="font-medium">Correct order: </span>
                <span className="font-mono text-primary">
                  {currentQuestion.correctOrder.map(i => currentQuestion.options[i]).join(' → ')}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex gap-2">
            {!showExplanation && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                  disabled={selectedAnswers.length === 0}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleHint}
                  disabled={showHint}
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Hint
                </Button>
              </>
            )}
          </div>
          
          {showExplanation ? (
            <Button onClick={handleNext} className="gap-2">
              {currentIndex < questions.length - 1 ? 'Next Puzzle' : 'See Results'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswers.length < blanksCount}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Check Answer
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
