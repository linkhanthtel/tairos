<div align="center">
  <img src="/client/public/logo.png" alt="LifeTrack Logo" width="150"/>

  # Tairos

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  Streamline your life with our all-in-one task management and financial tracking app!

  [View Demo](https://tairos-two.vercel.app/) • [Report Bug](https://github.com/linkhanthtel/tairos) • [Request Feature](https://github.com/linkhanthtel/tairos/issues)

</div>

## About The Project

Tairos is a powerful and intuitive application designed to help you organize your daily tasks and manage your finances effortlessly. With separate tabs for to-do lists and expense tracking, Tairos provides a comprehensive solution for personal productivity and financial management. [Backend features and databases are implementing in process] [AI features will soon be integrated]

### Features

- 📋 To-Do List
  - Create, edit, and delete tasks
  - Categorize tasks with custom labels
  - Mark tasks as complete

- Expense Tracker
  - Track income and expenses
  - Categorize transactions
  - View spending trends and reports

- General Features (In Process...)
  - Interactive Note Taking
  - Secure user authentication
  - Responsive design for all devices
  - Data visualization with charts

## Backend (FastAPI)

Typical setup: use **`server/`** as the working directory for Python (see below). Use **Python 3.11+** (see `server/README.md`; 3.14 is supported with current dependency pins).

```sh
cd server
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**`No module named 'app'`** means the command was not run with `server/` as the working directory. Stay in `server/` after `cd server`, or from the repo root run:  
`uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --app-dir server`.

The Vite dev server proxies `/api` to `http://127.0.0.1:8000` (see `client/vite.config.js`). With both running, the expense tracker, task board, and calendar persist to SQLite (`server/tairos.db`).

For production, set `VITE_API_URL` to your API origin if the client is not served from the same host.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Frontend (dev)

```sh
cd client
npm install
npm run dev
```

Run the **FastAPI** server as above so `/api` routes work.

### Prerequisites

- Node.js (v14.0.0 or later)
- npm

### Clone and install

```sh
git clone https://github.com/linkhanthtel/tairos
cd tairos/client
npm install
npm run dev
```

Start the API from `server/` (see **Backend** above) in another terminal.
