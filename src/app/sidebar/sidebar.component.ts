import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NavigationEnd,Router } from "@angular/router";
import {filter} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isLoggedIn:any;
  userDetails:any;
 
  selectedCat = "home"
  constructor(private loginService: LoginService,private router : Router,public sanitizer: DomSanitizer) { 
    this.subscribeRouterEvents();
  }
  subscribeRouterEvents = () => {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      this.userDetails = this.loginService.getUserDetails();
      this.isLoggedIn = this.loginService.isLoggedIn();   
     
    });
  }

  ngOnInit() {
  if(this.router.url == '/bookmarks'){
    this.selectedCat = "bookmark" 
  }
    this.loginService.logoutType$.subscribe((data) => {
      console.log("asd")
      this.isLoggedIn = data;
    })
  }
  selectedCategory(type:any){
    this.selectedCat = type
    this.loginService.sendData(type); 
    this.router.navigateByUrl('/');
  }
  redirectBookmarks(type){
    this.selectedCat = type
    this.router.navigateByUrl('/bookmarks');

  }
  home(type){
    this.selectedCat = type
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(["/"])); 

  }

}
