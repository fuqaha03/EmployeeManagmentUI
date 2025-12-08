import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ProductDto } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { OffCanvasComponent } from '../../shared/components/off-canvas/off-canvas';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-products',
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    OffCanvasComponent,
    TextareaModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
  standalone: true
})
export class ProductsComponent implements OnInit {
  @ViewChild('footerTemplate') footerTemplate!: TemplateRef<any>;

  products: ProductDto[] = [];
  filteredProducts: ProductDto[] = []; // For search
  members: any[] = [];
  selectedProductId: number | null = null;
  searchForm!: FormGroup;
  loading: boolean = false;
  saving: boolean = false;

  form: ProductDto = {
    id: 0,
    name: '',
    description: '',
    isActive: true,
    createdOn: new Date()
  };

  isEditMode = false;
  editId: number | null = null;

  visible: boolean = false;

  constructor(
    private productService: ProductService, 
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchText: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    
    // Subscribe to search form changes
    this.searchForm.get('searchText')?.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
      }
    });
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill in all required fields' });
      return;
    }

    this.saving = true;
    if (this.isEditMode && this.editId) {
      this.productService.update(this.editId, this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
        }
      });
    } else {
      this.productService.add(this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadProducts();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product' });
        }
      });
    }
  }

  openDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  edit(product: ProductDto) {
    this.isEditMode = true;
    this.editId = product.id!;
    this.form = { ...product };
    this.visible = true;
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this product?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.productService.delete(id).subscribe({
          next: () => {
            this.loadProducts();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
          }
        });
      }
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
    const searchText = this.searchForm.get('searchText')?.value || '';
    if (!searchText.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    const text = searchText.toLowerCase();
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
