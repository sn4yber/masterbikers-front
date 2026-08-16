export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'UNKNOWN';
  condition: 'NEW' | 'USED' | 'REFURBISHED' | 'UNKNOWN';
  brand: string | null;
  source: string | null;
  externalId: string | null;
  sourceUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  // Campo local para el Frontend (placeholder visual)
  localImage?: string; 
}

export interface PagedModel<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }
}
