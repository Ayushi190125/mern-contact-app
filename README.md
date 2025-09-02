# MERN Tech Test — Step-by-Step Implementation

This repository contains a complete MERN implementation for the task:
- Add records (name, phone, email, address, state, district)
- Auto-show in a grid without page refresh
- Validations (phone: 10 digits -> `(123)-456-7890`, email contains `@` and `.`)
- Cascading State → District dropdowns
- Pagination (default 8), search across columns, sorting on any column
- Edit via pencil icon
- APIs to add, edit, list

## 1) Prerequisites
- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`)

## 2) Backend Setup
```bash
cd backend
npm i
npm run dev
```
- Server runs at `http://localhost:5000`
- Endpoints:
  - `POST /api/records` — create
  - `GET  /api/records?search=&page=&limit=&sort=&order=` — list
  - `PUT  /api/records/:id` — update
  - `GET  /api/meta/states` — state→district map

### Validation Rules
- Phone must be formatted `(123)-456-7890` (10 digits)
- Email must include `@` and `.`

## 3) Frontend Setup
```bash
cd frontend
npm i
npm run dev
```
- App runs at `http://localhost:5173`

### How it Works
- **Form**: `react-hook-form` + `yup` validation, auto-formats phone while typing.
- **Cascading select**: `/api/meta/states` feeds state→district options.
- **Grid**: server-side pagination, search, and sort. Page size selectable.
- **Edit**: click ✏️ to open modal, submit updates, list refreshes without reload.

## 4) Change Default Page Size
- In the UI's toolbar, change **Rows** dropdown (5, 8, 10, 20, 50).
- Default is 8.

## 5) Notes
- The backend enforces the phone and email formats. The frontend formats phone while typing.
- Sorting is whitelist-protected to avoid injection.
- Searching scans name, email, phone, address, state, and district.