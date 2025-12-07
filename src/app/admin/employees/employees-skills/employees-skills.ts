import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../core/services/employee';
import { SkillsService } from '../../../core/services/skill';
import { Position } from '../../../core/services/position';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeResponseDto } from '../../../core/models/employee.model';

@Component({
  selector: 'app-employees-skills',
  templateUrl: './employees-skills.html',
  styleUrls: ['./employees-skills.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class EmployeesSkillsComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  // Filters
  stacks: any[] = [];
  categories: any[] = [];
  skills: any[] = [];
  allCategories: any[] = [];
  allSkills: any[] = [];
  filteredCategories: any[] = [];
  filteredSkills: any[] = [];
  positions: any[] = [];
  teamNames: string[] = [];
  productNames: string[] = [];

  selectedStackId: number | null = null;
  selectedCategoryId: number | null = null;
  selectedSkillId: number | null = null;
  selectedPosition: string = '';
  selectedTeam: string = '';
  selectedProduct: string = '';
  selectedLastUsedDate: string = '';
  searchText: string = '';
  nameControl = new FormControl('');
  filteredNames: string[] = [];

  // Temp storage for query param
  prefillName: string | null = null;

  constructor(
    private employeeService: EmployeeService,
    private skillService: SkillsService,
    private positionService: Position,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Read query param first
    this.route.queryParams.subscribe(params => {
      this.prefillName = params['name'] || null;
    });

    // Load all data
    this.loadEmployees();
    this.loadStacks();
    this.loadCategories();
    this.loadSkills();
    this.loadPositions();

    // Autocomplete logic
    this.nameControl.valueChanges.subscribe((value: string | null) => {
      const term = value?.toLowerCase() || '';
      this.filteredNames = this.employees
        .map(emp => `${emp.firstName} ${emp.lastName}`)
        .filter(name => name.toLowerCase().includes(term));
    });
  }

  // ===== Load Data =====
  loadEmployees() {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;

        // Populate teams and products
this.teamNames = Array.from(
  new Set(
    data.flatMap((emp: EmployeeResponseDto) =>
      (emp.teamEmployees?.map(t => String(t.teamName)) ?? [])
    )
  )
) as string[];

this.productNames = Array.from(
  new Set(
    data.flatMap((emp: EmployeeResponseDto) =>
      (emp.employeeProducts?.map(p => String(p.productName)) ?? [])
    )
  )
) as string[];



        // Apply query param filter if exists
        if (this.prefillName) {
          this.nameControl.setValue(this.prefillName);
          this.filterEmployeesByName(this.prefillName);
          this.prefillName = null;
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadStacks() {
    this.skillService.getAllStacks().subscribe({
      next: (data) => (this.stacks = data),
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
    this.positionService.getAll().subscribe(res => this.positions = res);
  }

  // ===== Dropdown Handlers =====
  onStackChange(event: any) {
    this.selectedStackId = +event.target.value || null;
    this.filteredCategories = this.selectedStackId
      ? this.allCategories.filter(cat => cat.stackId === this.selectedStackId)
      : this.allCategories;
    this.selectedCategoryId = null;
    this.selectedSkillId = null;
    this.filteredSkills = [];
    this.filterEmployees();
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId = +event.target.value || null;
    this.filteredSkills = this.selectedCategoryId
      ? this.allSkills.filter(s => s.categoryId === this.selectedCategoryId)
      : [];
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

  onTeamChange(event: any) {
    this.selectedTeam = event.target.value;
    this.filterEmployees();
  }

  onProductChange(event: any) {
    this.selectedProduct = event.target.value;
    this.filterEmployees();
  }

  onSearch() {
    this.filterEmployees();
  }

  // ===== Filter Employees =====
  filterEmployees() {
    const selectedDate = this.selectedLastUsedDate ? new Date(this.selectedLastUsedDate) : null;
    const term = this.nameControl.value?.toLowerCase() || '';

    this.filteredEmployees = this.employees.filter(emp => {
      const skillMatch = !this.selectedSkillId || emp.employeeSkills?.some((s: any) => s.id === this.selectedSkillId);
      const positionMatch = !this.selectedPosition || emp.position === this.selectedPosition;
      const lastUsedMatch = !selectedDate || emp.employeeSkills?.some((s: any) => s.lastUsed && new Date(s.lastUsed) >= selectedDate);
      const searchMatch =
        !term ||
        emp.firstName?.toLowerCase().includes(term) ||
        emp.lastName?.toLowerCase().includes(term) ||
        emp.email?.toLowerCase().includes(term) ||
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term);
      const teamMatch = !this.selectedTeam || emp.teamEmployees?.some((t: any) => t.teamName === this.selectedTeam);
      const productMatch = !this.selectedProduct || emp.employeeProducts?.some((p: any) => p.productName === this.selectedProduct);

      return skillMatch && positionMatch && lastUsedMatch && searchMatch && teamMatch && productMatch;
    });
  }

  // Filter specifically by exact name from query param
  filterEmployeesByName(name: string) {
    const term = name.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => `${emp.firstName} ${emp.lastName}`.toLowerCase() === term);
  }

  selectName(name: string) {
    this.nameControl.setValue(name);
    this.filterEmployeesByName(name);
  }

  viewProfile(id: number) {
    this.router.navigate([`admin/employees/employees/${id}`]);
  }

  clearFilters() {
    this.selectedStackId = null;
    this.selectedCategoryId = null;
    this.selectedSkillId = null;
    this.selectedPosition = '';
    this.selectedTeam = '';
    this.selectedProduct = '';
    this.selectedLastUsedDate = '';
    this.nameControl.setValue('');
    this.filteredCategories = this.allCategories;
    this.filteredSkills = this.allSkills;
    this.filteredEmployees = [...this.employees];
  }

  isLast(array: any[], item: any): boolean {
    return array.indexOf(item) === array.length - 1;
  }
}
