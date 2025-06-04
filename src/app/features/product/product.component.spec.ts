/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductComponent } from './product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: Router, useValue: {} }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ProductService.getProducts on init', () => {
    const service = TestBed.inject(ProductService);
    const spy = jest.spyOn(service, 'getProducts').mockReturnValue({ subscribe: jest.fn() } as any);
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should render product list in DOM', () => {
    component.products = [
      { id: '1', name: 'Prod1', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'Prod2', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
    ];
    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.product-item'));
    expect(items.length).toBe(2);
  });

  it('should filter products by search', () => {
    component.products = [
      { id: '1', name: 'Tarjeta', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' },
      { id: '2', name: 'Cuenta', description: 'desc', logo: '', date_release: '2025-01-01', date_revision: '2026-01-01' }
    ];
    component.searchTerm = 'tarjeta';
    fixture.detectChanges();
    const filtered = component.products.filter(p => p.name.toLowerCase().includes(component.searchTerm.toLowerCase()));
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Tarjeta');
  });

  it('should call router.navigate on addProduct', () => {
    const router = TestBed.inject(Router);
    const spy = jest.spyOn(router, 'navigate');
    component.addProduct();
    expect(spy).toHaveBeenCalled();
  });
});
