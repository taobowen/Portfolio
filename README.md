# 🧰 Portfolio Generator

Generate a beautiful and customizable portfolio site from Markdown files — fast, flexible, and fully static.

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/taobowen/Portfolio.git
cd Portfolio
npm install
```

## ✨ Features

- Write each project in its own folder using simple `Markdown`
- Auto-generate a stylish React-based portfolio site
- Live preview locally
- One-click deploy to GitHub Pages or any static host

## 🚀 Usage Guide

### 1. Initialize a New Project

Create a new project folder under `doc/` with starter content:

```bash
npm run init -- my-project
```

This creates:

```
doc/my-project/
└── index.md      # editable content
```

### 2. Customize the Markdown

Open `doc/my-project/index.md` and update the frontmatter and content:

```markdown
---
title: My Project
description: A short summary here
category: Web
createDate: 2024-06-10
updateDate: 2024-06-12
---

# My Project

## Overview

A detailed write-up here...

## Features

- Clean interface
- Responsive layout
```

You can also place an `index.png` as the **cover image** for the project.


### 3. Add an About Section

To customize the "About" section in the sidebar, create a about.md file in the lib/ folder:

```bash
lib/about.md
```

Write your personal introduction in plain Markdown:


```markdown
# 👋 Hello!

I'm Bowen, a developer passionate about building beautiful and functional software.

- 🔭 I’m currently working on ski video AI analysis
- 🌱 I’m exploring advanced motion estimation and pose modeling
- 📫 Reach me at: taobowen.dev@gmail.com

```

This file will be converted into a React component and automatically injected into the sidebar of the layout.

✅ You can even use raw HTML or <script>/<meta> tags in about.md for redirect or custom logic if needed.


### 4. Update Global Settings

Edit `lib/setting.json` to update:

- Website title
- Favicon
- Other metadata

```json
{
  "title": "Bowen's Portfolio",
  "favicon": "./lib/assets/favicon.png"
}
```

### 5. Generate the Site

Compile the markdown content and metadata into a static site:

```bash
npm run generate
```

### 6. Preview Locally

Launch a local dev server to view and test:

```bash
npm run preview
```

Visit: http://localhost:3000

### 7. Build for Deployment

Compile final static assets using Webpack:

```bash
npm run build
```

### 8. Deploy to GitHub Pages

You can push the contents of the `dist/` folder to your GitHub Pages repository:

```bash
cp -r dist/* ../taobowen.github.io/
cd ../taobowen.github.io/
git add .
git commit -m "Deploy portfolio"
git push origin main
```

## 🧪 Available Commands

| Command            | Description                                 |
|--------------------|---------------------------------------------|
| `npm run init`     | Create a new markdown project               |
| `npm run generate` | Convert markdown into React components      |
| `npm run preview`  | Start local development server              |
| `npm run build`    | Build static files for deployment           |
| `npm run serve`    | Preview production build locally            |

## 👨‍💻 Author

**梁家河的扛麦郎**  
GitHub: [@taobowen](https://github.com/taobowen)

## 📄 License

ISC © 2025 Bowen Tao
