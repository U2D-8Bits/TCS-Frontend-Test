import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../models/product.model';
import { environment } from '../../../environments';
import { of } from 'rxjs';

const mockProducts: Product[] = [
  {
    id: 'uno',
    name: 'Producto Uno',
    description: 'Descripción uno',
    logo: 'logo1.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  },
  {
    id: 'dos',
    name: 'Producto Dos',
    description: 'Descripción dos',
    logo: 'logo2.png',
    date_release: '2025-02-01',
    date_revision: '2026-02-01'
  }
];

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiBaseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get products', (done) => {
    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
      done();
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush({ data: mockProducts });
  });

  it('should get product by id', (done) => {
    service.getProductById('uno').subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
      done();
    });
    const req = httpMock.expectOne(`${apiUrl}/uno`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts[0]);
  });

  it('should verify product id', (done) => {
    service.verifyProductId('uno').subscribe(result => {
      expect(result).toBe(true);
      done();
    });
    const req = httpMock.expectOne(`${apiUrl}/verification/uno`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should add product', (done) => {
    const newProduct = mockProducts[0];
    service.addProduct(newProduct).subscribe(response => {
      expect(response).toEqual({ message: 'Product added successfully', data: newProduct });
      done();
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ message: 'Product added successfully', data: newProduct });
  });

  it('should update product', (done) => {
    const update = { name: 'Nuevo nombre' };
    service.updateProduct('uno', update).subscribe(response => {
      expect(response).toEqual({ message: 'Product updated successfully', data: update });
      done();
    });
    const req = httpMock.expectOne(`${apiUrl}/uno`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(update);
    req.flush({ message: 'Product updated successfully', data: update });
  });

  it('should delete product', (done) => {
    service.deleteProduct('uno').subscribe(response => {
      expect(response).toEqual({ message: 'Product removed successfully' });
      done();
    });
    const req = httpMock.expectOne(`${apiUrl}/uno`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Product removed successfully' });
  });

  it('should search products by name', (done) => {
    jest.spyOn(service, 'getProducts').mockReturnValue(of(mockProducts));
    service.searchProductsByName('uno').subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].id).toBe('uno');
      done();
    });
  });
});
