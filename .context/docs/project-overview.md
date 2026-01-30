# Project Overview

## Project Overview
The **AI Prompt Queue Master** is a "Plug & Play" productivity extension for Chrome that turns standard AI chat interfaces (like ChatGPT and Gemini) into powerful automated production lines. It solves the problem of manual, repetitive prompting by allowing users to queue up multiple prompts, execute them sequentially without supervision, and automatically compile the results into a structured format. This tool is designed for content creators, researchers, and developers who need to run bulk tasks on generative AI platforms without constant manual intervention.

## Codebase Reference
> **Detailed Analysis**: For complete symbol counts, architecture layers, and dependency graphs, see [`codebase-map.json`](./codebase-map.json).

## Quick Facts
- **Root**: `C:\Users\TestP\Projetos\geminilabs\ai-auto-queue`
- **Languages**: JavaScript (frontend logic), CSS (styling), Python (experimental backend)
- **Entry**: `content.js` (Chrome Extension logic), `server.py` (Local Server)
- **Full analysis**: [`codebase-map.json`](./codebase-map.json)

## Entry Points
- [`content.js:165`](../content.js) - `createInterface` (Main UI initialization)
- [`server.py:44`](../../QueueMasterPro/server.py) - `health_check` (Server health endpoint)
- [`manifest.json`](../manifest.json) - Extension Configuration

## Key Exports
> See [`codebase-map.json`](./codebase-map.json) for the complete list of exported functions and modules.

## File Structure & Code Organization
- `docs/` — Documentation including PRDs, Roadmaps, and Context.
- `content.js` — Core extension logic: queue management, DOM manipulation, and automation state machine.
- `styles.css` — Visual styling for the injected interface.
- `manifest.json` — Chrome Extension definition file.
- `server.py` — (Experimental) Local Python Flask server for file system operations.

## Technology Stack Summary
The project is primarily built as a **Chrome Extension** using vanilla **JavaScript (ES6+)** for the frontend logic, interacting directly with the DOM of the host page (ChatGPT/Gemini). **CSS3** is used for styling the injected UI.

On the backend (experimental/v3.0 foundation), **Python 3** with **Flask** is used to create a local bridge for file system access and potentially heavy logic processing.

## Core Framework Stack
- **Frontend**: Vanilla JS (No heavy frameworks to ensure lightweight injection).
- **Backend**: Flask (Python) for the local server component.

## UI & Interaction Libraries
- **Custom CSS**: The UI is built with custom CSS variables for theming (Dark Mode default).
- **DOM API**: Heavy usage of native DOM APIs for observing chat changes (`MutationObserver`) and simulating user interactions.

## Development Tools Overview
- **Chrome Developer Mode**: Essential for loading the unpacked extension.
- **Python venv**: Recommended for running the `server.py` backend.
- **Git**: Version control.

## Getting Started Checklist
1. **Clone the repository.**
2. **Install Extension:** Open Chrome, go to `chrome://extensions`, enable "Developer mode", click "Load unpacked", and select the `ai-auto-queue` folder.
3. **(Optional) Start Server:** Navigate to `QueueMasterPro/` (if present) or root, create a virtual env, install requirements (Flask, flask-cors), and run `python server.py`.
4. **Run:** Open ChatGPT or Gemini. The Queue Master sidebar should appear automatically.
5. **Review:** Check `docs/development-workflow.md` for contribution guidelines.

## Next Steps
We are currently transitioning from **v2.2 (Stable Queue Automation)** to **v3.0 (Autonomous Agent)**.
- **Goal**: Transform the static queue into a dynamic, recursive agent capable of self-planning tasks (e.g., "Write a book" -> decomposes into chapters -> executes).
- **Stakeholders**: Power users, Authors, Devs.
- **Documentation**: See [`PRD-v3-Agent.md`](./PRD-v3-Agent.md) (In Progress) for the new agentic architecture.