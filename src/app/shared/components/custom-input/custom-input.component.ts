// Importaciones de Angular y dependencias
import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  standalone: true,
  imports: [NgIf, NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {
  // ================= Inputs =================
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() errorMessage: string = '';
  @Input() type: string = 'text';
  @Input() showError: boolean = false;
  @Input() loading: boolean = false;

  // ================= Propiedades públicas =================
  value: string = '';
  touched = false;
  disabled = false;

  // ================= Métodos para ControlValueAccessor =================
  onChange = (value: any) => {};
  onTouched = () => {};

  // ================= Constructor y ciclo de vida =================
  constructor() { }
  ngOnInit() {}

  // ================= Métodos públicos =================
  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  handleBlur() {
    this.touched = true;
    this.onTouched();
  }
}
