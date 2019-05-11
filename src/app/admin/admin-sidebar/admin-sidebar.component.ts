import { Component, OnInit } from '@angular/core';
import { NavigationEnd,Router } from "@angular/router";
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {
  selectedPage = "dashboard"
  constructor(private router : Router) { }

  ngOnInit() {
  }
  redirectUrl(type){
    if(type == 'dashboard'){
      this.selectedPage = 'dashboard'
      this.router.navigateByUrl('admin/dashboard');
    }
    if(type == 'users'){
      this.selectedPage = 'users'
      this.router.navigateByUrl('admin/users');
    } if(type == 'posts'){
      this.selectedPage = 'posts'
      this.router.navigateByUrl('admin/posts');
    } if(type == 'cat'){
      this.selectedPage = 'cat'
      this.router.navigateByUrl('admin/categories');
    } if(type == 'comments'){
      this.selectedPage = 'comments'
      this.router.navigateByUrl('admin/comments');
    } 
    if(type == 'news'){
      this.selectedPage = 'news'
      this.router.navigateByUrl('admin/news');
    } 
  }
}
