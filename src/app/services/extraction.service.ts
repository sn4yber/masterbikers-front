import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExtractionJob, ExtractionItem, CreateExtractionRequest } from '../models/extraction.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExtractionService {
  private http = inject(HttpClient);
  // Using localhost:8080 as defined in the context
  private apiUrl = `${environment.apiUrl}/api/v1/extractions`;

  createJob(request: CreateExtractionRequest): Observable<{ id: string; status: string }> {
    return this.http.post<{ id: string; status: string }>(this.apiUrl, request);
  }

  getJob(id: string): Observable<ExtractionJob> {
    return this.http.get<ExtractionJob>(`${this.apiUrl}/${id}`);
  }

  getJobItems(id: string): Observable<ExtractionItem[]> {
    return this.http.get<ExtractionItem[]>(`${this.apiUrl}/${id}/items`);
  }
}
