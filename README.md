# 🤖 AI Support Bot (Free Edition)

A premium Discord Support Bot designed for **Reboot GS**, capable of handling text queries and analyzing screenshots locally using OCR—completely for free.

## ✨ Features

- **🆓 100% Free**: Uses local OCR (`Tesseract.js`) instead of paid AI APIs.
- **📸 Image Analysis**: Automatically reads text from screenshots (like game crashes or login screens) and suggests fixes.
- **⚡ Smart Auto-Responses**: Robust keyword matching that handles typos, leetspeak, and common phrasing.
- **💎 Premium Console UI**: Beautiful terminal dashboard with gradients, tables, and real-time event logging.
- **🛡️ Instance Protection**: Prevents multiple copies from running at once to save resources.
- **🔄 Auto-Restart**: Fast restart logic built into the console and launcher.

## 🚀 Getting Started

### 1. Requirements

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- A Discord Bot Token (Get it from [Discord Developer Portal](https://discord.com/developers/applications))

### 2. Setup

1. Clone or download this repository.
2. Open the folder and run `start.bat`.
3. The bot will automatically create a `.env` file and install all necessary dependencies.
4. Open the `.env` file and paste your Discord Bot Token:
   ```env
   DISCORD_TOKEN=your_token_here
   SUPPORT_CHANNEL_ID=your_channel_id
   ```

### 3. Usage

- Simply run `start.bat` to launch the bot.
- **Press R**: To restart the bot.
- **Press Q**: To safely exit.

## 🛠️ Configuration

You can add more support rules in `Response.js`. The bot handles:

- **Skins not showing** (No MCP fix)
- **Game Crashes** (Reinstall build fix)
- **Login Screen issues** (Real-time protection fix)
- **Controller Support** (Tutorial fix)

## 📜 Credits

Made with ❤️ by Benzi
