# Backend (Express + MongoDB)

## Setup
1. Install deps
   ```bash
   cd backend
   npm i
   ```
2. Start server
   ```bash
   npm run dev
   ```
3. Endpoints
   - `POST /api/records` (create)
   - `GET /api/records?search=&page=&limit=&sort=&order=` (list with pagination, search, sort)
   - `PUT /api/records/:id` (update)
   - `GET /api/meta/states` (state→district map)