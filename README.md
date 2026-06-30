# AI Flight Booking Agent

An AI-powered flight booking system built with modern technologies.

## Project Structure

```
AI-Flight-Booking-Agent/
├── frontend/          # Next.js frontend (Phase 1 - Complete)
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── store/
│   ├── types/
│   └── ...
│
└── backend/           # Backend API (Phase 2 - Coming Soon)
    └── ...
```

## Frontend (Phase 1)

A production-quality Next.js frontend with:

- **AI Chat Interface** – Natural language flight search
- **Flight Results** – 20+ mock flights with compare feature
- **Booking Flow** – Passenger details → Confirmation → QR code
- **Dashboard** – Stats, upcoming flights, quick routes
- **History** – Full booking history with search & pagination
- **Profile** – Saved travelers management
- **Settings** – Theme, notifications, privacy, connected sites
- **Dark / Light / System** theme support

### Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Animations | Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Theming | next-themes |

### Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Backend (Phase 2 – Coming Soon)

The backend will be built in the `backend/` folder and will include:

- REST API / GraphQL
- AI agent integration (OpenAI / LangChain)
- Real flight search via APIs (Amadeus, Skyscanner etc.)
- Authentication
- Database (PostgreSQL / MongoDB)
- Booking management

---

## License

MIT
