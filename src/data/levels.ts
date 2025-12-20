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
  // HTML Level 0 - HTML Basics
  0: [
    { id: 'html-0-1', type: 'mcq', question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Machine Language', 'Home Tool Markup Language'], correctAnswer: 0, explanation: 'HTML stands for Hyper Text Markup Language.', hint: 'Think about what HTML is used for!', difficulty: 1, topic: 'HTML Basics' },
    { id: 'html-0-2', type: 'mcq', question: 'Which tag is used to create a paragraph?', options: ['<paragraph>', '<p>', '<para>', '<text>'], correctAnswer: 1, explanation: 'The <p> tag defines a paragraph in HTML.', hint: 'It is a single letter tag!', difficulty: 1, topic: 'HTML Tags' },
    { id: 'html-0-3', type: 'code-output', question: 'What will be displayed?', code: '<h1>Hello World</h1>', options: ['Hello World as a large heading', 'Hello World as small text', 'h1 Hello World', 'Nothing'], correctAnswer: 0, explanation: 'The <h1> tag creates the largest heading.', hint: 'h1 is the most important heading.', difficulty: 1, topic: 'HTML Headings' },
    { id: 'html-0-4', type: 'mcq', question: 'Which element defines important text?', options: ['<important>', '<b>', '<strong>', '<i>'], correctAnswer: 2, explanation: 'The <strong> tag defines important text.', hint: 'It conveys semantic importance.', difficulty: 2, topic: 'Semantic HTML' },
    { id: 'html-0-5', type: 'fill-blank', question: 'Complete to create a link:', code: '<a ___="https://example.com">Click</a>', options: ['src', 'href', 'link', 'url'], correctAnswer: 1, explanation: 'The href attribute specifies the URL.', hint: 'Stands for hypertext reference.', difficulty: 2, topic: 'HTML Links' },
  ],

  // HTML Level 1 - HTML Tags
  1: [
    { id: 'html-1-1', type: 'mcq', question: 'Which tag creates a line break?', options: ['<break>', '<lb>', '<br>', '<newline>'], correctAnswer: 2, explanation: 'The <br> tag creates a line break.', hint: 'It is a self-closing tag.', difficulty: 1, topic: 'HTML Tags' },
    { id: 'html-1-2', type: 'mcq', question: 'Which tag displays an image?', options: ['<image>', '<img>', '<pic>', '<photo>'], correctAnswer: 1, explanation: 'The <img> tag embeds an image.', hint: 'Short for image!', difficulty: 1, topic: 'HTML Images' },
    { id: 'html-1-3', type: 'mcq', question: 'Which tag creates an unordered list?', options: ['<list>', '<ol>', '<ul>', '<li>'], correctAnswer: 2, explanation: 'The <ul> tag creates an unordered (bullet) list.', hint: 'UL stands for unordered list.', difficulty: 1, topic: 'HTML Lists' },
    { id: 'html-1-4', type: 'code-output', question: 'What does this create?', code: '<a href="#">Link</a>', options: ['A clickable link', 'An anchor point', 'A button', 'A heading'], correctAnswer: 0, explanation: 'The <a> tag creates a hyperlink.', hint: 'The anchor tag is for links.', difficulty: 2, topic: 'HTML Links' },
    { id: 'html-1-5', type: 'mcq', question: 'Which attribute adds alt text to images?', options: ['title', 'alt', 'text', 'description'], correctAnswer: 1, explanation: 'The alt attribute provides alternative text.', hint: 'Short for alternative.', difficulty: 2, topic: 'HTML Accessibility' },
  ],

  // HTML Level 2 - HTML Forms
  2: [
    { id: 'html-2-1', type: 'mcq', question: 'Which tag creates a text input?', options: ['<textfield>', '<input>', '<text>', '<field>'], correctAnswer: 1, explanation: 'The <input> tag with type="text" creates a text field.', hint: 'It is a versatile form element.', difficulty: 1, topic: 'HTML Forms' },
    { id: 'html-2-2', type: 'mcq', question: 'Which input type creates a checkbox?', options: ['type="check"', 'type="box"', 'type="checkbox"', 'type="tick"'], correctAnswer: 2, explanation: 'type="checkbox" creates a checkbox input.', hint: 'The name is quite literal!', difficulty: 1, topic: 'HTML Inputs' },
    { id: 'html-2-3', type: 'mcq', question: 'Which tag creates a dropdown?', options: ['<dropdown>', '<select>', '<option>', '<list>'], correctAnswer: 1, explanation: 'The <select> tag creates a dropdown list.', hint: 'You select from options.', difficulty: 2, topic: 'HTML Forms' },
    { id: 'html-2-4', type: 'mcq', question: 'Which attribute makes a field required?', options: ['mandatory', 'required', 'must', 'needed'], correctAnswer: 1, explanation: 'The required attribute makes a field mandatory.', hint: 'It is a boolean attribute.', difficulty: 2, topic: 'Form Validation' },
    { id: 'html-2-5', type: 'code-output', question: 'What does this create?', code: '<textarea rows="4"></textarea>', options: ['Multi-line text input', 'Single line input', 'A label', 'A button'], correctAnswer: 0, explanation: 'The <textarea> creates a multi-line text input.', hint: 'It is for longer text content.', difficulty: 2, topic: 'HTML Forms' },
  ],

  // HTML Level 3 - Semantic HTML
  3: [
    { id: 'html-3-1', type: 'mcq', question: 'Which tag represents navigation?', options: ['<navigation>', '<nav>', '<menu>', '<links>'], correctAnswer: 1, explanation: 'The <nav> tag represents navigation links.', hint: 'Short for navigation.', difficulty: 1, topic: 'Semantic HTML' },
    { id: 'html-3-2', type: 'mcq', question: 'Which tag represents the main content?', options: ['<content>', '<body>', '<main>', '<article>'], correctAnswer: 2, explanation: 'The <main> tag represents the main content.', hint: 'It should be unique per page.', difficulty: 1, topic: 'Semantic HTML' },
    { id: 'html-3-3', type: 'mcq', question: 'Which tag represents a self-contained article?', options: ['<section>', '<article>', '<div>', '<post>'], correctAnswer: 1, explanation: 'The <article> tag represents independent content.', hint: 'Think of a blog post.', difficulty: 2, topic: 'Semantic HTML' },
    { id: 'html-3-4', type: 'mcq', question: 'Which tag represents page footer?', options: ['<bottom>', '<footer>', '<end>', '<base>'], correctAnswer: 1, explanation: 'The <footer> tag defines a footer.', hint: 'It is at the foot of the page.', difficulty: 1, topic: 'Semantic HTML' },
    { id: 'html-3-5', type: 'mcq', question: 'Which tag groups related content?', options: ['<group>', '<section>', '<div>', '<container>'], correctAnswer: 1, explanation: 'The <section> tag groups thematically related content.', hint: 'It defines a section.', difficulty: 2, topic: 'Semantic HTML' },
  ],

  // CSS Level 4 - CSS Fundamentals
  4: [
    { id: 'css-4-1', type: 'mcq', question: 'Which property changes text color?', options: ['text-color', 'font-color', 'color', 'foreground'], correctAnswer: 2, explanation: 'The color property sets text color.', hint: 'It is the simplest name.', difficulty: 1, topic: 'CSS Basics' },
    { id: 'css-4-2', type: 'mcq', question: 'Which property changes background color?', options: ['bg-color', 'background-color', 'back-color', 'bgcolor'], correctAnswer: 1, explanation: 'background-color sets the background.', hint: 'Two words combined.', difficulty: 1, topic: 'CSS Basics' },
    { id: 'css-4-3', type: 'mcq', question: 'How do you select an element by ID?', options: ['.myId', '#myId', '@myId', '*myId'], correctAnswer: 1, explanation: 'The # symbol selects by ID.', hint: 'Hash for ID.', difficulty: 1, topic: 'CSS Selectors' },
    { id: 'css-4-4', type: 'mcq', question: 'How do you select by class?', options: ['#myClass', '.myClass', '@myClass', '*myClass'], correctAnswer: 1, explanation: 'The dot (.) selects by class.', hint: 'Period for class.', difficulty: 1, topic: 'CSS Selectors' },
    { id: 'css-4-5', type: 'code-output', question: 'What does this do?', code: 'p { font-size: 16px; }', options: ['Sets paragraph font size to 16px', 'Creates a paragraph', 'Adds 16px padding', 'Nothing'], correctAnswer: 0, explanation: 'This sets the font size of all paragraphs.', hint: 'font-size controls text size.', difficulty: 2, topic: 'CSS Properties' },
  ],

  // CSS Level 5 - Box Model
  5: [
    { id: 'css-5-1', type: 'mcq', question: 'Which property adds space inside an element?', options: ['margin', 'padding', 'border', 'spacing'], correctAnswer: 1, explanation: 'Padding adds space inside the element.', hint: 'It is like cushioning inside.', difficulty: 1, topic: 'Box Model' },
    { id: 'css-5-2', type: 'mcq', question: 'Which property adds space outside an element?', options: ['margin', 'padding', 'border', 'gap'], correctAnswer: 0, explanation: 'Margin adds space outside the element.', hint: 'It creates distance from neighbors.', difficulty: 1, topic: 'Box Model' },
    { id: 'css-5-3', type: 'mcq', question: 'What is the correct order of the box model?', options: ['margin, border, padding, content', 'padding, margin, border, content', 'content, border, padding, margin', 'content, padding, border, margin'], correctAnswer: 3, explanation: 'From inside out: content, padding, border, margin.', hint: 'Start from the content.', difficulty: 2, topic: 'Box Model' },
    { id: 'css-5-4', type: 'code-output', question: 'What does margin: 10px 20px mean?', code: 'margin: 10px 20px;', options: ['10px top/bottom, 20px left/right', '10px all sides, then 20px', '10px left, 20px right', '20px top, 10px bottom'], correctAnswer: 0, explanation: 'Two values: vertical and horizontal.', hint: 'First value is top/bottom.', difficulty: 2, topic: 'Box Model' },
    { id: 'css-5-5', type: 'mcq', question: 'What does box-sizing: border-box do?', options: ['Includes padding/border in width', 'Removes all borders', 'Centers the box', 'Adds shadow'], correctAnswer: 0, explanation: 'border-box includes padding and border in width.', hint: 'It changes size calculation.', difficulty: 2, topic: 'Box Model' },
  ],

  // CSS Level 6 - Flexbox
  6: [
    { id: 'css-6-1', type: 'mcq', question: 'How do you enable flexbox?', options: ['display: flex', 'flex: true', 'flexbox: on', 'layout: flex'], correctAnswer: 0, explanation: 'display: flex enables flexbox.', hint: 'It is a display property value.', difficulty: 1, topic: 'Flexbox' },
    { id: 'css-6-2', type: 'mcq', question: 'Which property aligns items horizontally?', options: ['align-items', 'justify-content', 'flex-direction', 'text-align'], correctAnswer: 1, explanation: 'justify-content aligns along the main axis.', hint: 'Think of justifying text.', difficulty: 2, topic: 'Flexbox' },
    { id: 'css-6-3', type: 'mcq', question: 'Which property aligns items vertically?', options: ['align-items', 'justify-content', 'vertical-align', 'flex-align'], correctAnswer: 0, explanation: 'align-items aligns along the cross axis.', hint: 'It aligns the items.', difficulty: 2, topic: 'Flexbox' },
    { id: 'css-6-4', type: 'mcq', question: 'How do you center items in flexbox?', options: ['center: true', 'justify-content: center; align-items: center', 'align: center', 'flex-center: on'], correctAnswer: 1, explanation: 'Use both justify-content and align-items.', hint: 'You need both properties.', difficulty: 2, topic: 'Flexbox' },
    { id: 'css-6-5', type: 'mcq', question: 'What does flex-wrap: wrap do?', options: ['Wraps items to next line', 'Wraps text', 'Creates borders', 'Enables scrolling'], correctAnswer: 0, explanation: 'flex-wrap: wrap allows items to wrap.', hint: 'Items wrap when they run out of space.', difficulty: 2, topic: 'Flexbox' },
  ],

  // CSS Level 7 - CSS Grid
  7: [
    { id: 'css-7-1', type: 'mcq', question: 'How do you enable CSS Grid?', options: ['display: grid', 'grid: true', 'layout: grid', 'grid-display: on'], correctAnswer: 0, explanation: 'display: grid enables CSS Grid.', hint: 'Similar to flexbox syntax.', difficulty: 1, topic: 'CSS Grid' },
    { id: 'css-7-2', type: 'mcq', question: 'Which property defines column sizes?', options: ['grid-columns', 'grid-template-columns', 'columns', 'grid-cols'], correctAnswer: 1, explanation: 'grid-template-columns defines column sizes.', hint: 'It is a template for columns.', difficulty: 2, topic: 'CSS Grid' },
    { id: 'css-7-3', type: 'code-output', question: 'What does this create?', code: 'grid-template-columns: 1fr 1fr 1fr;', options: ['3 equal columns', '3 rows', '1 column 3 times wider', 'Nothing'], correctAnswer: 0, explanation: 'This creates 3 equal-width columns.', hint: 'fr means fraction.', difficulty: 2, topic: 'CSS Grid' },
    { id: 'css-7-4', type: 'mcq', question: 'What does grid-gap do?', options: ['Creates space between grid items', 'Gaps in the grid', 'Removes items', 'Creates holes'], correctAnswer: 0, explanation: 'grid-gap (now gap) creates spacing between items.', hint: 'It adds gutters.', difficulty: 2, topic: 'CSS Grid' },
    { id: 'css-7-5', type: 'mcq', question: 'How do you span multiple columns?', options: ['colspan: 2', 'grid-column: span 2', 'span: 2', 'column-span: 2'], correctAnswer: 1, explanation: 'grid-column: span 2 spans 2 columns.', hint: 'Use the span keyword.', difficulty: 3, topic: 'CSS Grid' },
  ],

  // JavaScript Level 8 - JS Variables
  8: [
    { id: 'js-8-1', type: 'mcq', question: 'Which keyword declares a constant?', options: ['var', 'let', 'const', 'static'], correctAnswer: 2, explanation: 'const declares a constant variable.', hint: 'Short for constant.', difficulty: 1, topic: 'Variables' },
    { id: 'js-8-2', type: 'code-output', question: 'What is the output?', code: 'let x = 5;\nlet y = "5";\nconsole.log(x == y);', options: ['true', 'false', 'undefined', 'Error'], correctAnswer: 0, explanation: '== performs type coercion.', hint: 'Consider == vs ===.', difficulty: 2, topic: 'Type Coercion' },
    { id: 'js-8-3', type: 'code-output', question: 'What is the output?', code: 'console.log(typeof null);', options: ['"null"', '"undefined"', '"object"', '"boolean"'], correctAnswer: 2, explanation: 'typeof null returns "object" (a known bug).', hint: 'This is a famous JS quirk!', difficulty: 3, topic: 'Data Types' },
    { id: 'js-8-4', type: 'mcq', question: 'Which method adds to end of array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correctAnswer: 0, explanation: 'push() adds to the end of an array.', hint: 'Like pushing onto a stack.', difficulty: 1, topic: 'Arrays' },
    { id: 'js-8-5', type: 'bug-fix', question: 'This should log 1 to 5. What is wrong?', code: 'for (let i = 0; i <= 5; i++) {\n  console.log(i);\n}', options: ['Nothing is wrong', 'i should start at 1', 'It logs 0 to 5, not 1 to 5', 'The loop never runs'], correctAnswer: 2, explanation: 'The loop starts at 0, not 1.', hint: 'Look at the starting value.', difficulty: 2, topic: 'Loops' },
  ],

  // JavaScript Level 9 - Functions
  9: [
    { id: 'js-9-1', type: 'mcq', question: 'How do you declare a function?', options: ['function myFunc() {}', 'def myFunc() {}', 'func myFunc() {}', 'fn myFunc() {}'], correctAnswer: 0, explanation: 'Use the function keyword.', hint: 'JavaScript uses function keyword.', difficulty: 1, topic: 'Functions' },
    { id: 'js-9-2', type: 'code-output', question: 'What is the output?', code: 'const add = (a, b) => a + b;\nconsole.log(add(2, 3));', options: ['5', '23', 'undefined', 'Error'], correctAnswer: 0, explanation: 'Arrow function adds 2 + 3 = 5.', hint: 'Arrow functions can return implicitly.', difficulty: 2, topic: 'Arrow Functions' },
    { id: 'js-9-3', type: 'mcq', question: 'What is a callback function?', options: ['A function passed as argument', 'A recursive function', 'A class method', 'An async function'], correctAnswer: 0, explanation: 'Callbacks are passed to other functions.', hint: 'They are called back later.', difficulty: 2, topic: 'Callbacks' },
    { id: 'js-9-4', type: 'code-output', question: 'What is the output?', code: 'function greet(name = "World") {\n  return "Hello " + name;\n}\nconsole.log(greet());', options: ['Hello World', 'Hello', 'Hello undefined', 'Error'], correctAnswer: 0, explanation: 'Default parameter is used.', hint: 'Default value is "World".', difficulty: 2, topic: 'Default Parameters' },
    { id: 'js-9-5', type: 'mcq', question: 'What does return do?', options: ['Stops function and returns value', 'Prints to console', 'Creates a loop', 'Declares variable'], correctAnswer: 0, explanation: 'return exits and returns a value.', hint: 'It gives back a result.', difficulty: 1, topic: 'Functions' },
  ],

  // JavaScript Level 10 - DOM Manipulation
  10: [
    { id: 'js-10-1', type: 'mcq', question: 'How to select by ID?', options: ['document.getById()', 'document.getElementById()', 'document.selectId()', 'document.findId()'], correctAnswer: 1, explanation: 'getElementById selects by ID.', hint: 'The method name is descriptive.', difficulty: 1, topic: 'DOM Selection' },
    { id: 'js-10-2', type: 'mcq', question: 'How to select by class?', options: ['document.getElementsByClassName()', 'document.getByClass()', 'document.selectClass()', 'document.findClass()'], correctAnswer: 0, explanation: 'getElementsByClassName returns a collection.', hint: 'Note the plural "Elements".', difficulty: 1, topic: 'DOM Selection' },
    { id: 'js-10-3', type: 'mcq', question: 'How to change text content?', options: ['element.text', 'element.textContent', 'element.value', 'element.setText()'], correctAnswer: 1, explanation: 'textContent sets text content.', hint: 'It is a property, not method.', difficulty: 2, topic: 'DOM Manipulation' },
    { id: 'js-10-4', type: 'mcq', question: 'How to add event listener?', options: ['element.on("click", fn)', 'element.listen("click", fn)', 'element.addEventListener("click", fn)', 'element.click(fn)'], correctAnswer: 2, explanation: 'addEventListener attaches event handlers.', hint: 'Add + Event + Listener.', difficulty: 2, topic: 'Events' },
    { id: 'js-10-5', type: 'mcq', question: 'What does querySelector return?', options: ['First matching element', 'All matching elements', 'Boolean', 'NodeList'], correctAnswer: 0, explanation: 'querySelector returns the first match.', hint: 'Singular = one result.', difficulty: 2, topic: 'DOM Selection' },
  ],

  // Data Structures Level 11 - Arrays
  11: [
    { id: 'ds-11-1', type: 'mcq', question: 'What is time complexity of array access?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Array access is O(1) constant time.', hint: 'Direct index access is fast.', difficulty: 1, topic: 'Arrays' },
    { id: 'ds-11-2', type: 'mcq', question: 'What is time complexity of array insertion at end?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Appending is O(1) amortized.', hint: 'No shifting needed at end.', difficulty: 2, topic: 'Arrays' },
    { id: 'ds-11-3', type: 'mcq', question: 'What is time complexity of insertion at beginning?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 1, explanation: 'All elements must shift.', hint: 'Elements need to move.', difficulty: 2, topic: 'Arrays' },
    { id: 'ds-11-4', type: 'mcq', question: 'Which is NOT an array operation?', options: ['push', 'pop', 'enqueue', 'slice'], correctAnswer: 2, explanation: 'Enqueue is a queue operation.', hint: 'Think about data structures.', difficulty: 2, topic: 'Arrays' },
    { id: 'ds-11-5', type: 'mcq', question: 'What does slice() return?', options: ['New array with portion', 'Modified original', 'Single element', 'Boolean'], correctAnswer: 0, explanation: 'slice() returns a new array.', hint: 'It does not mutate original.', difficulty: 2, topic: 'Arrays' },
  ],

  // Data Structures Level 12 - Linked Lists
  12: [
    { id: 'ds-12-1', type: 'mcq', question: 'What is a linked list?', options: ['Elements linked by pointers', 'Contiguous memory', 'Hash table', 'Tree structure'], correctAnswer: 0, explanation: 'Nodes are connected by pointers.', hint: 'Elements are linked together.', difficulty: 1, topic: 'Linked Lists' },
    { id: 'ds-12-2', type: 'mcq', question: 'Advantage of linked list over array?', options: ['Dynamic size', 'Faster access', 'Less memory', 'Better sorting'], correctAnswer: 0, explanation: 'Linked lists grow dynamically.', hint: 'No fixed size needed.', difficulty: 2, topic: 'Linked Lists' },
    { id: 'ds-12-3', type: 'mcq', question: 'Time complexity to access nth element?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 1, explanation: 'Must traverse from head.', hint: 'No direct indexing.', difficulty: 2, topic: 'Linked Lists' },
    { id: 'ds-12-4', type: 'mcq', question: 'What does a doubly linked list have?', options: ['Two heads', 'Next and prev pointers', 'Two values per node', 'Circular structure'], correctAnswer: 1, explanation: 'Each node has next and previous pointers.', hint: 'Can traverse both directions.', difficulty: 2, topic: 'Linked Lists' },
    { id: 'ds-12-5', type: 'mcq', question: 'Time to insert at head?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Just update head pointer.', hint: 'No traversal needed.', difficulty: 2, topic: 'Linked Lists' },
  ],

  // Data Structures Level 13 - Stacks & Queues
  13: [
    { id: 'ds-13-1', type: 'mcq', question: 'What principle does a stack follow?', options: ['FIFO', 'LIFO', 'Random', 'Priority'], correctAnswer: 1, explanation: 'Stack follows Last In First Out.', hint: 'Like a stack of plates.', difficulty: 1, topic: 'Stacks' },
    { id: 'ds-13-2', type: 'mcq', question: 'What principle does a queue follow?', options: ['FIFO', 'LIFO', 'Random', 'Priority'], correctAnswer: 0, explanation: 'Queue follows First In First Out.', hint: 'Like a line of people.', difficulty: 1, topic: 'Queues' },
    { id: 'ds-13-3', type: 'mcq', question: 'Which operation adds to a stack?', options: ['enqueue', 'push', 'insert', 'add'], correctAnswer: 1, explanation: 'Push adds to top of stack.', hint: 'Same as array method name.', difficulty: 1, topic: 'Stacks' },
    { id: 'ds-13-4', type: 'mcq', question: 'Which removes from a queue?', options: ['pop', 'dequeue', 'remove', 'shift'], correctAnswer: 1, explanation: 'Dequeue removes from front.', hint: 'Opposite of enqueue.', difficulty: 2, topic: 'Queues' },
    { id: 'ds-13-5', type: 'mcq', question: 'Real-world example of a queue?', options: ['Undo button', 'Print queue', 'Browser back', 'Function calls'], correctAnswer: 1, explanation: 'Print jobs are processed in order.', hint: 'First document prints first.', difficulty: 2, topic: 'Queues' },
  ],

  // Data Structures Level 14 - Trees
  14: [
    { id: 'ds-14-1', type: 'mcq', question: 'What is the top node called?', options: ['Head', 'Root', 'Top', 'Parent'], correctAnswer: 1, explanation: 'The topmost node is the root.', hint: 'Like root of a plant.', difficulty: 1, topic: 'Trees' },
    { id: 'ds-14-2', type: 'mcq', question: 'What is a binary tree?', options: ['Two nodes only', 'Max 2 children per node', 'Two levels', 'Binary data'], correctAnswer: 1, explanation: 'Each node has at most 2 children.', hint: 'Binary = two.', difficulty: 1, topic: 'Binary Trees' },
    { id: 'ds-14-3', type: 'mcq', question: 'What is a leaf node?', options: ['Root node', 'Node with no children', 'Node with one child', 'Any node'], correctAnswer: 1, explanation: 'Leaf nodes have no children.', hint: 'Like leaves on a tree.', difficulty: 1, topic: 'Trees' },
    { id: 'ds-14-4', type: 'mcq', question: 'BST search time complexity?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 2, explanation: 'BST search is O(log n) average.', hint: 'Halves search space each step.', difficulty: 2, topic: 'BST' },
    { id: 'ds-14-5', type: 'mcq', question: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correctAnswer: 1, explanation: 'Preorder: root, left, right.', hint: 'Pre = before children.', difficulty: 2, topic: 'Tree Traversal' },
  ],

  // Data Structures Level 15 - Graphs
  15: [
    { id: 'ds-15-1', type: 'mcq', question: 'What are graph components?', options: ['Nodes and edges', 'Root and leaves', 'Head and tail', 'Keys and values'], correctAnswer: 0, explanation: 'Graphs have vertices (nodes) and edges.', hint: 'Points connected by lines.', difficulty: 1, topic: 'Graphs' },
    { id: 'ds-15-2', type: 'mcq', question: 'What is a directed graph?', options: ['Edges have direction', 'Fixed path only', 'No cycles', 'Single source'], correctAnswer: 0, explanation: 'Edges point from one node to another.', hint: 'Like one-way streets.', difficulty: 2, topic: 'Graphs' },
    { id: 'ds-15-3', type: 'mcq', question: 'What algorithm finds shortest path?', options: ['DFS', 'BFS', 'Dijkstra', 'Quicksort'], correctAnswer: 2, explanation: 'Dijkstra finds shortest paths.', hint: 'Named after a computer scientist.', difficulty: 2, topic: 'Graph Algorithms' },
    { id: 'ds-15-4', type: 'mcq', question: 'BFS uses which data structure?', options: ['Stack', 'Queue', 'Heap', 'Tree'], correctAnswer: 1, explanation: 'BFS uses a queue for level-order.', hint: 'Breadth = layer by layer.', difficulty: 2, topic: 'Graph Algorithms' },
    { id: 'ds-15-5', type: 'mcq', question: 'DFS uses which data structure?', options: ['Stack', 'Queue', 'Heap', 'Array'], correctAnswer: 0, explanation: 'DFS uses a stack (or recursion).', hint: 'Depth = go deep first.', difficulty: 2, topic: 'Graph Algorithms' },
  ],

  // DBMS Level 16 - SQL Basics
  16: [
    { id: 'dbms-16-1', type: 'mcq', question: 'Which retrieves data from a table?', options: ['GET', 'SELECT', 'FETCH', 'READ'], correctAnswer: 1, explanation: 'SELECT retrieves data.', hint: 'You select what you want.', difficulty: 1, topic: 'SQL Basics' },
    { id: 'dbms-16-2', type: 'mcq', question: 'Which inserts new data?', options: ['ADD', 'INSERT', 'CREATE', 'PUT'], correctAnswer: 1, explanation: 'INSERT adds new rows.', hint: 'Insert into a table.', difficulty: 1, topic: 'SQL Basics' },
    { id: 'dbms-16-3', type: 'mcq', question: 'Which updates existing data?', options: ['MODIFY', 'CHANGE', 'UPDATE', 'ALTER'], correctAnswer: 2, explanation: 'UPDATE modifies existing rows.', hint: 'Update values in rows.', difficulty: 1, topic: 'SQL Basics' },
    { id: 'dbms-16-4', type: 'mcq', question: 'Which deletes data?', options: ['REMOVE', 'DELETE', 'DROP', 'ERASE'], correctAnswer: 1, explanation: 'DELETE removes rows.', hint: 'Delete from table.', difficulty: 1, topic: 'SQL Basics' },
    { id: 'dbms-16-5', type: 'code-output', question: 'What does this return?', code: 'SELECT * FROM users;', options: ['All columns from users', 'All tables', 'User count', 'Nothing'], correctAnswer: 0, explanation: '* selects all columns.', hint: '* means everything.', difficulty: 1, topic: 'SQL Basics' },
  ],

  // DBMS Level 17 - Database Design
  17: [
    { id: 'dbms-17-1', type: 'mcq', question: 'What is a primary key?', options: ['Unique identifier for row', 'First column', 'Foreign reference', 'Index'], correctAnswer: 0, explanation: 'Primary key uniquely identifies each row.', hint: 'Must be unique.', difficulty: 1, topic: 'Database Design' },
    { id: 'dbms-17-2', type: 'mcq', question: 'What is a foreign key?', options: ['Key from another country', 'Reference to another table', 'Encrypted key', 'Backup key'], correctAnswer: 1, explanation: 'Foreign key references another table.', hint: 'Links tables together.', difficulty: 2, topic: 'Database Design' },
    { id: 'dbms-17-3', type: 'mcq', question: 'What is normalization?', options: ['Organizing to reduce redundancy', 'Making data normal', 'Averaging values', 'Encryption'], correctAnswer: 0, explanation: 'Normalization reduces data redundancy.', hint: 'Organize data efficiently.', difficulty: 2, topic: 'Database Design' },
    { id: 'dbms-17-4', type: 'mcq', question: 'What is 1NF?', options: ['No repeating groups', 'No partial dependencies', 'No transitive dependencies', 'No nulls'], correctAnswer: 0, explanation: 'First Normal Form eliminates repeating groups.', hint: 'First step of normalization.', difficulty: 2, topic: 'Normalization' },
    { id: 'dbms-17-5', type: 'mcq', question: 'What does an index improve?', options: ['Query speed', 'Storage space', 'Data accuracy', 'Security'], correctAnswer: 0, explanation: 'Indexes speed up queries.', hint: 'Like a book index.', difficulty: 2, topic: 'Database Design' },
  ],

  // DBMS Level 18 - Advanced SQL
  18: [
    { id: 'dbms-18-1', type: 'mcq', question: 'What does INNER JOIN return?', options: ['Matching rows only', 'All rows from left', 'All rows from both', 'No rows'], correctAnswer: 0, explanation: 'INNER JOIN returns matching rows.', hint: 'Only where both match.', difficulty: 2, topic: 'SQL Joins' },
    { id: 'dbms-18-2', type: 'mcq', question: 'What does LEFT JOIN include?', options: ['Only left table', 'All left + matching right', 'Only matching', 'All from both'], correctAnswer: 1, explanation: 'LEFT JOIN includes all left rows.', hint: 'Left table is preserved.', difficulty: 2, topic: 'SQL Joins' },
    { id: 'dbms-18-3', type: 'mcq', question: 'What is a subquery?', options: ['Query inside query', 'Slow query', 'Backup query', 'Delete query'], correctAnswer: 0, explanation: 'Subquery is nested inside another.', hint: 'Query within a query.', difficulty: 2, topic: 'Subqueries' },
    { id: 'dbms-18-4', type: 'mcq', question: 'What does GROUP BY do?', options: ['Groups rows by column', 'Sorts data', 'Filters data', 'Joins tables'], correctAnswer: 0, explanation: 'GROUP BY groups rows for aggregation.', hint: 'Used with aggregate functions.', difficulty: 2, topic: 'SQL Grouping' },
    { id: 'dbms-18-5', type: 'mcq', question: 'What filters grouped results?', options: ['WHERE', 'HAVING', 'FILTER', 'GROUP'], correctAnswer: 1, explanation: 'HAVING filters after grouping.', hint: 'WHERE is before grouping.', difficulty: 3, topic: 'SQL Grouping' },
  ],

  // Python Level 19 - Python Basics
  19: [
    { id: 'py-19-1', type: 'mcq', question: 'How do you print in Python?', options: ['console.log()', 'print()', 'echo()', 'write()'], correctAnswer: 1, explanation: 'print() outputs to console.', hint: 'Simple and descriptive name.', difficulty: 1, topic: 'Python Basics' },
    { id: 'py-19-2', type: 'mcq', question: 'How do you declare a variable?', options: ['var x = 5', 'let x = 5', 'x = 5', 'int x = 5'], correctAnswer: 2, explanation: 'Python uses simple assignment.', hint: 'No keyword needed!', difficulty: 1, topic: 'Variables' },
    { id: 'py-19-3', type: 'mcq', question: 'How to write a comment?', options: ['// comment', '/* comment */', '# comment', '-- comment'], correctAnswer: 2, explanation: '# starts a comment in Python.', hint: 'Hash symbol.', difficulty: 1, topic: 'Python Basics' },
    { id: 'py-19-4', type: 'code-output', question: 'What is the output?', code: 'print(type(3.14))', options: ['<class \'float\'>', '<class \'int\'>', '<class \'number\'>', 'Error'], correctAnswer: 0, explanation: '3.14 is a float.', hint: 'Decimal numbers are floats.', difficulty: 2, topic: 'Data Types' },
    { id: 'py-19-5', type: 'mcq', question: 'Which is a valid string?', options: ['hello', '"hello"', 'string(hello)', '[hello]'], correctAnswer: 1, explanation: 'Strings use quotes.', hint: 'Text is wrapped in quotes.', difficulty: 1, topic: 'Data Types' },
  ],

  // Python Level 20 - Control Flow
  20: [
    { id: 'py-20-1', type: 'mcq', question: 'How to write an if statement?', options: ['if (x > 5) {}', 'if x > 5:', 'if x > 5 then', 'if (x > 5):'], correctAnswer: 1, explanation: 'Python uses colon, no parentheses needed.', hint: 'Colons and indentation.', difficulty: 1, topic: 'Conditionals' },
    { id: 'py-20-2', type: 'mcq', question: 'What is Python else if keyword?', options: ['else if', 'elseif', 'elif', 'elsif'], correctAnswer: 2, explanation: 'Python uses elif.', hint: 'Shortened version.', difficulty: 1, topic: 'Conditionals' },
    { id: 'py-20-3', type: 'code-output', question: 'What is the output?', code: 'for i in range(3):\n    print(i)', options: ['0 1 2', '1 2 3', '0 1 2 3', 'Error'], correctAnswer: 0, explanation: 'range(3) gives 0, 1, 2.', hint: 'range starts at 0.', difficulty: 2, topic: 'Loops' },
    { id: 'py-20-4', type: 'mcq', question: 'Which loop checks condition first?', options: ['for', 'while', 'do-while', 'foreach'], correctAnswer: 1, explanation: 'while checks before each iteration.', hint: 'Condition at the top.', difficulty: 2, topic: 'Loops' },
    { id: 'py-20-5', type: 'mcq', question: 'What does break do?', options: ['Exits the loop', 'Pauses execution', 'Skips iteration', 'Causes error'], correctAnswer: 0, explanation: 'break exits the loop immediately.', hint: 'Breaks out of the loop.', difficulty: 1, topic: 'Loops' },
  ],

  // Python Level 21 - Python Functions
  21: [
    { id: 'py-21-1', type: 'mcq', question: 'How to define a function?', options: ['function myFunc():', 'def myFunc():', 'fn myFunc():', 'define myFunc():'], correctAnswer: 1, explanation: 'Python uses def keyword.', hint: 'Short for define.', difficulty: 1, topic: 'Functions' },
    { id: 'py-21-2', type: 'code-output', question: 'What is the output?', code: 'def add(a, b=5):\n    return a + b\nprint(add(3))', options: ['8', '3', '5', 'Error'], correctAnswer: 0, explanation: 'b defaults to 5, so 3+5=8.', hint: 'Default parameter is used.', difficulty: 2, topic: 'Functions' },
    { id: 'py-21-3', type: 'mcq', question: 'What is *args for?', options: ['Variable arguments', 'Keyword args', 'No arguments', 'Required args'], correctAnswer: 0, explanation: '*args accepts variable positional arguments.', hint: 'Asterisk for multiple.', difficulty: 2, topic: 'Functions' },
    { id: 'py-21-4', type: 'mcq', question: 'What is **kwargs for?', options: ['Positional args', 'Keyword arguments', 'No arguments', 'Required args'], correctAnswer: 1, explanation: '**kwargs accepts keyword arguments.', hint: 'Double asterisk for keywords.', difficulty: 2, topic: 'Functions' },
    { id: 'py-21-5', type: 'mcq', question: 'What is a lambda function?', options: ['Named function', 'Anonymous function', 'Class method', 'Generator'], correctAnswer: 1, explanation: 'Lambda creates anonymous functions.', hint: 'Inline, unnamed function.', difficulty: 2, topic: 'Functions' },
  ],

  // Python Level 22 - OOP in Python
  22: [
    { id: 'py-22-1', type: 'mcq', question: 'How to define a class?', options: ['class MyClass:', 'Class MyClass:', 'def class MyClass:', 'create MyClass:'], correctAnswer: 0, explanation: 'Use class keyword with colon.', hint: 'Lowercase class keyword.', difficulty: 1, topic: 'OOP' },
    { id: 'py-22-2', type: 'mcq', question: 'What is __init__?', options: ['Destructor', 'Constructor', 'Iterator', 'Generator'], correctAnswer: 1, explanation: '__init__ is the constructor method.', hint: 'Initializes the object.', difficulty: 1, topic: 'OOP' },
    { id: 'py-22-3', type: 'mcq', question: 'What does self refer to?', options: ['Class', 'Instance', 'Parent', 'Module'], correctAnswer: 1, explanation: 'self refers to the instance.', hint: 'The object itself.', difficulty: 2, topic: 'OOP' },
    { id: 'py-22-4', type: 'mcq', question: 'How to inherit from a class?', options: ['class Child extends Parent:', 'class Child(Parent):', 'class Child inherits Parent:', 'class Child : Parent:'], correctAnswer: 1, explanation: 'Use parentheses for inheritance.', hint: 'Parent in parentheses.', difficulty: 2, topic: 'Inheritance' },
    { id: 'py-22-5', type: 'mcq', question: 'What is encapsulation?', options: ['Hiding internal details', 'Multiple inheritance', 'Method overriding', 'Object creation'], correctAnswer: 0, explanation: 'Encapsulation hides internal state.', hint: 'Like a capsule protecting contents.', difficulty: 2, topic: 'OOP' },
  ],

  // Python Level 23 - File Handling
  23: [
    { id: 'py-23-1', type: 'mcq', question: 'How to open a file?', options: ['file.open()', 'open(filename)', 'read(filename)', 'File(filename)'], correctAnswer: 1, explanation: 'open() function opens files.', hint: 'Built-in function name.', difficulty: 1, topic: 'File Handling' },
    { id: 'py-23-2', type: 'mcq', question: 'Mode to read a file?', options: ['read', 'r', 'open', 'get'], correctAnswer: 1, explanation: 'r mode is for reading.', hint: 'First letter of read.', difficulty: 1, topic: 'File Handling' },
    { id: 'py-23-3', type: 'mcq', question: 'Mode to write (overwrite)?', options: ['w', 'write', 'o', 'new'], correctAnswer: 0, explanation: 'w mode writes/overwrites.', hint: 'First letter of write.', difficulty: 1, topic: 'File Handling' },
    { id: 'py-23-4', type: 'mcq', question: 'Mode to append?', options: ['add', 'a', 'append', '+'], correctAnswer: 1, explanation: 'a mode appends to file.', hint: 'First letter of append.', difficulty: 1, topic: 'File Handling' },
    { id: 'py-23-5', type: 'mcq', question: 'Best way to handle files?', options: ['try/except', 'with statement', 'manual close', 'global variable'], correctAnswer: 1, explanation: 'with statement auto-closes files.', hint: 'Context manager.', difficulty: 2, topic: 'File Handling' },
  ],

  // Python Level 24 - Error Handling
  24: [
    { id: 'py-24-1', type: 'mcq', question: 'How to catch exceptions?', options: ['catch:', 'except:', 'error:', 'handle:'], correctAnswer: 1, explanation: 'except catches exceptions.', hint: 'Not catch like other languages.', difficulty: 1, topic: 'Error Handling' },
    { id: 'py-24-2', type: 'mcq', question: 'What keyword tries risky code?', options: ['attempt', 'try', 'test', 'risk'], correctAnswer: 1, explanation: 'try block contains risky code.', hint: 'Try to do something.', difficulty: 1, topic: 'Error Handling' },
    { id: 'py-24-3', type: 'mcq', question: 'What always runs after try?', options: ['else', 'except', 'finally', 'always'], correctAnswer: 2, explanation: 'finally always executes.', hint: 'Final cleanup.', difficulty: 2, topic: 'Error Handling' },
    { id: 'py-24-4', type: 'mcq', question: 'How to raise an exception?', options: ['throw Error', 'raise Exception', 'error Exception', 'throw Exception'], correctAnswer: 1, explanation: 'raise keyword raises exceptions.', hint: 'Not throw like JS.', difficulty: 2, topic: 'Error Handling' },
    { id: 'py-24-5', type: 'mcq', question: 'Which catches all exceptions?', options: ['except:', 'except All:', 'except *:', 'except Exception:'], correctAnswer: 0, explanation: 'Bare except catches all.', hint: 'No specific type.', difficulty: 2, topic: 'Error Handling' },
  ],

  // Python Level 25 - Python Mastery
  25: [
    { id: 'py-25-1', type: 'mcq', question: 'What is a list comprehension?', options: ['List documentation', 'Compact list creation', 'List sorting', 'List merging'], correctAnswer: 1, explanation: 'List comprehension creates lists concisely.', hint: '[x for x in items].', difficulty: 2, topic: 'Advanced Python' },
    { id: 'py-25-2', type: 'code-output', question: 'What is the output?', code: '[x**2 for x in range(4)]', options: ['[0, 1, 4, 9]', '[1, 4, 9, 16]', '[0, 1, 2, 3]', 'Error'], correctAnswer: 0, explanation: 'Squares of 0,1,2,3.', hint: '** is power operator.', difficulty: 2, topic: 'List Comprehension' },
    { id: 'py-25-3', type: 'mcq', question: 'What is a decorator?', options: ['Design pattern', 'Function wrapper', 'Class method', 'Variable type'], correctAnswer: 1, explanation: 'Decorators wrap functions.', hint: '@decorator syntax.', difficulty: 3, topic: 'Advanced Python' },
    { id: 'py-25-4', type: 'mcq', question: 'What does yield do?', options: ['Returns and ends', 'Returns and pauses', 'Throws error', 'Creates class'], correctAnswer: 1, explanation: 'yield creates a generator.', hint: 'Pauses, does not end.', difficulty: 3, topic: 'Generators' },
    { id: 'py-25-5', type: 'mcq', question: 'What is GIL in Python?', options: ['Graphics Library', 'Global Interpreter Lock', 'General Input Layer', 'Game Interface Library'], correctAnswer: 1, explanation: 'GIL limits threading in CPython.', hint: 'Related to threading.', difficulty: 3, topic: 'Advanced Python' },
  ],
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