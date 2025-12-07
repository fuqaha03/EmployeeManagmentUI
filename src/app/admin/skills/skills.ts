import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SkillsService } from '../../core/services/skill';
import { Skill } from '../../core/models/skill.model';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-skills-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.html',
  styleUrls: ['./skills.css']
})
export class SkillsManagementComponent implements OnInit {

  // ----------------------
  // DATA COLLECTIONS
  // ----------------------
  stacks: string[] = [];
  categoriesByStack: string[] = [];
  skillsByCategory: Skill[] = [];

  selectedStack = '';
  selectedCategory = '';

  isAdmin: boolean = false;
  allSkills: Skill[] = [];
  assignedSkills: Skill[] = [];
  filteredSkills: Skill[] = [];

  loading = false;

  // ----------------------
  // FORM SETTINGS
  // ----------------------
  showForm = false;
  isEditMode = false;
  form: Skill = this.resetForm();

  // ----------------------
  // PAGINATION SETTINGS
  // ----------------------
  currentPage: number = 1;
  pageSize: number = 5; // Number of skills per page
  totalPages: number = 0;

  constructor(private skillsService: SkillsService, private authServices: AuthService) {}

  ngOnInit(): void {
    this.fetchSkills();
    this.isAdmin = this.authServices.isAdmin();
  }

  // -------------------------------------
  // RESET FORM
  // -------------------------------------
  resetForm(): Skill {
    return {
      id: 0,
      name: '',
      stack: '',
      category: '',
      isAssigned: true,
      lastUsed: '',
      yearsOfExperience: 0,
      selfRating: 0,
      notes: '',
      categoryId: 0,
      description: '',
      isActive: true,
      createdOn: new Date()
    };
  }

  // -------------------------------------
  // FETCH DATA
  // -------------------------------------
  fetchSkills() {
    this.loading = true;

    // EMPLOYEE SKILLS
    this.skillsService.getEmployeeSkills().subscribe({
      next: (data: Skill[]) => {
        this.allSkills = data;
        this.assignedSkills = data.filter(s => s.isAssigned);
        this.updateTotalPages();
        this.currentPage = 1;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });

    // ALL STACKS
    this.skillsService.getAllStacks().subscribe({
      next: (data: any[]) => {
        this.stacks = data.map(stack => stack.name);
      },
      error: err => console.error('Failed to fetch stacks', err)
    });
  }

  // -------------------------------------
  // STACK SELECTION
  // -------------------------------------
  onStackChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    this.selectedStack = select?.value || '';

    this.categoriesByStack = Array.from(
      new Set(
        this.allSkills
          .filter(s => s.stack === this.selectedStack)
          .map(s => s.category)
      )
    );

    this.selectedCategory = '';
    this.skillsByCategory = [];
    this.filteredSkills = [];
    this.form = this.resetForm();
  }

  // -------------------------------------
  // CATEGORY SELECTION
  // -------------------------------------
  onCategoryChange(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    this.selectedCategory = select?.value || '';

    this.skillsByCategory = this.allSkills
      .filter(s => s.stack === this.selectedStack && s.category === this.selectedCategory)
      .filter(s => !this.assignedSkills.some(a => a.id === s.id));

    this.filteredSkills = this.skillsByCategory;
    this.form = this.resetForm();
  }

  // -------------------------------------
  // SKILL SELECTED
  // -------------------------------------
  onSkillSelect(event: Event) {
    const select = event.target as HTMLSelectElement | null;
    const selectedSkill = this.filteredSkills.find(s => s.name === select?.value);

    if (selectedSkill) {
      this.form = { ...selectedSkill };
    }
  }

  // -------------------------------------
  // FORM VALIDATION
  // -------------------------------------
  isFormValid(): boolean {
    return (
      this.form.stack !== '' &&
      this.form.category !== '' &&
      this.form.name !== '' &&
      this.form.selfRating !== null &&
      this.form.yearsOfExperience !== null
    );
  }

  // -------------------------------------
  // ADD / EDIT FORM
  // -------------------------------------
  openAddForm() {
    this.showForm = true;
    this.isEditMode = false;
    this.form = this.resetForm();
  }

  openEditForm(skill: Skill) {
    this.showForm = true;
    this.isEditMode = true;
    this.form = { ...skill };
    this.selectedStack = skill.stack || '';
    this.selectedCategory = skill.category || '';
  }

  closeForm() {
    this.showForm = false;
  }

  // -------------------------------------
  // SAVE FORM (ADD OR UPDATE)
  // -------------------------------------
  saveForm() {
    if (!this.form) return;

    // Clamp selfRating between 1 and 5
    if (this.form.selfRating === undefined || this.form.selfRating < 1) this.form.selfRating = 1;
    else if (this.form.selfRating > 5) this.form.selfRating = 5;

    if (this.isEditMode) {
      this.skillsService.updateSkill(this.form).subscribe({
        next: () => this.syncSkillsToBackend(),
        error: err => console.error('Failed to update skill', err)
      });
    } else {
      this.skillsService.addSkill(this.form).subscribe({
        next: (res: any) => {
          this.form.id = res.id;
          this.syncSkillsToBackend();
        },
        error: err => console.error('Failed to add skill', err)
      });
    }

    this.closeForm();
  }

  // -------------------------------------
  // DELETE SKILL
  // -------------------------------------
  deleteSkill(skillId: number) {
    if (confirm('Delete this skill?')) {
      this.skillsService.deleteSkill(skillId).subscribe({
        next: () => this.syncSkillsToBackend(),
        error: err => console.error('Failed to delete skill', err)
      });
    }
  }

  // -------------------------------------
  // SYNC SKILLS TO BACKEND
  // -------------------------------------
  syncSkillsToBackend() {
    this.skillsService.getEmployeeSkills().subscribe({
      next: () => this.fetchSkills(),
      error: err => console.error('Failed to assign skills', err)
    });
  }

  // -------------------------------------
  // SELF RATING VALIDATION
  // -------------------------------------
  validateSelfRating() {
    if (this.form?.selfRating !== undefined) {
      if (this.form.selfRating > 5) this.form.selfRating = 5;
      else if (this.form.selfRating < 1) this.form.selfRating = 1;
    }
  }

  // -------------------------------------
  // PAGINATION METHODS
  // -------------------------------------
  get paginatedSkills(): Skill[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.assignedSkills.slice(start, start + this.pageSize);
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.assignedSkills.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }
}
