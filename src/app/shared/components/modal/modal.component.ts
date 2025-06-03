import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ModalService, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ModalComponent implements OnInit, OnDestroy {
  modalConfig: ModalConfig | null = null;
  isVisible = false;
  private subscription!: Subscription;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
    this.subscription = this.modalService.getModalConfig().subscribe(config => {
      this.modalConfig = config;
      this.isVisible = !!config;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onConfirm() {
    this.modalService.confirm();
  }

  onCancel() {
    this.modalService.cancel();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget && this.modalConfig?.allowOutsideClick !== false) {
      this.modalService.close();
    }
  }

  getIconClass(): string {
    switch (this.modalConfig?.icon) {
      case 'success':
        return 'modal-icon-success';
      case 'error':
        return 'modal-icon-error';
      case 'warning':
        return 'modal-icon-warning';
      case 'info':
        return 'modal-icon-info';
      case 'question':
        return 'modal-icon-question';
      case 'loading':
        return 'modal-icon-loading';
      default:
        return '';
    }
  }

  getIconSymbol(): string {
    switch (this.modalConfig?.icon) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'question':
        return '?';
      case 'loading':
        return '';
      default:
        return '';
    }
  }
}
