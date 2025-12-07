import { Component } from '@angular/core';
import { TeamService } from '../../../core/services/team';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for ngModel

@Component({
  selector: 'app-update-team-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-team-memeber.html',
  styleUrl: './update-team-memeber.css',
})
export class UpdateTeamMember {
  employees: any[] = [];
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
    });
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
    emp.isJoined = event.target.checked;
  }

  filteredEmployees() {
    if (!this.searchTerm) return this.employees;

    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term)
    );
  }
}
