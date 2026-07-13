import type { Expense, ExpenseInput } from './types'

const BASE_URL = '/api/expenses'

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return res.json() as Promise<T>
}

export async function fetchExpenses(category?: string): Promise<Expense[]> {
  const url = category ? `${BASE_URL}?category=${encodeURIComponent(category)}` : BASE_URL
  const res = await fetch(url)
  return handleResponse<Expense[]>(res)
}

export async function fetchExpense(id: number): Promise<Expense> {
  const res = await fetch(`${BASE_URL}/${id}`)
  return handleResponse<Expense>(res)
}

export async function createExpense(input: ExpenseInput): Promise<Expense> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return handleResponse<Expense>(res)
}

export async function updateExpense(id: number, input: ExpenseInput): Promise<Expense> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return handleResponse<Expense>(res)
}

export async function deleteExpense(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  return handleResponse<void>(res)
}
