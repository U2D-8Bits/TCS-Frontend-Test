import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  templateUrl: './custom-button.component.html',
  styleUrls: ['./custom-button.component.css'],
  standalone: true,
  imports: []
})
export class CustomButtonComponent implements OnInit {
  @Input() colorTexto: string = '#fff';
  @Input() Texto: string = 'Botón';
  @Input() ColorHoover: string = '#0056b3';

  hover = false;

  get backgroundColor() {
    return this.hover ? this.ColorHoover : 'var(--btn-bg, #007bff)';
  }

  constructor() { }

  ngOnInit() {
  }

}
