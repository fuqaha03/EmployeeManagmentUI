import { Component } from '@angular/core';
import { TeamService } from '../../../core/services/team';
import { TeamEmployee } from '../../../core/models/employee.model';
import { CommonModule } from '@angular/common';

interface TeamDto {
  id: number;
  name: string;
  teamEmployees: TeamEmployee[];
  isJoined: boolean;
}

@Component({
  selector: 'app-employee-team-managment',
  imports: [CommonModule],
  templateUrl: './employee-team-managment.html',
  styleUrl: './employee-team-managment.css',
})
export class EmployeeTeamManagment {

 
  constructor(private teamService : TeamService) {}
teams: TeamDto[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams() {
    this.teamService.getEmployeeTeam().subscribe({
      next: (data) => {
        this.teams = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading teams:', err);
        this.loading = false;
      }
    });
  }

  leaveTeam(teamId: number) {
  this.teamService.leaveTeam(teamId).subscribe({
    next: () => this.loadTeams(),
    error: (err) => console.error('Error leaving team:', err)
  });
}

  joinTeam(teamId: number) {
    console.log("Join team clicked", {teamId});
    // TODO: call join-team API
    this.teamService.joinTeam(teamId).subscribe({
      next: () => {
        this.loadTeams(); 
      },
      error: (err) => {
        console.error('Error joining team:', err);
      }
    });
  }
}
