# AI Career Studio (Wellfound Edition) 🚀

A modern, high-aesthetic startup job platform and AI resume studio built for tech talent. Inspired by **[Wellfound](https://wellfound.com/)** (formerly AngelList Talent), featuring clean typography, generous whitespace, dark/light modes, and a production-ready API layer ready for full-stack backend integration.

---

## ⚡ Key Highlights & Wellfound Design Overhaul

- **Sleek Top Navigation**: Full-width layout with a clean navbar (replacing cramped sidebars and mock demo banners) giving your workspace maximum breathing room.
- **Wellfound Startup Aesthetic**: High-contrast dark buttons, signature coral highlights (`#FA4338`), subtle 1px neutral borders, and rounded pill tags.
- **Full-Stack Backend Integration Ready**: Built with a universal `apiClient` (`src/services/apiClient.ts`). Set `VITE_API_URL` in `.env` to hook up your Express/Node.js, FastAPI, Django, or NestJS backend seamlessly.
- **Client-Side Fallback**: Automatically falls back to local data if your backend server is offline, so frontend development never breaks.
- **AI Resume Intelligence**: ATS fit score gauge, section breakdown (Impact, Skills, Formatting, Experience), and missing skill gaps with 1-click addition.
- **Quick Apply Flow**: Clean candidate apply modal linking directly to your application tracking pipeline.
- **Kanban Pipeline Board**: Drag-and-drop recruitment pipeline (Saved, Applied, Interview, Offer, Rejected) powered by `@dnd-kit` with confetti celebrations.
- **Interactive Mock Interview**: AI interview coach with real-time response timer and STAR method scoring.

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Configure Backend Integration (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your backend API endpoint in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
*(Leave blank to use sample data during frontend testing)*

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🔌 Backend API Integration Endpoints

When connecting your backend server, implement the following standard REST endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/health` | `GET` | Health check (Navbar displays `Backend: Live` when active) |
| `/jobs` | `GET` | Fetch startup listings with filters (`?q=`, `?role=`, `?location=`, `?min_salary=`) |
| `/jobs/:id` | `GET` | Fetch detailed job description and requirements |
| `/resume/analyze` | `POST` | Dispatches resume text for LLM/ATS analysis and feedback scoring |
| `/applications` | `GET` | Retrieve candidate's pipeline applications |
| `/applications` | `POST` | Create a new tracked application / Quick Apply submission |
| `/applications/:id` | `PUT` | Update application stage, notes, or interview date |
| `/applications/:id` | `DELETE` | Remove application from pipeline |

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Wellfound neutral & coral design tokens
- **State Management**: Zustand with persistent storage
- **Icons**: Lucide React
- **Drag & Drop**: `@dnd-kit/core` & `@dnd-kit/sortable`
- **Animations & FX**: `canvas-confetti` & Tailwind keyframe transitions

