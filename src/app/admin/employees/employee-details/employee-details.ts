import { Component } from '@angular/core';
import { EmployeeResponseDto } from '../../../core/models/employee.model';
import { Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-employee-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule , RouterLink, TagModule],
  templateUrl: './employee-details.html',
  styleUrl: './employee-details.css',
})
export class EmployeeDetails implements OnInit {
 constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}
  @Input() employee!: EmployeeResponseDto;
    ngOnInit(): void {
    // Get employee id from route
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // Call backend API
    this.employeeService.getEmployeeDetails(id).subscribe({
      next: (res) => {
        this.employee = res;
      },
      error: (err) => {
        console.error('Failed to fetch employee', err);
      }
    });
}
}
