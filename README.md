# Vazcade 🎮

Welcome to **Vazcade**, the arcade for AI-generated games!

## 🚀 How to Add a New Game

1.  **Get the Code:** Ask Gemini/ChatGPT to "write a single-file HTML game".
2.  **Create a Folder:** Go to `public/games/` and create a new folder (e.g., `super-pong`).
3.  **Paste the File:** Save the HTML code as `index.html` inside that folder.
4.  **Describe the Game:** Go to `src/content/games/` and create a new file (e.g., `super-pong.md`).
5.  **Add Metadata:** Paste this template into the file and fill it out:

```markdown
---
title: "Super Pong"
description: "A classic pong game made by Gemini."
author: "Vaz Kid #1"
folder: "super-pong"
publishDate: "2026-02-20"
controls: "Use Up/Down arrows to move paddle."
---
# Super Pong

This is a really cool game where you bounce the ball back and forth!
```

That's it! Run the site and your game will appear automatically.

## 🛠️ Running Locally

1.  Open a terminal in this folder.
2.  Run `npm install` (only once).
3.  Run `npm run dev`.
4.  Open `http://localhost:4321` in your browser.

## 📦 Deploying

This project is ready for Netlify or Vercel. Just drag and drop the `dist` folder after running `npm run build`, or connect your GitHub repository.
