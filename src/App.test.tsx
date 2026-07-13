import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import type { Expense } from './types'
import * as api from './api'

vi.mock('./api')

const seed: Expense[] = [
  { id: 1, title: 'Team lunch', amount: 42.5, category: 'Food', date: '2026-07-01' },
  { id: 2, title: 'Groceries', amount: 88.2, category: 'food', date: '2026-07-03' },
  { id: 3, title: 'Monitor', amount: 219.99, category: 'Office', date: '2026-06-28' },
  { id: 4, title: 'Taxi', amount: 17.0, category: 'Travel', date: '2026-07-05' },
  { id: 5, title: 'Coffee beans', amount: 14.75, category: 'Food', date: '2026-07-10' },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(api.fetchExpenses).mockResolvedValue([...seed])
  vi.mocked(api.createExpense).mockResolvedValue({
    id: 6,
    title: 'Keyboard',
    amount: 55,
    category: 'Office',
    date: '2026-07-11',
  })
  vi.mocked(api.updateExpense).mockImplementation(async (id, input) => ({ id, ...input }))
  vi.mocked(api.deleteExpense).mockResolvedValue(undefined)
})

describe('App', () => {
  it('renders expenses loaded from the API', async () => {
    render(<App />)
    expect(await screen.findByText('Team lunch')).toBeInTheDocument()
    expect(screen.getByText('Monitor')).toBeInTheDocument()
    expect(screen.getAllByTestId(/expense-row-/)).toHaveLength(5)
  })

  it('shows the total of all expenses when no filter is active', async () => {
    render(<App />)
    await screen.findByText('Team lunch')
    expect(screen.getByTestId('total')).toHaveTextContent('Total: $382.44')
  })

  it('filters the visible list by category', async () => {
    render(<App />)
    await screen.findByText('Team lunch')
    await userEvent.selectOptions(screen.getByLabelText('Filter by category'), 'Office')
    const rows = screen.getAllByTestId(/expense-row-/)
    expect(rows).toHaveLength(1)
    expect(within(rows[0]).getByText('Monitor')).toBeInTheDocument()
  })

  it('creates an expense through the form and reloads the list', async () => {
    render(<App />)
    await screen.findByText('Team lunch')
    await userEvent.type(screen.getByLabelText('Title'), 'Keyboard')
    await userEvent.type(screen.getByLabelText('Amount'), '55')
    await userEvent.type(screen.getByLabelText('Category'), 'Office')
    await userEvent.type(screen.getByLabelText('Date'), '2026-07-11')
    await userEvent.click(screen.getByRole('button', { name: 'Add expense' }))
    expect(api.createExpense).toHaveBeenCalledWith({
      title: 'Keyboard',
      amount: 55,
      category: 'Office',
      date: '2026-07-11',
    })
    expect(api.fetchExpenses).toHaveBeenCalledTimes(2)
  })

  it('deletes an expense and reloads the list', async () => {
    render(<App />)
    await screen.findByText('Team lunch')
    const row = screen.getByTestId('expense-row-4')
    await userEvent.click(within(row).getByRole('button', { name: 'Delete' }))
    expect(api.deleteExpense).toHaveBeenCalledWith(4)
    expect(api.fetchExpenses).toHaveBeenCalledTimes(2)
  })

  it('updates an expense through inline editing', async () => {
    render(<App />)
    await screen.findByText('Team lunch')
    const row = screen.getByTestId('expense-row-1')
    await userEvent.click(within(row).getByRole('button', { name: 'Edit' }))
    const titleInput = screen.getByLabelText('Edit title')
    await userEvent.clear(titleInput)
    await userEvent.type(titleInput, 'Team dinner')
    await userEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(api.updateExpense).toHaveBeenCalledWith(1, {
      title: 'Team dinner',
      amount: 42.5,
      category: 'Food',
      date: '2026-07-01',
    })
  })
})
