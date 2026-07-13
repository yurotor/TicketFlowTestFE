export interface Expense {
  id: number
  title: string
  amount: number
  category: string
  date: string
}

export interface ExpenseInput {
  title: string
  amount: number
  category: string
  date: string
}
