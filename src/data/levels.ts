import { Level, Question } from '@/types/game';

export const levels: Level[] = [
  // HTML Levels (0-3)
  { id: 0, language: 'html', title: 'HTML Basics', description: 'Learn the fundamental building blocks of web pages', difficulty: 'beginner', xpReward: 100, isUnlocked: true, isCompleted: false },
  { id: 1, language: 'html', title: 'HTML Tags', description: 'Master common HTML tags and their usage', difficulty: 'beginner', xpReward: 150, isUnlocked: false, isCompleted: false },
  { id: 2, language: 'html', title: 'HTML Forms', description: 'Create interactive forms and inputs', difficulty: 'intermediate', xpReward: 200, isUnlocked: false, isCompleted: false },
  { id: 3, language: 'html', title: 'Semantic HTML', description: 'Write meaningful and accessible HTML', difficulty: 'intermediate', xpReward: 250, isUnlocked: false, isCompleted: false },
  
  // CSS Levels (4-7)
  { id: 4, language: 'css', title: 'CSS Fundamentals', description: 'Style your first web elements', difficulty: 'beginner', xpReward: 150, isUnlocked: false, isCompleted: false },
  { id: 5, language: 'css', title: 'Box Model', description: 'Understand margins, padding, and borders', difficulty: 'beginner', xpReward: 200, isUnlocked: false, isCompleted: false },
  { id: 6, language: 'css', title: 'Flexbox Layout', description: 'Master flexible box layouts', difficulty: 'intermediate', xpReward: 250, isUnlocked: false, isCompleted: false },
  { id: 7, language: 'css', title: 'CSS Grid', description: 'Create complex grid-based layouts', difficulty: 'advanced', xpReward: 300, isUnlocked: false, isCompleted: false },
  
  // JavaScript Levels (8-10)
  { id: 8, language: 'javascript', title: 'JS Variables', description: 'Declare and use variables in JavaScript', difficulty: 'beginner', xpReward: 200, isUnlocked: false, isCompleted: false },
  { id: 9, language: 'javascript', title: 'Functions', description: 'Create reusable code with functions', difficulty: 'intermediate', xpReward: 250, isUnlocked: false, isCompleted: false },
  { id: 10, language: 'javascript', title: 'DOM Manipulation', description: 'Interact with web page elements', difficulty: 'advanced', xpReward: 350, isUnlocked: false, isCompleted: false },
  
  // Data Structures (11-15)
  { id: 11, language: 'ds', title: 'Arrays', description: 'Work with ordered collections', difficulty: 'beginner', xpReward: 250, isUnlocked: false, isCompleted: false },
  { id: 12, language: 'ds', title: 'Linked Lists', description: 'Understand linked data structures', difficulty: 'intermediate', xpReward: 300, isUnlocked: false, isCompleted: false },
  { id: 13, language: 'ds', title: 'Stacks & Queues', description: 'LIFO and FIFO structures', difficulty: 'intermediate', xpReward: 300, isUnlocked: false, isCompleted: false },
  { id: 14, language: 'ds', title: 'Trees', description: 'Hierarchical data structures', difficulty: 'advanced', xpReward: 400, isUnlocked: false, isCompleted: false },
  { id: 15, language: 'ds', title: 'Graphs', description: 'Network-like data structures', difficulty: 'expert', xpReward: 500, isUnlocked: false, isCompleted: false },
  
  // DBMS (16-18)
  { id: 16, language: 'dbms', title: 'SQL Basics', description: 'Query databases with SQL', difficulty: 'beginner', xpReward: 300, isUnlocked: false, isCompleted: false },
  { id: 17, language: 'dbms', title: 'Database Design', description: 'Design efficient database schemas', difficulty: 'intermediate', xpReward: 350, isUnlocked: false, isCompleted: false },
  { id: 18, language: 'dbms', title: 'Advanced SQL', description: 'Master joins and subqueries', difficulty: 'advanced', xpReward: 450, isUnlocked: false, isCompleted: false },
  
  // Python (19-25)
  { id: 19, language: 'python', title: 'Python Basics', description: 'Start your Python journey', difficulty: 'beginner', xpReward: 250, isUnlocked: false, isCompleted: false },
  { id: 20, language: 'python', title: 'Control Flow', description: 'If statements and loops', difficulty: 'beginner', xpReward: 300, isUnlocked: false, isCompleted: false },
  { id: 21, language: 'python', title: 'Python Functions', description: 'Define and call functions', difficulty: 'intermediate', xpReward: 350, isUnlocked: false, isCompleted: false },
  { id: 22, language: 'python', title: 'OOP in Python', description: 'Object-oriented programming', difficulty: 'intermediate', xpReward: 400, isUnlocked: false, isCompleted: false },
  { id: 23, language: 'python', title: 'File Handling', description: 'Read and write files', difficulty: 'intermediate', xpReward: 400, isUnlocked: false, isCompleted: false },
  { id: 24, language: 'python', title: 'Error Handling', description: 'Handle exceptions gracefully', difficulty: 'advanced', xpReward: 450, isUnlocked: false, isCompleted: false },
  { id: 25, language: 'python', title: 'Python Mastery', description: 'Final challenge', difficulty: 'expert', xpReward: 600, isUnlocked: false, isCompleted: false },
];

