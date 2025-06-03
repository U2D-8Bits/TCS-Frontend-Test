import { Component, inject, OnInit } from '@angular/core';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    CustomButtonComponent,
    CustomInputComponent
  ]
})
export class ProductComponent implements OnInit {

  products: Product[] = [];

  private productService = inject(ProductService);

  

  ngOnInit() {
    this.getProducts();
  }


  // Método para obtener todos los productos
  getProducts(){
    this.productService.getProducts()
    .subscribe({
      next: (products: Product[]) =>{
        this.products = products;
        console.log('Products fetched successfully:', this.products);
      },
      error: (error) => {
        console.error('Error fetching products:', error);
      }
    })
  }

  // Obtener producto por ID
  getProductById(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Producto encontrado:', product);
      },
      error: (error) => {
        console.error('Error al buscar producto:', error);
      }
    });
  }

  // Eliminar un producto
  deleteProduct(id: string) {
    this.productService.deleteProduct(id).subscribe({
      next: (res) => {
        console.log('Producto eliminado:', res);
        this.getProducts();
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }

  // Buscar productos por nombre
  searchProductsByName(term: string) {
    this.productService.searchProductsByName(term).subscribe({
      next: (products) => {
        this.products = products;
        console.log('Productos filtrados:', products);
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
      }
    });
  }

}
