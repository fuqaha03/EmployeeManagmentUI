import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkillsService } from '../../../core/services/skill';
import { Skill, SkillDto, CategorySkillDto } from '../../../core/models/skill.model';

@Component({
  selector: 'app-skill-managment-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skill-managment-crud.html',
  styleUrls: ['./skill-managment-crud.css'],
})
export class SkillManagmentCRUD implements OnInit {

  skills: Skill[] = [];
  filteredSkills: Skill[] = []; // <-- for search & pagination
  categories: CategorySkillDto[] = [];
  filteredCategories: CategorySkillDto[] = [];

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

  constructor(private skillsService: SkillsService) {}

  ngOnInit(): void {
    this.loadSkills();
    this.loadCategories();
    this.loadStacks();
  }

  loadSkills() {
    this.skillsService.getAllSkills().subscribe(res => {
      this.skills = res;
      this.totalPages = Math.ceil(this.skills.length / this.pageSize);
      this.applyFilter();
    });
  }

  loadCategories() {
    this.skillsService.getCatgorySkills().subscribe(res => {
      this.categories = res;
      this.filteredCategories = res;
    });
  }

  loadStacks() {
    this.skillsService.getAllStacks().subscribe(res => {
      this.stacks = res;
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
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.editId !== null) {
      this.skillsService.update(this.editId, this.form).subscribe(() => {
        this.loadSkills();
        this.resetForm();
      });
    } else {
      this.skillsService.add(this.form).subscribe(() => {
        this.loadSkills();
        this.resetForm();
      });
    }
  }

  edit(skill: SkillDto) {
    this.isEditMode = true;
    this.editId = skill.id!;
    this.form = { ...skill };

    this.selectedStackId = this.categories.find(c => c.id === skill.categoryId)?.stackId ?? 0;
    this.onStackChange();
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.skillsService.delete(id).subscribe(() => {
        this.loadSkills();
      });
    }
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

  isFormValid(): boolean {
    return this.form.categoryId !== 0 && this.form.name.trim() !== '';
  }

}
