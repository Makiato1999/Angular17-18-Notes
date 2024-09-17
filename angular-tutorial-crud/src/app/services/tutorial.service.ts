import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';

const baseUrl = 'http://localhost:4200/api/tutorials';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  constructor(private httpClient: HttpClient) { }

  get(id: any): Observable<Tutorial> {
    return this.httpClient.get<Tutorial>(`${baseUrl}/${id}`);
  }

  getAll(): Observable<Tutorial[]> {
    return this.httpClient.get<Tutorial[]>(baseUrl);
  }

  create(data: any): Observable<any> {
    return this.httpClient.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.httpClient.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.httpClient.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.httpClient.delete(baseUrl);
  }

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.httpClient.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
}
