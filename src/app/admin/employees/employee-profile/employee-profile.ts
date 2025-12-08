import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee';
import { EmployeeResponseDto } from '../../../core/models/employee.model';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, TagModule],
  templateUrl: './employee-profile.html',
  styleUrls: ['./employee-profile.css']
})
export class EmployeeProfileComponent implements OnInit {

  employee: EmployeeResponseDto | undefined;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    // Call API without ID
    this.employeeService.getProfile().subscribe({
      next: (res) => {
        this.employee = res; // assign backend response directly
      },
      error: (err) => {
        console.error('Failed to fetch employee', err);
      }
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }
}
