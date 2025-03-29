export interface Product {
    name: string
    description: string
    category: string
    subCategory?: string
    brand: string
    subBrand?: string | null
    stock: number
    images?: Image[] | null
    RFQ: boolean
    HSN: string
    model: string
    productCode: string
    notes?: Note[] | null
    variants?: string[] | null
    active: boolean
  }
  
  export interface Image {
    url: string
    altText?: string | null
  }
  
  export interface Note {
    name: string
    description: string
  }
  
  