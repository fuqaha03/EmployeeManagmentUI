import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-off-canvas',
  standalone: true,
  imports: [CommonModule, DrawerModule],
  templateUrl: './off-canvas.html',
  styleUrls: ['./off-canvas.css']
})
export class OffCanvasComponent {
  @Input() visible: boolean = false;
  @Input() position: 'left' | 'right' | 'top' | 'bottom' = 'right';
  @Input() width: string = '500px';
  @Input() height: string = '100%';
  @Input() header: string = '';
  @Input() modal: boolean = true;
  @Input() closable: boolean = true;
  @Input() dismissible: boolean = true;
  @Input() showCloseIcon: boolean = true;
  @Input() blockScroll: boolean = true;
  @Input() baseZIndex: number = 1100;
  @Input() autoZIndex: boolean = true;
  @Input() styleClass: string = '';
  @Input() contentTemplate?: TemplateRef<any>;
  @Input() headerTemplate?: TemplateRef<any>;
  @Input() footerTemplate?: TemplateRef<any>;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  onVisibleChange(value: boolean) {
    this.visible = value;
    this.visibleChange.emit(value);
  }

  onShowEvent() {
    this.onShow.emit();
  }

  onHideEvent() {
    this.onHide.emit();
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}

