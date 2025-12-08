import { Component } from '@angular/core';
import { TeamService } from '../../../core/services/team';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-update-team-member',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './update-team-memeber.html',
  styleUrl: './update-team-memeber.css',
})
export class UpdateTeamMember {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  teamId!: number;
  searchTerm: string = '';

  constructor(private teamService: TeamService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.teamId = +this.route.snapshot.paramMap.get('teamId')!;
    this.loadEmployees();
  }

  loadEmployees() {
    this.teamService.getTeamMembers(this.teamId).subscribe(data => {
      this.employees = data;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term)
    );
  }

  saveChanges() {
    const selectedIds = this.employees
      .filter(emp => emp.isJoined)
      .map(emp => emp.id);

    this.teamService.updateTeamMembers(this.teamId, selectedIds).subscribe(() => {
      alert('Team members updated successfully!');
    });
  }

  onCheckboxChange(emp: any, event: any) {
    emp.isJoined = event.checked;
  }
}
