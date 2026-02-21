const fs = require('fs');

const filePath = 'public/games/among-us/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Email Headers
const docTypeIndex = content.indexOf('<!DOCTYPE html>');
if (docTypeIndex > 0) {
    console.log('Removing email headers...');
    content = content.substring(docTypeIndex);
}

// 2. Remove Page Markers (e.g., "-- 1 of 17 --")
// The previous fix might have missed them if they were slightly different.
// Regex: Matches a line that is just dashes and numbers.
content = content.replace(/^\s*-+\s*\d+\s*of\s*\d+\s*-+\s*$/gm, '');

// 3. Fix broken lines (Dangling operators/keywords)
// We look for lines ending with specific chars and join them with the next line.
// Operators: = , { (
// Keywords: const, let, var, return, function
// We replace "KEYWORD \n" with "KEYWORD "

const joinWithSpace = [
    'const', 'let', 'var', 'function', 'return', 'else', 'typeof', 'instanceof', 'void', 'delete', 'new', 'in'
];

const joinWithoutSpace = [
    '=', '\\(', '\\{', '\\,', '\\:', '\\?', '\\|\\|', '&&', '\\.' // . is crucial for object.property
];

// Helper to replace dangling keywords
joinWithSpace.forEach(kw => {
    // Regex: keyword followed by optional space, then newline, then optional space
    const re = new RegExp(`${kw}\\s*\\n\\s*`, 'g');
    content = content.replace(re, `${kw} `);
});

// Helper to replace dangling operators (no space added usually, or space doesn't matter)
joinWithoutSpace.forEach(op => {
    // Escape check not needed for string regex, but needed for RegExp constructor if not already escaped
    // The list above has escapes for regex special chars.
    const re = new RegExp(`${op}\\s*\\n\\s*`, 'g');
    // For operators, we generally just want to join. A space is fine for most, but not for .
    const replacement = op.includes('\\.') ? '.' : op.replace(/\\/g, '') + ' '; 
    
    // Actually, for '.' we want NO space. For others, space is safer.
    // Let's handle '.' separately.
});

// Specific fix for dot notation breaks: "document.\ngetElementById" -> "document.getElementById"
content = content.replace(/\.\s*\n\s*/g, '.');

// Specific fix for assignment: "variable =\n value" -> "variable = value"
content = content.replace(/=\s*\n\s*/g, '= ');

// Specific fix for comma lists: "a,\n b" -> "a, b"
content = content.replace(/,\s*\n\s*/g, ', ');

// Specific fix for open parenthesis: "func(\n args" -> "func(args"
content = content.replace(/\(\s*\n\s*/g, '(');

// Specific fix for open brace: "{\n code" -> "{ code"
content = content.replace(/\{\s*\n\s*/g, '{');

// 4. Fix specific broken strings found in previous review
// "active:translate-\n1" -> "active:translate-1"
// "justify-\ncontent" -> "justify-content"
// "align-\nitems" -> "align-items"
content = content.replace(/([a-z])-\s*\n\s*([a-z0-9])/g, '$1-$2');

// 5. Fix HTML attributes broken by newlines
// class="... \n ..." -> class="... ..."
// This is tricky with regex. We'll do a specific pass for class attributes if possible, 
// or just rely on the fact that browser HTML parsers are lenient with whitespace in attributes.
// CSS logic inside <style> IS sensitive to breaks in property names.
// "align-\nitems" was fixed by step 4.

fs.writeFileSync(filePath, content);
console.log('Applied deep cleaning fixes.');
