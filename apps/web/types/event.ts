export interface Event {
    name: string
    description: string
    type: "public" | "members"
    metadata?: Metadata
    location: string
    GeoAllow?: GeoAllow
    allowGuest: boolean
    allowLogin: boolean
    allowMemberLogin: boolean
    seatsAvailable: number
    totalregisteredSeats: number
    registrationFields?: RegistrationField[]
    eventStatus?: "Live" | "Draft" | "Staging" | "Prestaging" | "Closed"
    startingDate: string
    endingDate: string
    paymentType: "Free" | "Fixed Price" | "registration Payment"
    priceConfig?: PriceConfig
    registrationStartDate: string
    registrationEndDate: string
  }
  
  export interface Metadata {
    name: string
    description: string
    imageUrl?: string
  }
  
  export interface GeoAllow {
    location: string
    coordinates: [number, number] // Longitude and latitude
  }
  
  export interface RegistrationField {
    name: string
    displayName: string
    type: "text" | "boolean" | "number" | "option" | "checkBoxGroup" | "radioButtonGroup"
    options?: Option[]
    valueType: "dynamic" | "fixed" | "userInput"
    fixedValue?: any
    userValue?: any
    truthValue?: any
    falseValue?: any
    formula?: Formula[]
  }
  
  export interface Option {
    fieldName?: string
    parentName?: string
    labelName?: string
  }
  
  export interface Formula {
    type: "symbol" | "operation" | "customField" | "number"
    fieldName?: string
    operationName?: string
  }
  
  export interface PriceConfig {
    type: "fixed" | "dynamic"
    amount?: number
    dependantField?: string
  }
  
  