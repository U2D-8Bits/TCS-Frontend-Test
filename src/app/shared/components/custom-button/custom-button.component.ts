import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css'],
  standalone: true,
  imports: []
})
export class CustomButtonComponent implements OnInit {
  @Input() colorTexto: string = '#0F265C'; // acepta hex
  @Input() colorBoton: string = '#FFDD00'; // acepta hex
  @Input() Texto: string = 'Botón';
  @Input() ColorHoover: string = '#0056b3'; // acepta hex
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button'; // Tipo de botón

  hover = false;

  get backgroundColor() {
    // Si el valor es hexadecimal válido, úsalo, si no, fallback
    const isHex = (v: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(v);
    const base = isHex(this.colorBoton) ? this.colorBoton : '#FFDD00';
    const hover = isHex(this.ColorHoover) ? this.ColorHoover : '#0056b3';
    return this.hover ? hover : base;
  }

  get textColor() {
    const isHex = (v: string) => /^#([A-Fa-f0-9]{3}){1,2}$/.test(v);
    return isHex(this.colorTexto) ? this.colorTexto : '#0F265C';
  }

  constructor() { }

  ngOnInit() {
  }

}
