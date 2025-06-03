import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomFormComponent } from '../../shared/components/custom-form/custom-form.component';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ModalService } from '../../shared/services/modal.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    CustomButtonComponent,
    CustomInputComponent,
    CommonModule,
    CustomFormComponent
  ]
})
export class ProductComponent implements OnInit {  products: Product[] = [];
  showAddForm = false;

  private productService = inject(ProductService);
  public modalService = inject(ModalService); // Hacer público para el template

  ngOnInit() {
    this.getProducts();
  }


  // Método para obtener todos los productos
  getProducts(){
    this.modalService.loading('Cargando productos...', 'Por favor espere mientras se cargan los productos');
    
    this.productService.getProducts()
    .subscribe({
      next: (products: Product[]) =>{
        this.products = products;
        console.log('Products fetched successfully:', this.products);
        this.modalService.close();
        this.modalService.toast('Productos cargados exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.modalService.close();
        this.modalService.error('Error al cargar productos', 'No se pudieron cargar los productos. Por favor intente nuevamente.');
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
  async deleteProductWithConfirmation(product: Product) {
    try {
      const result = await this.modalService.show({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        txtBtnConfirm: 'Sí, eliminar',
        txtBtnCancel: 'Cancelar',
        showCancelButton: true,
        showConfirmButton: true,
        allowOutsideClick: false
      });
      
      if (result.isConfirmed) {
        this.modalService.loading('Eliminando producto...', 'Por favor espere');
        
        this.productService.deleteProduct(product.id).subscribe({
          next: (res) => {
            console.log('Producto eliminado:', res);
            this.modalService.close();
            this.modalService.success('¡Eliminado!', `El producto "${product.name}" ha sido eliminado exitosamente.`);
            this.getProducts();
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            this.modalService.close();
            this.modalService.error('Error', 'No se pudo eliminar el producto. Por favor intente nuevamente.');
          }
        });
      }
    } catch (error) {
      console.error('Error en modal:', error);
    }
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

  // Mostrar formulario de agregar
  onShowAddForm() {
    this.showAddForm = true;
  }

  // Ocultar formulario de agregar
  onHideAddForm() {
    this.showAddForm = false;
  }

  // Manejar submit del formulario de agregar
  onAddProduct(product: Product) {
    this.showAddForm = false;
    this.modalService.success('¡Producto agregado!', 'El producto ha sido creado exitosamente.');
    this.getProducts();
  }
}
