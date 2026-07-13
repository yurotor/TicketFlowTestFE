# TicketFlowTestFE

React + TypeScript frontend for the Expense Tracker app. Talks to the
[TicketFlowTestBE](https://github.com/yurotor/TicketFlowTestBE) API.

## Prerequisites

- Node.js 20+
- The backend running at `http://localhost:5080` (see the backend repo's
  `docker compose up --build`). The dev server proxies `/api/*` to it.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
```

## Test

```bash
npm test           # vitest, single run
npm run test:watch
```

## Structure

```
src/
  api.ts                  # typed fetch client for /api/expenses
  types.ts                # Expense / ExpenseInput
  App.tsx                 # page: list, category filter, total, add form
  components/
    ExpenseForm.tsx       # create form
    ExpenseList.tsx       # table with inline edit + delete
  api.test.ts             # api client unit tests
  App.test.tsx            # component tests (api mocked)
```
