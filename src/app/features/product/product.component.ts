import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { CustomFormComponent } from '../../shared/components/custom-form/custom-form.component';
import { Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { ModalService } from '../../shared/services/modal.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports: [
    CustomButtonComponent,
    CustomInputComponent,
    CommonModule,
    CustomFormComponent,
    FormsModule,
  ],
})
export class ProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  showAddForm = false;
  searchTerm = '';
  openDropdownId: string | null = null;
  dropdownPosition = { top: '0px', left: '0px' };
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  Math = Math;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  private productService = inject(ProductService);
  public modalService = inject(ModalService);

  ngOnInit() {
    this.getProducts();
    this.setupSearchSubscription();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProducts() {
    this.modalService.loading(
      'Cargando productos...',
      'Por favor espere mientras se cargan los productos'
    );
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.updateDisplayedProducts();
        console.log('Products fetched successfully:', this.allProducts);
        this.modalService.close();
        this.modalService.toast('Productos cargados exitosamente', 'success');
      },
      error: (error) => {
        console.error('Error fetching products:', error);
        this.modalService.close();
        this.modalService.error(
          'Error al cargar productos',
          'No se pudieron cargar los productos. Por favor intente nuevamente.'
        );
      },
    });
  }

  getProductById(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        console.log('Producto encontrado:', product);
      },
      error: (error) => {
        console.error('Error al buscar producto:', error);
      },
    });
  }

  async deleteProductWithConfirmation(product: Product) {
    try {
      const result = await this.modalService.show({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`,
        icon: 'warning',
        txtBtnConfirm: 'Aceptar',
        txtBtnCancel: 'Cancelar',
        showCancelButton: true,
        showConfirmButton: true,
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        this.modalService.loading('Eliminando producto...', 'Por favor espere');

        this.productService.deleteProduct(product.id).subscribe({
          next: (res) => {
            console.log('Producto eliminado:', res);
            this.modalService.close();
            this.modalService.success(
              '¡Eliminado!',
              `El producto "${product.name}" ha sido eliminado exitosamente.`
            );
            this.getProducts();
          },
          error: (error) => {
            console.error('Error al eliminar producto:', error);
            this.modalService.close();
            this.modalService.error(
              'Error',
              'No se pudo eliminar el producto. Por favor intente nuevamente.'
            );
          },
        });
      }
    } catch (error) {
      console.error('Error en modal:', error);
    }
  }

  searchProductsByName(term: string) {
    this.onSearchTermChange(term);
  }

  onShowAddForm() {
    this.showAddForm = true;
  }

  onHideAddForm() {
    this.showAddForm = false;
  }
  onAddProduct(product: Product) {
    this.showAddForm = false;
    this.modalService.success(
      '¡Producto agregado!',
      'El producto ha sido creado exitosamente.'
    );
    this.getProducts();
  }

  toggleDropdown(productId: string, event: Event) {
    event.stopPropagation();

    if (this.openDropdownId === productId) {
      this.openDropdownId = null;
      return;
    }

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.right - 140 + window.scrollX}px`,
    };

    this.openDropdownId = productId;
  }

  closeDropdown() {
    this.openDropdownId = null;
  }

  onEditProduct(product: Product, event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    console.log('Editar producto:', product);
    this.modalService.info(
      'Función en desarrollo',
      'La edición de productos estará disponible pronto.'
    );
  }

  onDeleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    this.deleteProductWithConfirmation(product);
  }

  private setupSearchSubscription() {
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.performSearch(searchTerm);
      });
  }
  private performSearch(term: string) {
    if (!term || term.trim() === '') {
      this.filteredProducts = [...this.allProducts];
    } else {
      this.filteredProducts = this.allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    }

    this.currentPage = 1;
    this.updateDisplayedProducts();

    console.log(
      `Búsqueda realizada para: "${term}", encontrados: ${this.filteredProducts.length} productos`
    );
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchSubject.next('');
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
    this.currentPage = 1; // Reset to first page
    this.updateDisplayedProducts();
  }

  updateDisplayedProducts() {
    this.totalPages = Math.ceil(
      this.filteredProducts.length / this.itemsPerPage
    );

    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages);
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.displayedProducts = this.filteredProducts.slice(startIndex, endIndex);
    this.products = this.displayedProducts;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProducts();
    }
  }

  goToPreviousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage() {
    this.goToPage(this.currentPage + 1);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
