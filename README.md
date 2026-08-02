# AI-Based Food Redistribution System

## Overview
This project is a full-stack prototype for reducing food waste by connecting surplus inventory with NGOs and donation channels.

## Features
- Business inventory tracking
- Donation and matching workflow
- NGO pickup scheduling
- Waste prediction and reporting

## Run the backend
```bash
python -m pip install -r backend/requirements.txt
python run_backend.py
```

The API will be available at http://localhost:8000

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

Environment
- To point the frontend at a different backend URL, set `REACT_APP_API_URL` before running the dev server.

Example (Linux/macOS):
```
REACT_APP_API_URL=http://localhost:8000 npm run dev
```
Windows (PowerShell):
```
$env:REACT_APP_API_URL = 'http://localhost:8000'
npm run dev
```

Initialize DB (optional)
```
python backend/init_db.py
```
This will create `backend.db` and insert sample inventory and donation rows for development.
