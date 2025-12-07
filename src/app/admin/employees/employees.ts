// src/app/admin/employees/employees.component.ts
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../core/services/employee';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SkillsService } from '../../core/services/skill';
import { Position } from '../../core/services/position';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.html',
  styleUrls: ['./employees.css'],
  imports: [CommonModule, FormsModule],
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];

  // Filters
  stacks: any[] = [];
  categories: any[] = [];
  skills: any[] = [];

  allCategories: any[] = [];
  allSkills: any[] = [];

  filteredCategories: any[] = [];
  filteredSkills: any[] = [];

  teamNames: string[] = [];
productNames: string[] = [];

selectedTeam: string = '';
selectedProduct: string = '';

  selectedStackId: number | null = null;
  selectedCategoryId: number | null = null;
  selectedSkillId: number | null = null;

  positions: any[] = [];
  selectedPosition: string = '';
  selectedLastUsedDate: string = '';
  searchText: string = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private skillService: SkillsService,
    private positionService: Position
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadStacks();
    this.loadCategories();
    this.loadSkills();
    this.loadPositions();
  }

  // ===== Load Data =====
loadEmployees() {
  this.employeeService.getAll().subscribe({
    next: (data) => {
      this.employees = data;
      this.filteredEmployees = data;
this.teamNames = [
  ...new Set<string>(
    data.flatMap((emp: any) =>
      emp.teamEmployees?.map((t: any) => String(t.teamName)) ?? []
    )
  )
];

this.productNames = [
  ...new Set<string>(
    data.flatMap((emp: any) =>
      emp.employeeProducts?.map((p: any) => String(p.productName)) ?? []
    )
  )
];




    },
    error: (err) => console.error(err),
  });
}
onTeamChange(event: any) {
  this.selectedTeam = event.target.value;
  this.filterEmployees();
}

onProductChange(event: any) {
  this.selectedProduct = event.target.value;
  this.filterEmployees();
}


  loadStacks() {
    this.skillService.getAllStacks().subscribe({
      next: (data) => {
        this.stacks = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadCategories() {
    this.skillService.getCatgorySkills().subscribe({
      next: (data) => {
        this.allCategories = data;
        this.filteredCategories = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadSkills() {
    this.skillService.getAllSkills().subscribe({
      next: (data) => {
        this.allSkills = data;
        this.filteredSkills = data;
      },
      error: (err) => console.error(err),
    });
  }

  loadPositions() {
    this.positionService.getAll().subscribe((res) => {
      this.positions = res;
    });
  }

  // ===== Dropdown Handlers =====
  onStackChange(event: any) {
    this.selectedStackId = +event.target.value || null;

    // Filter categories by stack
    if (this.selectedStackId) {
      this.filteredCategories = this.allCategories.filter(
        (cat) => cat.stackId === this.selectedStackId
      );
    } else {
      this.filteredCategories = this.allCategories;
    }

    // Reset category and skill selection
    this.selectedCategoryId = null;
    this.selectedSkillId = null;
    this.filteredSkills = [];
    this.filterEmployees();
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId = +event.target.value || null;

    // Filter skills by category
    if (this.selectedCategoryId) {
      this.filteredSkills = this.allSkills.filter(
        (skill) => skill.categoryId === this.selectedCategoryId
      );
    } else {
      this.filteredSkills = [];
    }

    this.selectedSkillId = null;
    this.filterEmployees();
  }

  onSkillChangeDropdown(event: any) {
    this.selectedSkillId = +event.target.value || null;
    this.filterEmployees();
  }

  onPositionDropdownChange(event: any) {
    this.selectedPosition = event.target.value;
    this.filterEmployees();
  }

  onSearch() {
    this.filterEmployees();
  }

  // ===== Filter Employees =====
  filterEmployees() {
    const selectedDate = this.selectedLastUsedDate
      ? new Date(this.selectedLastUsedDate)
      : null;

    const term = this.searchText?.toLowerCase() || '';

    this.filteredEmployees = this.employees.filter((emp) => {
      // Skill filter
      const skillMatch =
        !this.selectedSkillId ||
        emp.employeeSkills?.some((s: any) => s.id === this.selectedSkillId);

      // Position filter
      const positionMatch =
        !this.selectedPosition || emp.position === this.selectedPosition;

      // Last used date filter
      const lastUsedMatch =
        !selectedDate ||
        emp.employeeSkills?.some(
          (s: any) => s.lastUsed && new Date(s.lastUsed) >= selectedDate
        );

      // Search filter
      const searchMatch =
        emp.firstName?.toLowerCase().includes(term) ||
        emp.lastName?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) || 
        emp.firstName?.toLowerCase().concat(' ', emp.lastName?.toLowerCase()).includes(term);
// Team filter
const teamMatch =
  !this.selectedTeam ||
  emp.teamEmployees?.some((t: any) => t.teamName === this.selectedTeam);

// Product filter
const productMatch =
  !this.selectedProduct ||
  emp.employeeProducts?.some((p: any) => p.productName === this.selectedProduct);

      return (
  skillMatch &&
  positionMatch &&
  lastUsedMatch &&
  searchMatch &&
  teamMatch &&
  productMatch
);

    });
  }

  viewProfile(id: number) {
    this.router.navigate([`admin/employees/employees/${id}`]);
  }
  clearFilters() {
  // Reset all filter selections
  this.selectedStackId = null;
  this.selectedCategoryId = null;
  this.selectedSkillId = null;
  this.selectedPosition = '';
  this.selectedLastUsedDate = '';
  this.searchText = '';

  // Reset filtered dropdowns
  this.filteredCategories = this.allCategories;
  this.filteredSkills = this.allSkills;

  // Show all employees
  this.filteredEmployees = [...this.employees];
}

}
