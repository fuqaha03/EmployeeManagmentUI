import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-update-product-member',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './update-product-memeber.html',
  styleUrl: './update-product-memeber.css',
})
export class UpdateProductMember {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  productId!: number;
  searchTerm: string = '';

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('productId')!;
    this.loadEmployees();
  }

  loadEmployees() {
    this.productService.getProductMembers(this.productId).subscribe(data => {
      this.employees = data.map(emp => ({
        ...emp,
        isJoined: emp.isJoined || false
      }));
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.filteredEmployees = this.employees;
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term)
    );
  }

  onCheckboxChange(emp: any, event: any) {
    emp.isJoined = event.checked;
  }

  saveChanges() {
    const selectedIds = this.employees
      .filter(emp => emp.isJoined)
      .map(emp => emp.id);

    this.productService.updateProductMembers(this.productId, selectedIds).subscribe(() => {
      alert('Product members updated successfully!');
    });
  }
}
