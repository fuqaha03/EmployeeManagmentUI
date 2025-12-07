import { Component, OnInit } from '@angular/core';
import { ProductDto } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = []; // For search
  members: any[] = [];
  selectedProductId: number | null = null;
  searchText: string = ''; // search input

  form: ProductDto = {
    id: 0,
    name: '',
    description: '',
    isActive: true,
    createdOn: new Date()
  };

  isEditMode = false;
  editId: number | null = null;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(res => {
      this.products = res;
      this.applyFilter();
    });
  }

  submitForm() {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.editId) {
      this.productService.update(this.editId, this.form).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      this.productService.add(this.form).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  edit(product: ProductDto) {
    this.isEditMode = true;
    this.editId = product.id!;
    this.form = { ...product };
  }

  delete(id: number) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    this.productService.delete(id).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      id: 0,
      name: '',
      description: '',
      isActive: true,
      createdOn: new Date()
    };
  }

  getMembers(productId: number) {
    this.router.navigate([`products/${productId}/members`]);
  }

  // Toggle employee in members
  toggleMember(employeeId: number) {
    const index = this.members.findIndex(m => m.id === employeeId);
    if (index !== -1) {
      this.members[index].isJoined = !this.members[index].isJoined;
    }
  }

  // Save members
  saveMembers() {
    if (this.selectedProductId === null) return;

    const selectedIds = this.members
      .filter(m => m.isJoined)
      .map(m => m.id);

    this.productService.updateProductMembers(this.selectedProductId, selectedIds)
      .subscribe(() => {
        alert('Members updated successfully!');
      });
  }

  // --- SEARCH FILTER ---
  applyFilter() {
    if (!this.searchText.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    const text = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(text) ||
      (p.description && p.description.toLowerCase().includes(text))
    );
  }

  // --- FORM VALIDATION ---
  isFormValid(): boolean {
    return this.form.name.trim() !== '';
  }
}
