# LiveDataViz

Make contextual data visualizations with a Chat Interface, powered by OpenAI.

Type a natural language query and get an interactive Vega-Lite chart back. Refine your visualization step-by-step through conversation without retyping complex queries.

## Features

- Natural language → Vega-Lite data visualization
- Conversational context: edit/adjust charts across multiple turns
- Upload your own CSV datasets
- Two built-in demo datasets (Cars, Students)
- Powered by OpenAI (gpt-4o by default)

---

## Local Development

### Step 1 — Add your OpenAI API key

Copy `.env.example` to `.env` and fill in your key:

```
cp .env.example .env
```

Then edit `.env`:

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

### Step 2 — Install dependencies

```bash
yarn install
# or
npm install
```

### Step 3 — Start the dev server

```bash
vercel dev
```

Or for frontend-only (no API calls will work without a server):

```bash
yarn dev
```

The app runs at `http://localhost:3000` (vercel dev) or `http://localhost:5173` (vite dev).

---

## Deployment on Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/livedataviz.git
git push -u origin main
```

### Step 2 — Import to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**
2. Import your GitHub repository
3. Vercel will auto-detect the Vite framework

### Step 3 — Add Environment Variables

In the Vercel project dashboard → **Settings → Environment Variables**, add:

| Name | Value |
|------|-------|
| `OPENAI_API_KEY` | `sk-your-key-here` |
| `OPENAI_MODEL` | `gpt-4o` *(optional, defaults to gpt-4o)* |

### Step 4 — Deploy

Click **Deploy**. Vercel will build and deploy automatically. Every push to `main` will trigger a redeploy.

---

## Project Structure

```
livedataviz/
├── api/
│   └── vizchat.js          # Vercel serverless function (OpenAI proxy)
├── public/
│   └── datasets/
│       ├── cars.json
│       └── students.json
├── src/
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   ├── components/
│   │   ├── vizChat.jsx     # Chat UI with rendered charts
│   │   ├── welcomePrompt.jsx
│   │   ├── selectMenu.jsx
│   │   ├── spinner.jsx
│   │   ├── modal.jsx
│   │   ├── dropdownContext.jsx
│   │   ├── react-vega.jsx  # Vega-Lite renderer
│   │   ├── notify/         # Toast notifications
│   │   ├── monaco/         # Code editor
│   │   └── datasetCreation/ # CSV upload + data table
│   ├── services/
│   │   └── llm.js          # API call to /api/vizchat
│   └── utils/
│       ├── index.js        # Vega spec parsing helpers
│       └── inferType.js    # CSV field type inference
├── .env.example
├── .env (local only; gitignored)
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── (optional) vercel.json
```

## Changing the Model

Set `OPENAI_MODEL` in your `.env` or Vercel environment variables:

- `gpt-4o` (default, recommended)
- `gpt-4-turbo`
- `gpt-3.5-turbo` (faster, cheaper, less accurate)
