export type ExpenseCategory = 'shipping' | 'taxas' | 'operacional' | 'outros'
export type PaymentMethod = 'dinheiro' | 'pix' | 'cartão' | 'outro'

export type Product = {
  id: string
  name: string
  sku: string
  image_url: string | null
  stock_quantity: number
  cost_price: number
  sale_price: number
  low_stock_threshold: number
  active: boolean
  created_at: string
}

export type Purchase = {
  id: string
  supplier: string | null
  notes: string | null
  purchase_date: string
  receipt_url: string | null
  created_at: string
}

export type PurchaseItem = {
  id: string
  purchase_id: string
  product_id: string
  quantity: number
  unit_cost: number
}

export type PurchaseWithItems = Purchase & {
  purchase_items: (PurchaseItem & { products: Pick<Product, 'name' | 'sku'> })[]
}

export type Sale = {
  id: string
  sale_date: string
  payment_method: PaymentMethod
  notes: string | null
  receipt_url: string | null
  created_at: string
}

export type SaleItem = {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
}

export type SaleWithItems = Sale & {
  sale_items: (SaleItem & { products: Pick<Product, 'name' | 'sku'> })[]
}

export type Expense = {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  expense_date: string
  receipt_url: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
        Relationships: []
      }
      purchases: {
        Row: Purchase
        Insert: Omit<Purchase, 'id' | 'created_at'>
        Update: Partial<Omit<Purchase, 'id' | 'created_at'>>
        Relationships: []
      }
      purchase_items: {
        Row: PurchaseItem
        Insert: Omit<PurchaseItem, 'id'>
        Update: Partial<Omit<PurchaseItem, 'id'>>
        Relationships: []
      }
      sales: {
        Row: Sale
        Insert: Omit<Sale, 'id' | 'created_at'>
        Update: Partial<Omit<Sale, 'id' | 'created_at'>>
        Relationships: []
      }
      sale_items: {
        Row: SaleItem
        Insert: Omit<SaleItem, 'id'>
        Update: Partial<Omit<SaleItem, 'id'>>
        Relationships: []
      }
      expenses: {
        Row: Expense
        Insert: Omit<Expense, 'id' | 'created_at'>
        Update: Partial<Omit<Expense, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_stock: {
        Args: { p_product_id: string; p_qty: number }
        Returns: void
      }
      decrement_stock: {
        Args: { p_product_id: string; p_qty: number }
        Returns: void
      }
    }
  }
}
