# Allstate My Help: Recovery Accelerator

**Tagline:** *Recovery Accelerator* **Goal:** Shift the paradigm from "filing a claim" to "accelerating recovery" by utilizing AI to minimize cognitive load during stressful life events.

## 🚀 Enterprise Architecture Overview

This project is built as a production-grade React application designed for seamless deployment within an enterprise infrastructure.

- **Frontend:** React (Vite) + Tailwind CSS
- **AI Integration:** Centralized API service (`aiService.js`) designed to route unstructured multimodal data (text/images) to an Enterprise LLM (e.g., OpenAI, Anthropic) to dynamically classify events and generate deterministic recovery plans.
- **Context Engine:** Leverages native browser APIs (Geolocation, User-Agent) to automatically append rich spatial and hardware telemetry to incidents, bypassing the need for manual user entry.
- **Data Persistence:** Node.js file-system backend with mutex-locked threaded save operations, structured behind an `IncidentRepository` abstraction ready for future RDBMS (PostgreSQL/SQL Server) integration.

## 🔧 AI Configuration

The application natively supports Enterprise LLM routing. 

1. Create a `.env` file in the root directory.
2. Add your API Key: `VITE_ENTERPRISE_AI_KEY=your_key_here`
3. If no key is detected, the application automatically falls back to an **In-Memory Heuristic Engine** to guarantee zero downtime during live demonstrations.

## 📁 Key File Structure

- `src/services/aiService.js`: The multimodal LLM routing logic.
- `src/services/incidentService.js`: The frontend-to-backend REST API connector.
- `src/data/events.js`: Deep-copy factory generating immutable state templates to ensure zero data-bleed between multiple incidents.
- `src/views/CommandCenter.jsx`: The core UI, featuring a dynamic progress algorithm and deterministic user-action queue.
- `server/repository/FileIncidentRepository.js`: Thread-safe backend storage abstraction.

## 🔄 The Recovery Workflow

1. **Intelligent Intake:** User inputs natural language or captures a photo. Geolocation and telemetry are captured instantly.
2. **AI Triage:** The LLM assesses severity and categorizes the event.
3. **Command Center Generation:** A fresh, tailored dashboard is spawned (`key`-forced unmount architecture ensures pure state).
4. **Action Queue:** The user is guided through one deterministic action at a time. The progress bar recalculates dynamically.
5. **Absolute Resolution:** The flow ends with a definitive handoff, confirming to the user that human operators and automated ledgers have taken control, achieving the goal of returning the user to "Normalcy."

## 💻 Local Run Instructions

**Start the Frontend:**
```bash
npm run dev