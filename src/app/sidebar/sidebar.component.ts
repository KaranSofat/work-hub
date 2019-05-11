import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NavigationEnd,Router } from "@angular/router";
import {filter} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
declare var $ :any;
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isLoggedIn:any;
  userDetails:any;
  usersCount: any;
 
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
      if( this.userDetails){
        this.loginService.getUserCount( this.userDetails.id).subscribe(
          res => {
            this.usersCount = res
          },
          err => { 
          
           
            
          }
        )
      }
    
    });
  }

  ngOnInit() {
  if(this.router.url == '/bookmarks'){
    this.selectedCat = "bookmark" 
  }
    this.loginService.logoutType$.subscribe((data) => {

      this.isLoggedIn = data;
    })
   
    
  }
  selectedCategory(type:any){
    this.mobileToggle()
    this.selectedCat = type
    this.loginService.sendData(type); 
    this.router.navigateByUrl('/');
  }
  redirectBookmarks(type){
    this.mobileToggle()
    this.selectedCat = type
    this.router.navigateByUrl('/bookmarks');

  }
  home(type){
    this.mobileToggle()
    this.selectedCat = type
    this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
    this.router.navigate(["/"])); 

  }
  news(type){
    this.mobileToggle()
    this.selectedCat = type
 
    this.router.navigate(["/news"]); 
  }
  mobileToggle(){
    $(window).resize(function() {

      if($(window).width() <= 768) {
          // if larger or equal
          $('#contain').removeClass('hide-sidebar');
      } 
  }).resize();
 
    
  }
}
