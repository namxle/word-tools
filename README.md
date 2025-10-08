# Word Tools

A Node.js application that scrapes dictionary data from Cambridge Dictionary and creates Excel files with word definitions, pronunciations, and audio files.

## Features

- Scrapes English-Vietnamese translations from Cambridge Dictionary
- Extracts pronunciation data in IPA format
- Generates Excel files with organized vocabulary data
- Downloads audio files from Google Translate TTS
- Maintains original word order in output

## Instructions

### Step 1: Prepare Word List

Place your word list file in `txt` format into the `words` folder. Each word should be on a separate line.

Example file: `words/test.txt`
```
throw
paper
darling
```

### Step 2: Run the Application

- **For macOS**: Double-click `run_mac.command` or run `./run_mac.command` in terminal
- **For Windows**: Double-click `run_window.cmd` or run `run_window.cmd` in command prompt

Alternatively, you can run directly:
```bash
cd create
node app.js
```

### Step 3: Input File Name

When prompted, enter the filename you placed in the `words` folder.

Example:
```
Input name of the file (example: words.txt)
Input: test.txt
```

### Step 4: Output

The application will generate:
- Excel file in the `result/` folder with translations and pronunciations
- Audio files in the `audio/` folder (if enabled)
- Temporary data files in the `fetching/` folder

## Requirements

- Node.js
- Internet connection (for scraping Cambridge Dictionary)

## Output Format

The Excel file contains 6 columns:
1. Original word
2. Scraped word (normalized)
3. Part of speech
4. Vietnamese translation
5. Empty column
6. Pronunciation (IPA format)
