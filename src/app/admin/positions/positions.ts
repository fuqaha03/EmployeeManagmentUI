import { Component, OnInit } from '@angular/core';
import { PositionDto } from '../../core/models/position.model';
import { Position } from '../../core/services/position';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-positions',
  imports: [CommonModule, FormsModule],
  templateUrl: './positions.html',
  styleUrl: './positions.css',
})
export class PositionsComponent implements OnInit {
  positions: PositionDto[] = [];
  filteredPositions: PositionDto[] = [];
  form: PositionDto = {
    name: '',
    description: '',
    isActive: true
  };

  searchText = ''; // <-- search filter text
  isEditMode = false;
  editId: number | null = null;

  constructor(private posistionService: Position) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions() {
    this.posistionService.getAll().subscribe(res => {
      this.positions = res;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (!this.searchText.trim()) {
      this.filteredPositions = this.positions;
      return;
    }
    const text = this.searchText.toLowerCase();
    this.filteredPositions = this.positions.filter(pos =>
      pos.name.toLowerCase().includes(text) || 
      (pos.description && pos.description.toLowerCase().includes(text))
    );
  }

  submitForm() {
    if (!this.isFormValid()) return;

    if (this.isEditMode && this.editId) {
      this.posistionService.updatePosition(this.editId, this.form).subscribe(() => {
        this.resetForm();
        this.loadPositions();
      });
    } else {
      this.posistionService.addPosition(this.form).subscribe(() => {
        this.resetForm();
        this.loadPositions();
      });
    }
  }

  edit(position: PositionDto) {
    this.isEditMode = true;
    this.editId = position.id!;
    this.form = { ...position };
  }

  delete(id: number) {
    if (!confirm("Are you sure?")) return;
    this.posistionService.deletePosition(id).subscribe(() => {
      this.loadPositions();
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

  isFormValid(): boolean {
    return this.form.name.trim() !== '' && this.form.description.trim() !== '';
  }
}
