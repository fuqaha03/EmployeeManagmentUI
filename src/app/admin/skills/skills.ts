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
  displayedSkills: Skill[] = [];

  loading = false;
  saving = false;
  successMessage = '';
  errorMessage = '';

  // ----------------------
  // SEARCH & FILTERS
  // ----------------------
  searchText: string = '';
  filterStack: string = '';
  filterCategory: string = '';
  filterRating: number | null = null;
  viewMode: 'cards' | 'table' = 'cards';

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
  pageSize: number = 6; // Number of skills per page
  totalPages: number = 0;

  Math = Math; // Expose Math to template

  constructor(private skillsService: SkillsService, private authServices: AuthService) {}

  ngOnInit(): void {
    this.fetchSkills();
    this.isAdmin = this.authServices.isAdmin();
  }

  // -------------------------------------
  // STATISTICS
  // -------------------------------------
  get totalSkills(): number {
    return this.assignedSkills.length;
  }

  get averageRating(): number {
    if (this.assignedSkills.length === 0) return 0;
    const sum = this.assignedSkills.reduce((acc, s) => acc + (s.selfRating || 0), 0);
    return Math.round((sum / this.assignedSkills.length) * 10) / 10;
  }

  get totalExperience(): number {
    return this.assignedSkills.reduce((acc, s) => acc + (s.yearsOfExperience || 0), 0);
  }

  get skillsByStackCount(): { stack: string; count: number }[] {
    const counts: { [key: string]: number } = {};
    this.assignedSkills.forEach(s => {
      const stack = s.stack || 'Other';
      counts[stack] = (counts[stack] || 0) + 1;
    });
    return Object.entries(counts).map(([stack, count]) => ({ stack, count }));
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
        this.applyFilters();
        this.loading = false;
        this.showSuccessMessage('Skills loaded successfully!');
      },
      error: () => {
        this.loading = false;
        this.showErrorMessage('Failed to load skills. Please try again.');
      }
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
    if (!this.form || !this.isFormValid()) {
      this.showErrorMessage('Please fill in all required fields.');
      return;
    }

    this.saving = true;
    this.clearMessages();

    // Clamp selfRating between 1 and 5
    if (this.form.selfRating === undefined || this.form.selfRating < 1) this.form.selfRating = 1;
    else if (this.form.selfRating > 5) this.form.selfRating = 5;

    if (this.isEditMode) {
      this.skillsService.updateSkill(this.form).subscribe({
        next: () => {
          this.syncSkillsToBackend();
          this.showSuccessMessage('Skill updated successfully!');
          this.saving = false;
        },
        error: err => {
          console.error('Failed to update skill', err);
          this.showErrorMessage('Failed to update skill. Please try again.');
          this.saving = false;
        }
      });
    } else {
      this.skillsService.addSkill(this.form).subscribe({
        next: (res: any) => {
          this.form.id = res.id;
          this.syncSkillsToBackend();
          this.showSuccessMessage('Skill added successfully!');
          this.saving = false;
        },
        error: err => {
          console.error('Failed to add skill', err);
          this.showErrorMessage('Failed to add skill. Please try again.');
          this.saving = false;
        }
      });
    }

    this.closeForm();
  }

  // -------------------------------------
  // DELETE SKILL
  // -------------------------------------
  deleteSkill(skillId: number) {
    if (confirm('Are you sure you want to remove this skill?')) {
      this.skillsService.deleteSkill(skillId).subscribe({
        next: () => {
          this.syncSkillsToBackend();
          this.showSuccessMessage('Skill removed successfully!');
        },
        error: err => {
          console.error('Failed to delete skill', err);
          this.showErrorMessage('Failed to remove skill. Please try again.');
        }
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
  // SEARCH & FILTER METHODS
  // -------------------------------------
  applyFilters() {
    let filtered = [...this.assignedSkills];

    // Search filter
    if (this.searchText.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.category?.toLowerCase().includes(search) ||
        s.stack?.toLowerCase().includes(search) ||
        s.notes?.toLowerCase().includes(search)
      );
    }

    // Stack filter
    if (this.filterStack) {
      filtered = filtered.filter(s => s.stack === this.filterStack);
    }

    // Category filter
    if (this.filterCategory) {
      filtered = filtered.filter(s => s.category === this.filterCategory);
    }

    // Rating filter
    if (this.filterRating !== null) {
      filtered = filtered.filter(s => s.selfRating === this.filterRating);
    }

    this.filteredSkills = filtered;
    this.updateTotalPages();
    this.currentPage = 1;
    this.updateDisplayedSkills();
  }

  clearFilters() {
    this.searchText = '';
    this.filterStack = '';
    this.filterCategory = '';
    this.filterRating = null;
    this.applyFilters();
  }

  // -------------------------------------
  // PAGINATION METHODS
  // -------------------------------------
  updateDisplayedSkills() {
    const start = (this.currentPage - 1) * this.pageSize;
    this.displayedSkills = this.filteredSkills.slice(start, start + this.pageSize);
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.filteredSkills.length / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedSkills();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedSkills();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedSkills();
    }
  }

  // -------------------------------------
  // MESSAGE METHODS
  // -------------------------------------
  showSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.successMessage = '', 5000);
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.errorMessage = '', 5000);
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // -------------------------------------
  // UTILITY METHODS
  // -------------------------------------
  getRatingStars(rating: number | undefined): string {
    if (!rating) return '☆☆☆☆☆';
    const fullStars = '★'.repeat(Math.floor(rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(rating));
    return fullStars + emptyStars;
  }

  getRatingColor(rating: number | undefined): string {
    if (!rating) return '#9ca3af';
    if (rating >= 4) return '#10b981';
    if (rating >= 3) return '#f59e0b';
    return '#ef4444';
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return date;
    }
  }
}
