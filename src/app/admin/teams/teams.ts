import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TeamDto } from '../../core/models/team.model';
import { TeamService } from '../../core/services/team';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OffCanvasComponent } from '../../shared/components/off-canvas/off-canvas';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-teams',
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    OffCanvasComponent,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './teams.html',
  styleUrls: ['./teams.css'],
  standalone: true
})
export class TeamsComponent implements OnInit {
  @ViewChild('footerTemplate') footerTemplate!: TemplateRef<any>;

  teams: TeamDto[] = [];
  filteredTeams: TeamDto[] = []; // For search
  currentEmployeeId: number | null = null;
  loading: boolean = false;
  saving: boolean = false;
  searchForm!: FormGroup;

  form: TeamDto = {
    name: '',
    isActive: true,
    createdOn: new Date()
  };

  isEditMode = false;
  editId: number | null = null;

  userRole: string | null  = '';

  joinedTeamIds: number[] = [];
  visible: boolean = false;

  constructor(
    private teamService: TeamService, 
    private authService: AuthService, 
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchText: ['']
    });
  }

  ngOnInit(): void {
    this.loadTeams();
    this.userRole = this.authService.getRole();
    
    // Subscribe to search form changes
    this.searchForm.get('searchText')?.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadTeams() {
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (res) => {
        this.teams = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load teams' });
      }
    });
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill in all required fields' });
      return;
    }

    this.saving = true;
    if (this.isEditMode && this.editId) {
      this.teamService.update(this.editId, this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadTeams();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team updated successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update team' });
        }
      });
    } else {
      this.teamService.add(this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadTeams();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team added successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add team' });
        }
      });
    }
  }

  edit(team: TeamDto) {
    this.isEditMode = true;
    this.editId = team.id!;
    this.form = { ...team };
    this.visible = true;
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this team?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.teamService.delete(id).subscribe({
          next: () => {
            this.loadTeams();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team deleted successfully' });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete team' });
          }
        });
      }
    });
  }

  openDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
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
    const searchText = this.searchForm.get('searchText')?.value || '';
    if (!searchText.trim()) {
      this.filteredTeams = this.teams;
      return;
    }
    const text = searchText.toLowerCase();
    this.filteredTeams = this.teams.filter(team =>
      team.name.toLowerCase().includes(text)
    );
  }

  // --- FORM VALIDATION ---
  isFormValid(): boolean {
    return this.form.name.trim() !== '';
  }
}
