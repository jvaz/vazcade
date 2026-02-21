const fs = require('fs');

const filePath = 'public/games/among-us/index.html';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix newlines inside double-quoted strings
// We look for " ... \n ... "
// This is a naive regex but handles the most common PDF-break case.
// It matches a quote, some chars, a newline, more chars, a quote.
// We remove the newline if it looks like a broken string.

// Actually, a safer way specifically for this file (since we saw the breaks in class names):
// The breaks looked like: `class="... drop-\nshadow ..."`
// We will simply remove newlines that are inside double quotes.

let fixed = '';
let inQuote = false;
for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
        inQuote = !inQuote;
        fixed += char;
    } else if (char === '\n' && inQuote) {
        // If we are in a quote and hit a newline, it's likely a PDF artifact.
        // We skip the newline.
        // However, we should check if it's a <script> or HTML attribute.
        // HTML attributes CAN have newlines, but JS strings cannot.
        // Since this file mixes both, we have to be careful.
        
        // But in this specific generated code, the HTML attributes shouldn't really have newlines 
        // in critical places like class names, so joining them is probably safe and better.
        // For JS strings, it is MANDATORY to remove them.
        // So we strip it.
        // We might want to add a space if the previous char wasn't a hyphen?
        // PDF often adds hyphen+newline for word wrap.
        
        const prev = content[i-1];
        if (prev === '-') {
            // "drop-\nshadow" -> "drop-shadow" (remove newline)
        } else {
            // "some word\nother word" -> "some wordother word"? No, usually space is needed.
            // But PDFs often break on spaces.
            // Let's assume simple join for now, or maybe replace with space?
            // "class='... text-\nred ...'" -> "text-red"
            // "text='Hello\nWorld'" -> "Hello World"
            
            // Let's try replacing with nothing (joining).
        }
    } else {
        fixed += char;
    }
}

// Re-running with a better regex approach for specific known broken lines
// "text-7xl md:text-9xl font-black tracking-widest mb-4 text-red-600 drop-\nshadow-[0_0_30px_red]"
content = content.replace(/drop-\nshadow/g, 'drop-shadow');
content = content.replace(/text-\ncenter/g, 'text-center');
content = content.replace(/shadow-\n\[/g, 'shadow-[');
content = content.replace(/text-\nred/g, 'text-red');
content = content.replace(/text-\nblue/g, 'text-blue');
content = content.replace(/text-\ngreen/g, 'text-green');
content = content.replace(/bg-\n/g, 'bg-');
content = content.replace(/font-\n/g, 'font-');
content = content.replace(/tracking-\n/g, 'tracking-');
content = content.replace(/border-\n/g, 'border-');
content = content.replace(/active:translate-\n/g, 'active:translate-');
content = content.replace(/justify-\n/g, 'justify-');
content = content.replace(/align-\n/g, 'align-');
content = content.replace(/pointer-\n/g, 'pointer-');
content = content.replace(/over\nflow/g, 'overflow'); // Fix "over\nflow"
content = content.replace(/task-\n/g, 'task-'); // Fix "task-\ndownload"

// Fix JS string breaks specifically
// Look for lines ending in " and the next line starting with lowercase/symbols
// or broken variable access like "document.getElementById('action-\nmain')"

content = content.replace(/'action-\nmain'/g, "'action-main'");
content = content.replace(/'action-\nreport'/g, "'action-report'");
content = content.replace(/'action-\nvent'/g, "'action-vent'");
content = content.replace(/'task-\nkeypad'/g, "'task-keypad'");
content = content.replace(/'task-\ndownload'/g, "'task-download'");

// Fix dangling keywords at end of line
// "const \n variable" -> "const variable"
content = content.replace(/const\s*\n\s*/g, 'const ');
content = content.replace(/let\s*\n\s*/g, 'let ');
content = content.replace(/var\s*\n\s*/g, 'var ');

// Fix broken method calls
// "classList.\nadd" -> "classList.add"
content = content.replace(/classList\.\s*\n\s*add/g, 'classList.add');
content = content.replace(/classList\.\s*\n\s*remove/g, 'classList.remove');
content = content.replace(/classList\.\s*\n\s*replace/g, 'classList.replace');
content = content.replace(/classList\.\s*\n\s*toggle/g, 'classList.toggle');

// Fix broken document methods
// "document.\ngetElementById" -> "document.getElementById"
content = content.replace(/document\.\s*\n\s*getElementById/g, 'document.getElementById');
content = content.replace(/document\.\s*\n\s*createElement/g, 'document.createElement');
content = content.replace(/document\.\s*\n\s*addEventListener/g, 'document.addEventListener');

// Fix string breaks in IDs or classes that might have been missed
// "getElementById('some-\nid')" -> "getElementById('some-id')"
content = content.replace(/'([^']*[a-z])-\s*\n\s*([a-z][^']*)'/g, "'$1-$2'");
content = content.replace(/"([^"]*[a-z])-\s*\n\s*([a-z][^"]*)"/g, '"$1-$2"');

// Specific fix for the case found: "const \n btnVent"
// This is covered by the first regex, but let's double check spaces.

fs.writeFileSync(filePath, content);
console.log('Applied fixes phase 2');
