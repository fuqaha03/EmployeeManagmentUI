import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeamDto } from '../models/team.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TeamService {
       private baseUrl = `${environment.apiBaseUrl}/api/Employee/Teams`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TeamDto[]> {
    return this.http.get<TeamDto[]>(`${this.baseUrl}/all`);
  }

  getEmployeeTeam(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee-teams`);
  }

  add(team: TeamDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, team);
  }
//
joinTeam(teamId: number): Observable<any> {
  return this.http.post(`${this.baseUrl}/join`, {teamId});
}

// Leave by team ID (number)
leaveTeam(teamId: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/leave/${teamId}`);
}
//
  update(id: number, team: TeamDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, team);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

    updateTeamMembers(teamId: number, employeeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}`, {teamId , employeeIds});
  }

    getTeamMembers(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/teams/${teamId}/members`);
  }
}
