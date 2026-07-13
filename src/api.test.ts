import { afterEach, describe, expect, it, vi } from 'vitest'
import { createExpense, deleteExpense, fetchExpenses, updateExpense } from './api'
import type { Expense } from './types'

const sampleExpense: Expense = {
  id: 1,
  title: 'Team lunch',
  amount: 42.5,
  category: 'Food',
  date: '2026-07-01',
}

function mockFetch(status: number, body?: unknown) {
  const res = {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response
  const spy = vi.fn(() => Promise.resolve(res))
  vi.stubGlobal('fetch', spy)
  return spy
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api client', () => {
  it('fetchExpenses calls GET /api/expenses', async () => {
    const spy = mockFetch(200, [sampleExpense])
    const result = await fetchExpenses()
    expect(spy).toHaveBeenCalledWith('/api/expenses')
    expect(result).toEqual([sampleExpense])
  })

  it('fetchExpenses appends the category query param', async () => {
    const spy = mockFetch(200, [])
    await fetchExpenses('Food')
    expect(spy).toHaveBeenCalledWith('/api/expenses?category=Food')
  })

  it('createExpense posts a JSON body', async () => {
    const spy = mockFetch(201, sampleExpense)
    const input = { title: 'Team lunch', amount: 42.5, category: 'Food', date: '2026-07-01' }
    const result = await createExpense(input)
    expect(spy).toHaveBeenCalledWith('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    expect(result).toEqual(sampleExpense)
  })

  it('updateExpense puts a JSON body to the id route', async () => {
    const spy = mockFetch(200, sampleExpense)
    const input = { title: 'Team lunch', amount: 42.5, category: 'Food', date: '2026-07-01' }
    await updateExpense(1, input)
    expect(spy).toHaveBeenCalledWith('/api/expenses/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
  })

  it('deleteExpense resolves on 204 with no body', async () => {
    const spy = mockFetch(204)
    await expect(deleteExpense(1)).resolves.toBeUndefined()
    expect(spy).toHaveBeenCalledWith('/api/expenses/1', { method: 'DELETE' })
  })

  it('throws on a non-2xx response', async () => {
    mockFetch(404)
    await expect(fetchExpenses()).rejects.toThrow('Request failed with status 404')
  })
})
