export interface Product {
    name: string
    description: string
    category: string | { name: string; description: string }
    subCategory?: string | { subCategoryName: string; subCategoryType: string }
    brand: string | { name: string; description: string }
    subBrand?: string | { name: string; description: string } | null
    stock: number
    images?: string[] | null
    RFQ: boolean
    HSN: string
    model: string
    productCode: string
    notes?: string[] | null
    variants?: string[] | null
    active: boolean
    price?: number
    created_at?: string
    updated_at?: string
  }
  
  