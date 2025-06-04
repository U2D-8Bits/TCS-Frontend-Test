import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ModalConfig {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question' | 'loading';
  txtBtnConfirm?: string;
  txtBtnCancel?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  allowOutsideClick?: boolean;
  timer?: number;
}

export interface ModalResult {
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
  value?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  private resultSubject = new BehaviorSubject<ModalResult | null>(null);

  constructor() { }

  show(config: ModalConfig): Promise<ModalResult> {
    return new Promise((resolve) => {
      this.modalSubject.next(config);
      
      const subscription = this.resultSubject.subscribe(result => {
        if (result) {
          subscription.unsubscribe();
          this.modalSubject.next(null);
          this.resultSubject.next(null);
          resolve(result);
        }
      });

      // Auto close with timer
      if (config.timer) {
        setTimeout(() => {
          this.close({ isConfirmed: false, isDenied: false, isDismissed: true });
        }, config.timer);
      }
    });
  }

  getModalConfig(): Observable<ModalConfig | null> {
    return this.modalSubject.asObservable();
  }

  confirm() {
    this.resultSubject.next({ isConfirmed: true, isDenied: false, isDismissed: false });
  }

  cancel() {
    this.resultSubject.next({ isConfirmed: false, isDenied: true, isDismissed: false });
  }

  close(result?: ModalResult) {
    this.resultSubject.next(result || { isConfirmed: false, isDenied: false, isDismissed: true });
  }

  // Métodos de conveniencia similares a SweetAlert2
  fire(title: string, text?: string, icon?: ModalConfig['icon']): Promise<ModalResult> {
    return this.show({
      title,
      text,
      icon,
      txtBtnConfirm: 'OK',
      showCancelButton: false,
      showConfirmButton: true
    });
  }

  success(title: string, text?: string): Promise<ModalResult> {
    return this.fire(title, text, 'success');
  }

  error(title: string, text?: string): Promise<ModalResult> {
    return this.fire(title, text, 'error');
  }

  warning(title: string, text?: string): Promise<ModalResult> {
    return this.fire(title, text, 'warning');
  }

  info(title: string, text?: string): Promise<ModalResult> {
    return this.fire(title, text, 'info');
  }

  question(title: string, text?: string): Promise<ModalResult> {
    return this.show({
      title,
      text,
      icon: 'question',
      txtBtnConfirm: 'Sí',
      txtBtnCancel: 'No',
      showCancelButton: true,
      showConfirmButton: true
    });
  }

  loading(title: string = 'Cargando...', text?: string): Promise<ModalResult> {
    return this.show({
      title,
      text,
      icon: 'loading',
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false
    });
  }

  toast(title: string, icon: ModalConfig['icon'] = 'success', timer: number = 3000): Promise<ModalResult> {
    return this.show({
      title,
      icon,
      timer,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: true
    });
  }
}
