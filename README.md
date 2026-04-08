# 中文游戏 | Chinese Learning Games

An interactive web application for learning Chinese characters, vocabulary, grammar, and pronunciation through fun, gamified exercises. Built with Vue 3 and Vite.

## Games

The app includes **14 interactive activities** spanning vocabulary, characters, grammar, and listening:

| Game | Description |
|------|-------------|
| **Memory Game** (汉字配对翻牌) | Flip cards to match Chinese characters with their pinyin and meanings |
| **Radical Puzzle** (偏旁组字) | Drag and drop radicals to build complete Chinese characters |
| **Sentence Ordering** (句子排序) | Arrange jumbled words into grammatically correct sentences |
| **Listening Quiz** (听力挑战) | Listen to spoken Chinese and select the correct translation |
| **Idiom Fill** (成语填空) | Complete Chinese idioms by filling in missing characters |
| **Picture Quiz** (看图猜词) | Identify vocabulary words from visual descriptions |
| **Tone Master** (声调大师) | Select the correct tones for Chinese characters |
| **Pinyin Spelling** (拼音拼写) | Type pinyin with tone marks for given characters |
| **Antonym Match** (反义词配对) | Match words with their opposites |
| **Word Sorting** (分类游戏) | Categorize words into semantic groups |
| **Speed Challenge** (快速反应) | 60-second rapid-fire vocabulary quiz |
| **Word List** (单词列表) | Browse vocabulary organized by HSK level |
| **My Words** (我的词库) | Build and review a personal vocabulary list |
| **Stats Dashboard** (学习统计) | Track progress with charts, streaks, and daily goals |

All games support **HSK levels 1–9**, a beginner level, and a custom "My Words" level built from your personal vocabulary.

## Tech Stack

- **[Vue 3](https://vuejs.org/)** — Composition API
- **[Vite](https://vitejs.dev/)** — Dev server and build tool
- **[Vue Router](https://router.vuejs.org/)** — Client-side routing with lazy-loaded views
- **[pinyin-pro](https://github.com/zh-lx/pinyin-pro)** — Pinyin and tone conversion utilities
- **Web Speech API** — Text-to-speech for listening and pronunciation exercises

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) by default.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Game components organized by game type
│   ├── memory/        # Memory card game
│   ├── radical/       # Radical drag-drop puzzle
│   ├── sentence/      # Sentence ordering
│   ├── listening/     # Audio listening quiz
│   ├── idiom/         # Idiom fill-in
│   ├── picture/       # Picture word quiz
│   ├── tone/          # Tone selection
│   ├── pinyin/        # Pinyin typing
│   ├── antonym/       # Antonym matching
│   ├── sorting/       # Word categorization
│   ├── speed/         # Speed challenge
│   ├── layout/        # App header
│   └── shared/        # Reusable UI (GameToolbar, GameOverModal, etc.)
├── views/             # Page-level route components
├── composables/       # Shared logic (useGameState, useScore, useTimer, useI18n, etc.)
├── data/              # Vocabulary, idioms, radicals, sentences, and other game data
├── assets/styles/     # Global CSS and animations
├── router/            # Vue Router configuration
├── App.vue            # Root component
└── main.js            # App entry point
```

## Features

- **Infinite mode** — Games cycle through rounds until the word pool is exhausted
- **Progress tracking** — Daily activity, weekly charts, monthly calendar, streaks
- **Personal vocabulary** — Save words from the word list and practice them across games
- **Shareable stats** — Generate an image card of your daily achievements
- **Internationalization** — UI available in English and Russian (auto-detected from browser)
- **Responsive design** — Works on desktop and mobile
- **Brightness control** — Adjustable screen brightness slider

## Data & Content

Vocabulary and exercises are organized by HSK level and stored as plain JavaScript modules in `src/data/`. Each vocabulary entry includes the character, pinyin, and translations in English and Russian:

```js
{
  id: 'b_01',
  character: '一',
  pinyin: 'yī',
  english: 'one',
  russian: 'один'
}
```

All user data (stats, custom vocabulary, preferences) is persisted in **localStorage** — no backend required.

## License

This project is provided as-is for educational purposes.
