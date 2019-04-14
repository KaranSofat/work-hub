import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject,of } from 'rxjs';
import {AppSettings } from './../constants';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
 
  userData: any; 
  catData:any
  private categoryType: Subject<any> = new Subject<any>();

  public categoryType$ = this.categoryType.asObservable();

  private logoutType: Subject<any> = new Subject<any>();

  public logoutType$ = this.logoutType.asObservable();
  

  public sendData(data: any){
  
      this.categoryType.next(data);
  }
  public sendLogout(data: any){
  console.log(data)
    this.logoutType.next(data);
}
  
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  login(authCredentials) {
    return this.http.post(AppSettings.API_ENDPOINT + 'login', authCredentials,this.noAuthHeader);
  }
  
  verifycode(code) {
    return this.http.post(AppSettings.API_ENDPOINT + 'verifyUser', code,this.noAuthHeader);
  }
  confirmNewPassword(newPassword) {
    return this.http.post(AppSettings.API_ENDPOINT + 'confirmPassword', newPassword,this.noAuthHeader);
  }
  forgotPassword(email) {
    return this.http.post(AppSettings.API_ENDPOINT + 'forgotPassword', email,this.noAuthHeader);
  }
  validateFogetToken(token) {
    return this.http.post(AppSettings.API_ENDPOINT + 'validateFogetToken', token,this.noAuthHeader);
  }
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }
  setUserDetails(data:any){
    localStorage.setItem('userDetails',  JSON.stringify(data));
  }
  setofflineBookMarks(data:any){
    localStorage.setItem('bookmarks',  JSON.stringify(data));
  }
  getofflineBookMarks(){
    let details = localStorage.getItem('bookmarks');
    return JSON.parse(details);
  }
  setPosts(data:any){
    localStorage.setItem('posts',  JSON.stringify(data));
  }
  getPosts(){
    let details = localStorage.getItem('posts');
    return JSON.parse(details);
  }
  getUserDetails(){
    let details = localStorage.getItem('userDetails');
    return JSON.parse(details);
  }

  getcategories() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'categories');
  }

  getComments(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'getComments/'+id);
  }
  getlistPosts() {
    return this.http.get(AppSettings.API_ENDPOINT  + 'listPosts');
  }
  getToken() {
    return localStorage.getItem('token');
  }
  deleteUserDetails() {
    localStorage.removeItem('userDetails');
  }
  deleteToken() {
    localStorage.removeItem('token');
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

  registerUser(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'register',jsonPayload,this.noAuthHeader);
  }

  updateUser(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'updateUser',jsonPayload);
  }

  updateSocial(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'updateSocial',jsonPayload);
  }

  createPost(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'createPost',jsonPayload);
  }

  resendCode(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'resendCode',jsonPayload);
  }

  registrationCheck(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'registrationCheck',jsonPayload);
  }
  addComments(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'addComments',jsonPayload);
  }

  bookmarkPost(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'bookmarkPost',jsonPayload);
  }

  listBookmarks(id):Observable<any>{
    return this.http.get(AppSettings.API_ENDPOINT  + 'listBookmarks/'+id);
  
  }
  deleteBookMark(id):Observable<any>{
    return this.http.get(AppSettings.API_ENDPOINT  + 'deleteBookMark/'+id);
  
  }
  sendMessage(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'sendMessage',jsonPayload);
  }
  getRecivedMessage(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'getRecivedMessage/'+id);
  }
  sentMessage(id) {
    return this.http.get(AppSettings.API_ENDPOINT  + 'sentMessage/'+id);
  }
  deleteMessage(jsonPayload):Observable<any>{
    return this.http.post(AppSettings.API_ENDPOINT + 'deleteMessage',jsonPayload);
  }
  
}