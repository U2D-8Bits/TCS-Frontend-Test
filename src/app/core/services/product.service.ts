import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from '../../../environments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<{data: Product[]}>(this.apiUrl).pipe(
      map((response: any) => response.data)
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    return this.http.post(this.apiUrl, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchProductsByName(term: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products: Product[]) =>
        products.filter(product =>
          product.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }

  searchProductsById(term: string): Observable<Product[]> {
    return this.getProducts().pipe(
      map((products: Product[]) =>
        products.filter(product =>
          product.id.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }
}
