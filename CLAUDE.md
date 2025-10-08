# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js word tools application that scrapes dictionary data from Cambridge Dictionary and creates Excel files with word definitions, pronunciations, and audio files. The tool processes word lists and generates comprehensive vocabulary resources.

## Commands

### Running the Application
- **Mac**: `./run_mac.command` or `cd create && node app.js`
- **Windows**: `run_window.cmd` or `cd create && node app.js`

### Dependencies
- Navigate to `create/` directory: `cd create`
- Install dependencies: `npm install` (dependencies are already installed)
- Main entry point: `node app.js`

## Architecture

### Core Components

**Main Application (`create/app.js`)**
- Interactive CLI that prompts for word list file input
- Dual web scraper using the `crawler` library with two concurrent crawlers:
  - `c`: Scrapes English-Vietnamese translations from Cambridge Dictionary
  - `c1`: Scrapes English pronunciations from Cambridge Dictionary
- Data processing pipeline that merges translation and pronunciation data
- Excel export functionality using `excel4node`
- Audio download capability from Google Translate TTS (currently commented out)

**Test File (`create/test.js`)**
- Standalone utility for testing audio download functionality
- Contains downloadFile function used in main application

### Directory Structure

- `words/`: Input directory containing word list text files (e.g., `test.txt`)
- `fetching/`: Temporary processing directory for scraped data
  - `result.txt`: Vietnamese translations data
  - `resultE.txt`: English pronunciation data
  - `data.txt`: Merged final data
- `audio/`: Audio files organized by word list filename
- `result/`: Final Excel output files
- `create/`: Main application code and Node.js dependencies

### Data Flow

1. User provides word list file from `words/` directory
2. App reads words and queues Cambridge Dictionary URLs for both translation and pronunciation
3. Two crawlers run concurrently, extracting:
   - Word, part of speech, Vietnamese meaning (from English-Vietnamese dictionary)
   - Word pronunciation in IPA format (from English dictionary)
4. Data is merged, preserving input word order using `orderList` array
5. Results exported to Excel file in `result/` directory
6. Optional audio download creates MP3 files in `audio/` directory

### Key Features

- **Concurrent scraping**: Uses two crawler instances for efficiency
- **Data preservation**: Maintains original word order in final output using sorting
- **Error handling**: 10-second pause on download errors, continues processing
- **Progress tracking**: Console output shows scraping progress
- **Flexible input**: Accepts any text file with words separated by newlines

### Dependencies

Key packages used:
- `crawler`: Web scraping engine
- `axios`: HTTP client for downloads
- `excel4node`: Excel file generation
- `readline-sync`: Interactive CLI input
- `rimraf`: Directory cleanup

### Output Format

Excel files contain 6 columns:
1. Original word
2. Scraped word (normalized)
3. Part of speech
4. Vietnamese translation
5. Empty column
6. Pronunciation (IPA format)