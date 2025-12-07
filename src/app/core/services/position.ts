import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PositionDto } from '../models/position.model';
@Injectable({
  providedIn: 'root',
})
export class Position {
  private baseUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Positions/all`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  create(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/employee`, employee);
  }

  addPosition(position: PositionDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/Positions/add`, position);
  }

  updatePosition(id: number, position: PositionDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/Positions/update/${id}`, position);
  }

  deletePosition(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Positions/delete/${id}`);
  }
}
