import { Component } from '@angular/core';
import { ProductService } from '../../../core/services/product';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // required for ngModel

@Component({
  selector: 'app-update-product-member',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product-memeber.html',
  styleUrl: './update-product-memeber.css',
})
export class UpdateProductMember {
  employees: any[] = []; // all employees
  productId!: number;     // current product
  searchTerm: string = ''; // for filtering

  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('productId')!;
    this.loadEmployees();
  }

  // Load employees and mark who is already assigned to this product
  loadEmployees() {
    this.productService.getProductMembers(this.productId).subscribe(data => {
      this.employees = data.map(emp => ({
        ...emp,
        isJoined: emp.isJoined || false // mark if already member
      }));
    });
  }

  // Handle checkbox toggle
  onCheckboxChange(emp: any, event: any) {
    emp.isJoined = event.target.checked;
  }
  // Save changes
  saveChanges() {
    const selectedIds = this.employees
      .filter(emp => emp.isJoined)
      .map(emp => emp.id);

    this.productService.updateProductMembers(this.productId, selectedIds).subscribe(() => {
      alert('Product members updated successfully!');
    });
  }

  // Search/filter employees
  filteredEmployees() {
    if (!this.searchTerm) return this.employees;

    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(emp =>
      emp.firstName.toLowerCase().includes(term) ||
      emp.lastName.toLowerCase().includes(term)
    );
  }
}
