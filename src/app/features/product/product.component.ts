// Importaciones de Angular y dependencias
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// Librerias Externas
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// Componentes y servicios personalizados
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
    CustomFormComponent,
    FormsModule,
  ],
})
export class ProductComponent implements OnInit, OnDestroy {
  
  // Propiedades públicas (para el template)
  products: Product[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  showAddForm = false;
  showEditForm = false;
  editingProduct: Product | null = null;
  searchTerm = '';
  openDropdownId: string | null = null;
  dropdownPosition = { top: '0px', left: '0px' };
  itemsPerPage = 5;
  currentPage = 1;
  totalPages = 1;
  Math = Math;
  public modalService = inject(ModalService);
  loading: boolean = false;

  // Propiedades privadas y dependencias inyectadas
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // IDs de productos cuya imagen falló
  imageErrorIds = new Set<string>();

  // ================= Métodos de Ciclo de Vida =================
  ngOnInit() {
    this.getProducts();
    this.setupSearchSubscription();
    this.checkRouteForEdit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= Métodos Públicos =================

  searchProductsByName(term: string) {
    this.onSearchTermChange(term);
  }

  onShowAddForm() {
    this.loading = false; // Asegura que no quede skeleton
    this.showEditForm = false;
    this.editingProduct = null;
    this.router.navigate(['/products']);
    this.showAddForm = true;
  }

  onHideAddForm() {
    this.navigateToProductList();
  }

  onAddProduct(product: Product) {
    this.modalService.success(
      '¡Producto agregado!',
      'El producto ha sido creado exitosamente.'
    );
    this.getProducts();
    this.navigateToProductList();
  }

  onEditProduct(product: Product, event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    this.router.navigate(['/products', product.id]);
  }

  onShowEditForm(product: Product) {
    this.loading = false; // Asegura que no quede skeleton
    this.router.navigate(['/products', product.id]);
  }

  onHideEditForm() {
    this.navigateToProductList();
  }

  onEditProductSubmit(product: Product) {
    this.modalService.success(
      '¡Producto actualizado!',
      'El producto ha sido actualizado exitosamente.'
    );
    this.getProducts();
    this.navigateToProductList();
  }

  onDeleteProduct(product: Product, event: Event) {
    event.stopPropagation();
    this.closeDropdown();
    this.deleteProductWithConfirmation(product);
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
    this.currentPage = 1;
    this.updateDisplayedProducts();
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

  // ================= Métodos de Data/Servicios =================

  getProducts() {
    this.loading = true;
    this.modalService.loading(
      'Cargando productos...',
      'Por favor espere mientras se cargan los productos'
    );
    this.productService.getProducts().subscribe({
      next: async (products: Product[]) => {
        this.allProducts = products;
        this.filteredProducts = products;
        this.updateDisplayedProducts();
        this.modalService.close();
        await new Promise(res => setTimeout(res, 1000)); // Espera 1s antes del toast
        this.loading = false;
        this.modalService.toast('Productos cargados exitosamente', 'success');
      },
      error: () => {
        this.modalService.close();
        this.loading = false;
        this.modalService.error(
          'Error al cargar productos',
          'No se pudieron cargar los productos. Por favor intente nuevamente.'
        );
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
        this.loading = true;
        this.modalService.loading('Eliminando producto...', 'Por favor espere');
        this.productService.deleteProduct(product.id).subscribe({
          next: async () => {
            this.modalService.close();
            await new Promise(res => setTimeout(res, 1000)); // Espera 1s antes del modal de éxito
            this.loading = false;
            this.modalService.success(
              '¡Eliminado!',
              `El producto "${product.name}" ha sido eliminado exitosamente.`
            );
            this.getProducts();
          },
          error: () => {
            this.modalService.close();
            this.loading = false;
            this.modalService.error(
              'Error',
              'No se pudo eliminar el producto. Por favor intente nuevamente.'
            );
          },
        });
      }
    } catch {
      this.loading = false;
    }
  }

  // ================= Métodos Privados/Helper =================

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
  }

  private updateDisplayedProducts() {
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

  private checkRouteForEdit() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.loadProductForEdit(productId);
      } else {
        this.showEditForm = false;
        this.editingProduct = null;
      }
    });
  }

  private loadProductForEdit(productId: string) {
    const existingProduct = this.allProducts.find(p => p.id === productId);
    if (existingProduct) {
      this.editingProduct = existingProduct;
      this.showEditForm = true;
      this.showAddForm = false;
      return;
    }
    this.modalService.loading('Cargando producto...', 'Por favor espere');
    this.productService.getProductById(productId).subscribe({
      next: (product: Product) => {
        this.modalService.close();
        this.editingProduct = product;
        this.showEditForm = true;
        this.showAddForm = false;
      },
      error: () => {
        this.modalService.close();
        this.modalService.error(
          'Error al cargar producto',
          'No se pudo encontrar el producto solicitado.'
        );
        this.router.navigate(['/products']);
      }
    });
  }

  private navigateToProductList() {
    this.showAddForm = false;
    this.showEditForm = false;
    this.editingProduct = null;
    this.router.navigate(['/products']);
  }

  // Devuelve las iniciales del nombre del producto
  getInitials(name: string): string {
    if (!name) return '?';
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // Marca el producto como imagen fallida
  onImageError(productId: string) {
    this.imageErrorIds.add(productId);
  }
}
