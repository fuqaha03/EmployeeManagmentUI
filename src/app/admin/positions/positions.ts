import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PositionDto } from '../../core/models/position.model';
import { Position } from '../../core/services/position';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
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
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-positions',
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
    TooltipModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './positions.html',
  styleUrl: './positions.css',
  standalone: true
})
export class PositionsComponent implements OnInit {
  @ViewChild('footerTemplate') footerTemplate!: TemplateRef<any>;

  positions: PositionDto[] = [];
  filteredPositions: PositionDto[] = [];
  loading: boolean = false;
  saving: boolean = false;
  searchForm!: FormGroup;
  form: PositionDto = {
    name: '',
    description: '',
    isActive: true
  };

  isEditMode = false;
  editId: number | null = null;
  visible: boolean = false;

  constructor(
    private posistionService: Position,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchText: ['']
    });
  }

  ngOnInit(): void {
    this.loadPositions();
    
    // Subscribe to search form changes
    this.searchForm.get('searchText')?.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  loadPositions() {
    this.loading = true;
    this.posistionService.getAll().subscribe({
      next: (res) => {
        this.positions = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load positions' });
      }
    });
  }

  applyFilter() {
    const searchText = this.searchForm.get('searchText')?.value || '';
    if (!searchText.trim()) {
      this.filteredPositions = this.positions;
      return;
    }
    const text = searchText.toLowerCase();
    this.filteredPositions = this.positions.filter(pos =>
      pos.name.toLowerCase().includes(text) || 
      (pos.description && pos.description.toLowerCase().includes(text))
    );
  }

  submitForm() {
    if (!this.isFormValid()) {
      this.messageService.add({ severity: 'warn', summary: 'Validation', detail: 'Please fill in all required fields' });
      return;
    }

    this.saving = true;
    if (this.isEditMode && this.editId) {
      this.posistionService.updatePosition(this.editId, this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadPositions();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Position updated successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update position' });
        }
      });
    } else {
      this.posistionService.addPosition(this.form).subscribe({
        next: () => {
          this.resetForm();
          this.loadPositions();
          this.visible = false;
          this.saving = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Position added successfully' });
        },
        error: () => {
          this.saving = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add position' });
        }
      });
    }
  }

  edit(position: PositionDto) {
    this.isEditMode = true;
    this.editId = position.id!;
    this.form = { ...position };
    this.visible = true;
  }

  delete(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this position?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.posistionService.deletePosition(id).subscribe({
          next: () => {
            this.loadPositions();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Position deleted successfully' });
          },
          error: () => {
            this.loading = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete position' });
          }
        });
      }
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.editId = null;
    this.form = {
      name: '',
      description: '',
      isActive: true
    };
  }

  openDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.resetForm();
  }

  isFormValid(): boolean {
    return this.form.name.trim() !== '' && this.form.description.trim() !== '';
  }
}
