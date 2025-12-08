import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../../core/services/skill';
import { Skill, SkillDto, CategorySkillDto } from '../../../core/models/skill.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OffCanvasComponent } from '../../../shared/components/off-canvas/off-canvas';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-skill-managment-crud',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    OffCanvasComponent,
    TextareaModule,
    SelectModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './skill-managment-crud.html',
  styleUrls: ['./skill-managment-crud.css'],
})
export class SkillManagmentCRUD implements OnInit {

  skills: Skill[] = [];
  filteredSkills: Skill[] = []; // <-- for search & pagination
  categories: CategorySkillDto[] = [];
  filteredCategories: CategorySkillDto[] = [];
  loading: boolean = false;
  saving: boolean = false;

  stacks: any[] = [];
  selectedStackId: number = 0;

  searchText: string = ''; // <-- search input

  isEditMode = false;
  editId: number | null = null;

  form: SkillDto = {
    categoryId: 0,
    name: '',
    description: '',
    isActive: true,
    createdOn: new Date()
  };

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 13;
  totalPages: number = 1;
  visible: boolean = false;

  constructor(
    private skillsService: SkillsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCategories();
    this.loadStacks();
  }

  loadSkills() {
    this.loading = true;
    this.skillsService.getAllSkills().subscribe({
      next: (res) => {
        this.skills = res;
        this.totalPages = Math.ceil(this.skills.length / this.pageSize);
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadCategories() {
    this.skillsService.getCatgorySkills().subscribe({
      next: (res) => {
        this.categories = res;
        this.filteredCategories = res;
      },
      error: () => {}
    });
  }

  loadStacks() {
    this.skillsService.getAllStacks().subscribe({
      next: (res) => {
        this.stacks = res;
      },
      error: () => {}
    });
  }

  onStackChange() {
    const stackIdNum = Number(this.selectedStackId); // convert to number
    if (stackIdNum === 0) {
      this.filteredCategories = this.categories;
    } else {
      this.filteredCategories = this.categories.filter(c => Number(c.stackId) === stackIdNum);
    }

    // Reset form category if it no longer exists
    if (!this.filteredCategories.some(c => c.id === this.form.categoryId)) {
      this.form.categoryId = 0;
    }
  }

  applyFilter() {
    let filtered = this.skills;

    if (this.searchText.trim()) {
      const text = this.searchText.toLowerCase();
      filtered = this.skills.filter(s =>
        s.name.toLowerCase().includes(text) ||
        (s.description && s.description.toLowerCase().includes(text))
      );
    }

    this.totalPages = Math.ceil(filtered.length / this.pageSize);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.filteredSkills = filtered.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilter();
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill in all required fields' });
      return;
    }

    this.saving = true;
    if (this.isEditMode && this.editId !== null) {
      this.skillsService.update(this.editId, this.form).subscribe({
        next: () => {
          this.loadSkills();
          this.resetForm();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Skill updated successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update skill' });
        }
      });
    } else {
      this.skillsService.add(this.form).subscribe({
        next: () => {
          this.loadSkills();
          this.resetForm();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Skill added successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add skill' });
        }
      });
    }
  }

  edit(skill: SkillDto) {
    this.isEditMode = true;
    this.editId = skill.id!;
    this.form = { ...skill };

    this.selectedStackId = this.categories.find(c => c.id === skill.categoryId)?.stackId ?? 0;
    this.onStackChange();
    this.visible = true;
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this skill?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.skillsService.delete(id).subscribe({
          next: () => {
            this.loadSkills();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Skill deleted successfully' });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete skill' });
          }
        });
      }
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.editId = null;
    this.selectedStackId = 0;
    this.filteredCategories = this.categories;

    this.form = {
      categoryId: 0,
      name: '',
      description: '',
      isActive: true,
      createdOn: new Date()
    };
  }

  openDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  isFormValid(): boolean {
    return this.form.categoryId !== 0 && this.form.name.trim() !== '';
  }

}
