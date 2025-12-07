import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategorySkillDto, Skill, SkillDto } from '../models/skill.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  // Use the correct string property from environment
  private baseUrl = `${environment.apiBaseUrl}/api`; 

  constructor(private http: HttpClient) {}

  getAllSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/employee/Skills`);
  }
  getAllStacks(): Observable<any[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/employee/Skills/stacks`);
  }

  getCatgorySkills(): Observable<CategorySkillDto[]> {
    return this.http.get<CategorySkillDto[]>(`${this.baseUrl}/employee/Skills/catgeory`);
  }

  getEmployeeSkills(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${this.baseUrl}/employee/Skills/all`);
  }

  updateEmployeeSkills(skillIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/Skills/assign`, { skillIds });
  }

  add(skill: SkillDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/employee/Skills/add`, skill);
  }

  update(id: number, skill: SkillDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/employee/Skills/update/${id}`, skill);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/employee/Skills/delete/${id}`);
  }

  addSkill(skill: Skill) {
  return this.http.post(`${this.baseUrl}/employee/Skills/assign`, skill);
}

updateSkill(skill: Skill) {
  return this.http.put(`${this.baseUrl}/employee/Skills/assign/update`, skill);
}

deleteSkill(id: number) {
  return this.http.delete(`${this.baseUrl}/employee/Skills/unassign/${id}`);
}



}

