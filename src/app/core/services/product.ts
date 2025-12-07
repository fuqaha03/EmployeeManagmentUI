import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductDto } from '../models/product.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { __assign } from 'tslib';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
     private baseUrl = `${environment.apiBaseUrl}/api/Product`; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.baseUrl}/all`);
  }

  add(product: ProductDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, product);
  }

  update(id: number, product: ProductDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  updateProductMembers(productId: number, employeeIds: number[]): Observable<any> {
    return this.http.put(`${this.baseUrl}/assign`, {productId , employeeIds});
  }

    getProductMembers(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/products/${productId}/members`);
  }
}
