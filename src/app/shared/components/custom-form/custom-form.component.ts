import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { CustomInputComponent } from '../custom-input/custom-input.component';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { Observable, of } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css'],
  standalone: true,
  imports: [
    CustomButtonComponent,
    CustomInputComponent,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CustomFormComponent implements OnInit {
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() initialData: Product | null = null;
  @Output() formSubmit = new EventEmitter<Product>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup;
  loading = false;
  errorMsg = '';
  idExists = false;

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  constructor() {
    this.form = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idUniqueValidator.bind(this)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, this.releaseDateValidator]],
      date_revision: ['', [Validators.required, this.reviewDateValidator.bind(this)]]
    });
  }

  ngOnInit() {
    if (this.mode === 'edit' && this.initialData) {
      this.form.patchValue({
        ...this.initialData
      });
      this.form.get('id')?.disable();
    }
  }

  idUniqueValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (this.mode === 'edit' || !control.value) return of(null);
    return this.productService.verifyProductId(control.value).pipe(
      map(exists => exists ? { idExists: true } : null),
      first()
    );
  }

  releaseDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const today = new Date();
    const inputDate = new Date(control.value);
    today.setHours(0,0,0,0);
    inputDate.setHours(0,0,0,0);
    return inputDate >= today ? null : { releaseDateInvalid: true };
  }

  reviewDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !this.form) return null;
    const releaseDate = this.form.get('date_release')?.value;
    if (!releaseDate) return null;
    const release = new Date(releaseDate);
    const review = new Date(control.value);
    const expected = new Date(release);
    expected.setFullYear(expected.getFullYear() + 1);
    return review.getTime() === expected.getTime() ? null : { reviewDateInvalid: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    const product: Product = {
      ...this.form.getRawValue(),
      id: this.form.get('id')?.value || this.initialData?.id
    };
    let obs: Observable<any>;
    if (this.mode === 'add') {
      obs = this.productService.addProduct(product);
    } else {
      obs = this.productService.updateProduct(product.id, product);
    }
    obs.subscribe({
      next: () => {
        this.loading = false;
        this.formSubmit.emit(product);
        this.form.reset();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = 'Ocurrió un error al guardar.';
      }
    });
  }

  onReset() {
    if (this.mode === 'edit' && this.initialData) {
      this.form.reset({ ...this.initialData });
    } else {
      this.form.reset();
    }
    this.errorMsg = '';
  }

  onCancel() {
    this.formCancel.emit();
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || (!control.touched && !control.dirty)) return null;
    if (control.errors?.['required']) return 'Este campo es requerido';
    if (control.errors?.['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors?.['maxlength']) return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
    if (control.errors?.['idExists']) return 'El ID ya existe';
    if (control.errors?.['releaseDateInvalid']) return 'La fecha debe ser igual o mayor a hoy';
    if (control.errors?.['reviewDateInvalid']) return 'Debe ser exactamente un año después de la liberación';
    return null;
  }
}
