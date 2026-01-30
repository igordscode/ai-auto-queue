# Architecture Notes

## Architecture Notes
The **AI Prompt Queue Master** follows a **Client-Server (Hybrid)** architecture, though the current stable version (v2.x) operates primarily as a standalone **Client-Side (Browser)** application. The system is designed to "parasitize" the host application (ChatGPT/Gemini) benignly, injecting its own control layer to manage inputs and outputs without modifying the host's core logic. The emerging v3.0 architecture adds a **Local Server** component to handle complex state, file system operations, and recursive agent logic that cannot run securely or efficiently in the browser sandbox.

## System Architecture Overview
The system is composed of two main nodes:
1.  **The Browser Node (Extension):** Acts as the "Hands and Eyes". It observes the DOM (Eyes) to detect when the AI has finished typing and injects text into the input field (Hands) to send the next prompt. It maintains the immediate "Queue State" in memory.
2.  **The Local Node (Server - v3.0):** Acts as the "Brain". It receives the output from the Browser Node, processes it (e.g., "Did the AI write the chapter correctly?"), and determines the *next* prompt to send back to the Browser Node.

**Data Flow:**
User -> Extension UI (Input) -> Queue Manager -> Host Page (ChatGPT) -> DOM Observer (Capture Response) -> Extension Logic -> (v3.0) Local Server -> Planner -> Extension Queue.

## Architectural Layers
- **Presentation Layer (Injected UI)**: The visible sidebar (`content.js` UI rendering functions, `styles.css`). Handles user interaction.
- **Automation Layer (DOM Interceptor)**: The logic that bridges our queue with the host's chat interface (`sendNextPrompt`, `monitorResponse`).
- **Logic Layer (Queue Manager)**: Manages the state of the playlist, auto-advance logic, and retry mechanisms.
- **Backend Layer (Local Server - v3.0)**: Python/Flask service for file I/O, LLM chaining, and agentic reasoning.

> See [`codebase-map.json`](./codebase-map.json) for complete symbol counts and dependency graphs.

## Detected Design Patterns

| Pattern | Confidence | Locations | Description |
|---------|------------|-----------|-------------|
| **Observer** | 100% | `content.js` (`MutationObserver`) | Watches the chat DOM for changes (generating/done). |
| **Queue** | 100% | `content.js` | Manages the FIFO list of prompts to be executed. |
| **Singleton** | 90% | `content.js` (`createInterface`) | Ensures only one instance of the UI exists per tab. |
| **Strategy** | 60% | `content.js` (Implicit) | Different strategies for handling ChatGPT vs Gemini selectors (planned refactor). |

## Entry Points
- **Extension Load**: [`content.js`](../content.js) (Executed immediately on page load via Manifest).
- **Server Start**: [`server.py`](../../QueueMasterPro/server.py) (Manual execution).

## Public API
*This application currently does not expose a public HTTP API for external consumers, but exposes internal endpoints between Extension and Server.*

| Symbol | Type | Location | Description |
|--------|------|----------|-------------|
| `/save` | POST | `server.py` | Saves the chat content to a local Markdown file. |
| `/health` | GET | `server.py` | Checks if the local server is running. |

## Internal System Boundaries
- **Browser Sandbox**: The Extension runs in the context of the web page. It cannot access the local file system directly (except via Downloads API) or run Python code.
- **Localhost Bridge**: The boundary between the Extension and the Python Server. Communication is strictly over HTTP (Fetch API) via `localhost:5000`.

## External Service Dependencies
- **Host Platforms**: ChatGPT (`chatgpt.com`), Gemini (`gemini.google.com`). The extension is tightly coupled to the DOM structure of these sites. Updates to their UI can break the "Eyes" (Observer) or "Hands" (Input) of the extension.

## Key Decisions & Trade-offs
- **DOM Injection vs. API**: We chose **DOM Injection** to allow users to use their *existing* accounts (Plus/Advanced) without paying for API credits. **Trade-off:** High fragility; if OpenAI changes a class name, the extension breaks until patched.
- **Local Python Server**: Required for v3.0 features (Agentic behavior, infinite storage). **Trade-off:** Increases installation complexity (requires Python installed).

## Top Directories Snapshot
- `root/` (Extension files: `content.js`, `manifest.json`, `styles.css`) ~5 files
- `docs/` (Documentation) ~5 files
- `QueueMasterPro/` (Server backend) ~3 files

## Related Resources
- [`project-overview.md`](./project-overview.md)
- [`development-workflow.md`](./development-workflow.md)