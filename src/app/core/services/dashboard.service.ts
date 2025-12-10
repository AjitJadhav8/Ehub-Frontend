import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // Endpoint 1: add customer - POST /customers/
  addCustomer(body: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/customers/`, body);
  }

  // Endpoint 2: get all customers - GET /customers/
  getCustomers(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/customers/`);
  }

  // Endpoint 3: get a particular customer - GET /customers/{customer_id}
  getCustomer(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/customers/${customerId}`);
  }

  // Endpoint 4: update customer - PUT /customers/{customer_id}
  updateCustomer(customerId: string, body: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/customers/${customerId}`, body);
  }

  // Endpoint 5: delete - DELETE /customers/{customer_id}
  deleteCustomer(customerId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/customers/${customerId}`);
  }

}
