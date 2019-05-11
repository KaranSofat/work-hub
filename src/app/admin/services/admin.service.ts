import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject,of } from 'rxjs';

import {AppSettings } from './../../constants';



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }
  getListUsers() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/getListUsers');
  }
  getListPosts() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/getListPosts');
  } 
  getComments() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/getComments');
  } 
  getCategories() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/getCategories');
  } 
  getCount() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/count');
  } 
  getNews() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/news');
  } 
  registerUser(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/register',jsonPayload);
  }
  updateUser(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/updateUser',jsonPayload);
  }

  updateAdmin(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/updateAdmin',jsonPayload);
  }
  addCategory(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/addCategory',jsonPayload);
  }
  updateCategory(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/updateCategory',jsonPayload);
  }

  deleteUser(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/deleteUser/'+id);
  } 
  
  deletePost(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/deletePost/'+id);
  }
  deleteCat(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/deleteCat/'+id);
  } 
  deleteComment(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/deleteComment/'+id);
  } 
  deleteNews(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'admin/deleteNews/'+id);
  } 
  createNews(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/createNews',jsonPayload);
  }

  login(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/login',jsonPayload);
  }
  setToken(token: string) {
    localStorage.setItem('tokenAdmin', token);
  }
  deleteToken() {
    localStorage.removeItem('tokenAdmin');
  }
  getToken() {
    return localStorage.getItem('tokenAdmin');
  }
  
  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }
  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
  setAdminDetails(data:any){
    localStorage.setItem('adminDetails',  JSON.stringify(data));
  }
  getAdminDetails(){
    let details = localStorage.getItem('adminDetails');
    return JSON.parse(details);
  }
  deleteAdminDetails() {
    localStorage.removeItem('adminDetails');
  }
  forgotPassword(email) {
    return this.http.post(AppSettings.API_ENDPOINT + 'admin/forgotPassword', email);
  }

  changePostStatus(id,status) {
    return this.http.get(AppSettings.API_ENDPOINT + 'admin/changePostStatus/'+id+'/'+status);
  } 
}