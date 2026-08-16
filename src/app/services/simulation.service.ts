import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SimulationRequest, SimulationResponse } from '../models/simulation.model';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  runSimulation(request: SimulationRequest): Observable<SimulationResponse> {
    return this.http.post<SimulationResponse>(`${this.apiUrl}/api/simulations/run`, request);
  }
}