export const sampleQuestions: Record<number, Question[]> = {
  0: [
    {
      id: 'html-1',
      type: 'mcq',
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyper Transfer Machine Language',
        'Home Tool Markup Language'
      ],
      correctAnswer: 0,
      explanation: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating web pages.',
      hint: 'Think about what HTML is used for - marking up text for the web!',
      difficulty: 1,
      topic: 'HTML Basics'
    },
    {
      id: 'html-2',
      type: 'mcq',
      question: 'Which tag is used to create a paragraph in HTML?',
      options: ['<paragraph>', '<p>', '<para>', '<text>'],
      correctAnswer: 1,
      explanation: 'The <p> tag defines a paragraph in HTML. It automatically adds some margin before and after the paragraph.',
      hint: 'It\'s a single letter tag!',
      difficulty: 1,
      topic: 'HTML Tags'
    },
    {
      id: 'html-3',
      type: 'code-output',
      question: 'What will be displayed when this HTML is rendered?',
      code: '<h1>Hello World</h1>',
      options: [
        'Hello World as a large heading',
        'Hello World as small text',
        'h1 Hello World',
        'Nothing, the code is invalid'
      ],
      correctAnswer: 0,
      explanation: 'The <h1> tag creates the largest heading in HTML. It displays the text inside it as a prominent heading.',
      hint: 'h1 is the most important heading tag.',
      difficulty: 1,
      topic: 'HTML Headings'
    },
    {
      id: 'html-4',
      type: 'mcq',
      question: 'Which HTML element is used to define important text?',
      options: ['<important>', '<b>', '<strong>', '<i>'],
      correctAnswer: 2,
      explanation: 'The <strong> tag defines important text and typically displays it in bold. It also conveys semantic importance to screen readers.',
      hint: 'This tag tells browsers and screen readers that the text has importance.',
      difficulty: 2,
      topic: 'Semantic HTML'
    },
    {
      id: 'html-5',
      type: 'fill-blank',
      question: 'Complete the HTML to create a link to example.com:',
      code: '<a ___="https://example.com">Click here</a>',
      options: ['src', 'href', 'link', 'url'],
      correctAnswer: 1,
      explanation: 'The href attribute specifies the URL of the page the link goes to. It stands for "hypertext reference".',
      hint: 'This attribute is short for "hypertext reference".',
      difficulty: 2,
      topic: 'HTML Links'
    }
  ],
  8: [
    {
      id: 'js-1',
      type: 'mcq',
      question: 'Which keyword is used to declare a variable that cannot be reassigned?',
      options: ['var', 'let', 'const', 'static'],
      correctAnswer: 2,
      explanation: 'The const keyword declares a constant variable that cannot be reassigned after initialization.',
      hint: 'This keyword is short for "constant".',
      difficulty: 1,
      topic: 'Variables'
    },
    {
      id: 'js-2',
      type: 'code-output',
      question: 'What is the output of this code?',
      code: 'let x = 5;\nlet y = "5";\nconsole.log(x == y);',
      options: ['true', 'false', 'undefined', 'Error'],
      correctAnswer: 0,
      explanation: 'The == operator performs type coercion, so the number 5 is equal to the string "5" when compared.',
      hint: 'Consider what == does vs ===',
      difficulty: 2,
      topic: 'Type Coercion'
    },
    {
      id: 'js-3',
      type: 'code-output',
      question: 'What is the output?',
      code: 'console.log(typeof null);',
      options: ['"null"', '"undefined"', '"object"', '"boolean"'],
      correctAnswer: 2,
      explanation: 'This is a known quirk in JavaScript. typeof null returns "object", which is considered a bug that has never been fixed for compatibility reasons.',
      hint: 'This is a famous JavaScript quirk!',
      difficulty: 3,
      topic: 'Data Types'
    },
    {
      id: 'js-4',
      type: 'mcq',
      question: 'Which method adds an element to the end of an array?',
      options: ['push()', 'pop()', 'shift()', 'unshift()'],
      correctAnswer: 0,
      explanation: 'The push() method adds one or more elements to the end of an array and returns the new length of the array.',
      hint: 'Think about pushing something onto a stack.',
      difficulty: 1,
      topic: 'Arrays'
    },
    {
      id: 'js-5',
      type: 'bug-fix',
      question: 'This code should log numbers 1 to 5. What\'s wrong?',
      code: 'for (let i = 0; i <= 5; i++) {\n  console.log(i);\n}',
      options: [
        'Nothing is wrong',
        'i should start at 1, not 0',
        'It logs 0 to 5, but should log 1 to 5',
        'The loop never runs'
      ],
      correctAnswer: 2,
      explanation: 'The loop starts at 0, so it logs 0, 1, 2, 3, 4, 5 instead of 1 to 5. Change i = 0 to i = 1.',
      hint: 'Look at the starting value of i.',
      difficulty: 2,
      topic: 'Loops'
    }
  ]
};

export const badges = [
  { id: 'first-blood', name: 'First Blood', description: 'Complete your first level', icon: '🎯' },
  { id: 'html-master', name: 'HTML Master', description: 'Complete all HTML levels', icon: '📄' },
  { id: 'css-wizard', name: 'CSS Wizard', description: 'Complete all CSS levels', icon: '🎨' },
  { id: 'js-ninja', name: 'JS Ninja', description: 'Complete all JavaScript levels', icon: '⚡' },
  { id: 'perfect-score', name: 'Perfect Score', description: 'Get 100% on any level', icon: '💯' },
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥' },
  { id: 'speed-demon', name: 'Speed Demon', description: 'Complete a level in under 2 minutes', icon: '⏱️' },
  { id: 'no-hints', name: 'Self Reliant', description: 'Complete a level without hints', icon: '🧠' },
];
