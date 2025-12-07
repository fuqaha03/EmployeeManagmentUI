// employee.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EmployeeSkill } from '../models/employee.model';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = `${environment.apiBaseUrl}/api`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/employees`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/employees/${id}`);
  }
  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/employees/profile`);
  }
  getAllEmployeesWithSkills(): Observable<EmployeeSkill[]> {
    return this.http.get<EmployeeSkill[]>(`${this.baseUrl}/employee/Skills/employees/skills`);
  }

  create(employee: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/account/employee`, employee);
  }

  update(id: string, employee: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/update`, employee);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/delete`);
  }

  assignPosition(id: string, positionId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign/position`, { positionId });
  }

  assignSkills(id: string, skills: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign/skills`, skills);
  }

  assignTeams(id: string, teams: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign/teams`, teams);
  }

  assignProducts(id: string, products: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/assign/products`, products);
  }
  getEmployeeDetails(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/employees/${id}`);   
  } 

}
