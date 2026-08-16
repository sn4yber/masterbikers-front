export interface ExtractionJob {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'COMPLETED_WITH_ERRORS' | 'FAILED';
  total: number;
  processed: number;
  successful: number;
  failed: number;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface ExtractionItem {
  externalProductId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  errorMessage?: string;
}

export interface CreateExtractionRequest {
  productIds: number[];
}
