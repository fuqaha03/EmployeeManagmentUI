import { Component, OnInit } from '@angular/core';
import { TeamDto } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teams',
  imports: [CommonModule, FormsModule],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
  standalone: true
})
export class TeamsComponent implements OnInit {
  teams: TeamDto[] = [];
  filteredTeams: TeamDto[] = []; // For search
  currentEmployeeId: number | null = null;

  form: TeamDto = {
    name: '',
    isActive: true,
    createdOn: new Date()
  };

  isEditMode = false;
  editId: number | null = null;

  userRole: string | null  = '';
  searchText: string = ''; // search input

  joinedTeamIds: number[] = [];

  constructor(
    private teamService: TeamService, 
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeams();
    this.userRole = this.authService.getRole();
  }

  loadTeams() {
    this.teamService.getAll().subscribe(res => {
      this.teams = res;
      this.applyFilter();
    });
  }

  submitForm() {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.editId) {
      this.teamService.update(this.editId, this.form).subscribe(() => {
        this.resetForm();
        this.loadTeams();
      });
    } else {
      this.teamService.add(this.form).subscribe(() => {
        this.resetForm();
        this.loadTeams();
      });
    }
  }

  edit(team: TeamDto) {
    this.isEditMode = true;
    this.editId = team.id!;
    this.form = { ...team };
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this team?")) return;
    this.teamService.delete(id).subscribe(() => {
      this.loadTeams();
    });
  }

  getMemebers(teamId: number) {
    this.router.navigate([`teams/${teamId}/members`]);
  }

  resetForm() {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      name: '',
      isActive: true,
      createdOn: new Date()
    };
  }

  // --- SEARCH FILTER ---
  applyFilter() {
    if (!this.searchText.trim()) {
      this.filteredTeams = this.teams;
      return;
    }
    const text = this.searchText.toLowerCase();
    this.filteredTeams = this.teams.filter(team =>
      team.name.toLowerCase().includes(text)
    );
  }

  // --- FORM VALIDATION ---
  isFormValid(): boolean {
    return this.form.name.trim() !== '';
  }
}
