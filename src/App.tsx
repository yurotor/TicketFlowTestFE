import { useCallback, useEffect, useMemo, useState } from 'react'
import { createExpense, deleteExpense, fetchExpenses, updateExpense } from './api'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import type { Expense, ExpenseInput } from './types'
import './App.css'

const ALL_CATEGORIES = 'All'

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [category, setCategory] = useState(ALL_CATEGORIES)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      setExpenses(await fetchExpenses())
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const categories = useMemo(() => {
    const unique = new Set(expenses.map((e) => e.category))
    return [ALL_CATEGORIES, ...Array.from(unique).sort()]
  }, [expenses])

  const visibleExpenses = useMemo(
    () =>
      category === ALL_CATEGORIES
        ? expenses
        : expenses.filter((e) => e.category === category),
    [expenses, category],
  )

  const total = useMemo(
    () => expenses.reduce((sum, e) => sum + e.amount, 0),
    [expenses],
  )

  async function handleCreate(input: ExpenseInput) {
    await createExpense(input)
    await load()
  }

  async function handleUpdate(id: number, input: ExpenseInput) {
    await updateExpense(id, input)
    await load()
  }

  async function handleDelete(id: number) {
    await deleteExpense(id)
    await load()
  }

  return (
    <main className="app">
      <h1>Expense Tracker</h1>

      <ExpenseForm onSubmit={handleCreate} />

      <div className="toolbar">
        <label>
          Category:{' '}
          <select
            aria-label="Filter by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <span className="total" data-testid="total">
          Total: ${total.toFixed(2)}
        </span>
      </div>

      {error && <p role="alert">{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <ExpenseList
          expenses={visibleExpenses}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </main>
  )
}
