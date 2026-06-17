export type ExpenseCategory = 'shipping' | 'taxas' | 'operacional' | 'insumos' | 'outros'
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
  category?: string | null
  supplier?: string | null
  supplier_link?: string | null
  kit_quantity?: number | null
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
  order_number: string | null
  notes: string | null
  receipt_url: string | null
  created_at: string
}

export type SaleItem = {
  id: string
  sale_id: string
  product_id: string | null
  momentier_product_id: string | null
  product_name: string | null
  quantity: number
  unit_price: number
}

export type SaleWithItems = Sale & {
  sale_items: SaleItem[]
}

export type Expense = {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  expense_date: string
  supplier: string | null
  receipt_url: string | null
  created_at: string
}

export type ProductLineItem = {
  id: string
  name: string
  description: string | null
  cost_price: number
  sale_price: number
  stock_quantity: number
  low_stock_threshold: number
  image_url: string | null
  active: boolean
  created_at: string
}

export type ProductLine = 'papelaria' | 'personalizados' | 'cestas' | 'bbw'

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
      papelaria_products: {
        Row: ProductLineItem
        Insert: Omit<ProductLineItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLineItem, 'id' | 'created_at'>>
        Relationships: []
      }
      personalizados_products: {
        Row: ProductLineItem
        Insert: Omit<ProductLineItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLineItem, 'id' | 'created_at'>>
        Relationships: []
      }
      cestas_products: {
        Row: ProductLineItem
        Insert: Omit<ProductLineItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLineItem, 'id' | 'created_at'>>
        Relationships: []
      }
      bbw_products: {
        Row: ProductLineItem
        Insert: Omit<ProductLineItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLineItem, 'id' | 'created_at'>>
        Relationships: []
      }
      momentier_products: {
        Row: ProductLineItem
        Insert: Omit<ProductLineItem, 'id' | 'created_at'>
        Update: Partial<Omit<ProductLineItem, 'id' | 'created_at'>>
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
