import { Component, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    // CustomButtonComponent,
    CustomInputComponent
  ]
})
export class ProductComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
