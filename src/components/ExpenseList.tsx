import { useState } from 'react'
import type { Expense, ExpenseInput } from '../types'

interface Props {
  expenses: Expense[]
  onUpdate: (id: number, input: ExpenseInput) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ExpenseList({ expenses, onUpdate, onDelete }: Props) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState({ title: '', amount: '', category: '', date: '' })

  function startEdit(expense: Expense) {
    setEditingId(expense.id)
    setDraft({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      date: expense.date,
    })
  }

  async function saveEdit(id: number) {
    await onUpdate(id, {
      title: draft.title,
      amount: Number(draft.amount),
      category: draft.category,
      date: draft.date,
    })
    setEditingId(null)
  }

  if (expenses.length === 0) {
    return <p className="empty">No expenses yet.</p>
  }

  return (
    <table className="expense-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) =>
          editingId === expense.id ? (
            <tr key={expense.id} data-testid={`expense-row-${expense.id}`}>
              <td>
                <input
                  aria-label="Edit title"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                />
              </td>
              <td>
                <input
                  aria-label="Edit amount"
                  type="number"
                  step="0.01"
                  value={draft.amount}
                  onChange={(e) => setDraft({ ...draft, amount: e.target.value })}
                />
              </td>
              <td>
                <input
                  aria-label="Edit category"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                />
              </td>
              <td>
                <input
                  aria-label="Edit date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </td>
              <td>
                <button onClick={() => saveEdit(expense.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </td>
            </tr>
          ) : (
            <tr key={expense.id} data-testid={`expense-row-${expense.id}`}>
              <td>{expense.title}</td>
              <td>${expense.amount.toFixed(2)}</td>
              <td>{expense.category}</td>
              <td>{expense.date}</td>
              <td>
                <button onClick={() => startEdit(expense)}>Edit</button>
                <button onClick={() => onDelete(expense.id)}>Delete</button>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  )
}
