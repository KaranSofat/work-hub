import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit {
  listPosts:any;
  selectedCategory:any;
  constructor(private loginService: LoginService,private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
   
    console.log(this.selectedCategory)

    this.ngxService.start()
    this.loginService.getlistPosts().subscribe(
      res => {
       this.listPosts = res['posts'];
       this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }
  
}
