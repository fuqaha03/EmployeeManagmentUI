import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EmployeeService } from '../../../../core/services/employee';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Position } from '../../../../core/services/position';
import { OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-createemployee',
  imports: [CommonModule, FormsModule],
  templateUrl: './createemployee.html',
  styleUrl: './createemployee.css',
})
export class Createemployee implements OnInit{
  newEmployee = {
    firstName: '',
    lastName: '',
    email: '',
    userName: '',
    phoneNumber: '',
    password: '',
    employeeNumber: null,
    positionId: null
  };

  positions: any[] = [];
 

    ngOnInit() {
    this.positionServices.getAll().subscribe({
      next: (res: any) => {
        this.positions = res;
      },
      error: (err) => console.error('Error fetching positions', err),
    });
  }

  constructor( private router : Router , private employeeService: EmployeeService , private positionServices : Position) {}
  addEmployee() {
    if (!this.newEmployee.firstName || !this.newEmployee.lastName) {
      alert('First Name and Last Name are required!');
      return;
    }

    this.employeeService.create(this.newEmployee).subscribe({
      next: (res) => {
        console.log('Employee created', res);
        alert('Employee created successfully!');
        this.router.navigate(['/admin/employees']);
      },
      error: (err) => console.error('Error creating employee', err)
    });
  }
}
