import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  constructor(private adminService: AdminService, private ngxService: NgxUiLoaderService) { }
  listCounts:any;
  selectedPage = "dashboard";
  listUsers:any;
  listPosts:any;
 
  ngOnInit() {
  
    this.ngxService.start();
    this.adminService.getCount().subscribe(
      res => {
        this.listCounts = res;
        this.ngxService.stop()
       
      },
      err => { 
       
        
      }
    )

    this.ngxService.start()
    this.adminService.getListUsers().subscribe(
      res => {
        this.listUsers = res['success'];
        this.listUsers.sort((val1, val2)=> {return <any> new Date(val2.created_at) - <any> new 
          Date(val1.created_at)})
      //  this.totalEntries = this.listUsers.length;
        
        this.ngxService.stop();
      },
      err => { 
       
        
      }
    )
    this.adminService.getListPosts().subscribe(
      res => {
        this.listPosts = res['success'];
        this.listPosts.sort((val1, val2)=> {return <any> val2.viewsCount - <any> val1.viewsCount})
      },
      err => { 
       
        
      }
    )
  }

}
