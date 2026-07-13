import { useState } from 'react'
import type { ExpenseInput } from '../types'

interface Props {
  onSubmit: (input: ExpenseInput) => Promise<void>
}

const emptyForm = { title: '', amount: '', category: '', date: '' }

export function ExpenseForm({ onSubmit }: Props) {
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        date: form.date,
      })
      setForm(emptyForm)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} aria-label="Add expense">
      <input
        aria-label="Title"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <input
        aria-label="Amount"
        placeholder="Amount"
        type="number"
        step="0.01"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
        required
      />
      <input
        aria-label="Category"
        placeholder="Category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        required
      />
      <input
        aria-label="Date"
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
        required
      />
      <button type="submit" disabled={submitting}>
        Add expense
      </button>
    </form>
  )
}
