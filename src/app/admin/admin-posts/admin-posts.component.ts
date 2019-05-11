import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-admin-posts',
  templateUrl: './admin-posts.component.html',
  styleUrls: ['./admin-posts.component.css']
})
export class AdminPostsComponent implements OnInit {

  constructor(private adminService: AdminService,private modalService: BsModalService,private ngxService: NgxUiLoaderService,private router : Router,private toastr: ToastrService) { }
  listPosts:any;
  totalEntries:any;
  perPage = 10;
  modalRef: BsModalRef | null;
  currentPost="";
  modalRefDel: BsModalRef | null;
  modalRefStatus:BsModalRef | null;
  postStatus = "";
  status= "";
  id:'';
  searchText:'';
  p = 1;
  ngOnInit() {
    this.ngxService.start()
    this.adminService.getListPosts().subscribe(
      res => {
        this.listPosts = res['success'];
        this.ngxService.stop()
        this.totalEntries = this.listPosts.length;
      },
      err => { 
       
        
      }
    )
  }

  viewPostInfo(template: any,post){
    this.currentPost = post
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
 
  }

  deletePost(template:any,id){
    this.id = id
    this.modalRefDel = this.modalService.show(template)
  }
  confirmDelete(){
    this.ngxService.start()
    this.adminService.deletePost(this.id).subscribe(
      res => {
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/posts"]));
        this.modalRefDel.hide();
        this.ngxService.stop()
      },
      err => { 
       
        this.ngxService.stop() 
      }
    )
  }

  changePostStatus(status,template:any,id){
    this.id = id
    this.status = status
    this.postStatus = status
    this.modalRefStatus = this.modalService.show(template)
  }

  confirmChangeStatus(){
    this.ngxService.start()
    this.adminService.changePostStatus( this.id,this.status).subscribe(
      res => {
        this.ngxService.stop()
        this.modalRefStatus.hide();
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/posts"]));
      },
      err => { 
       
        
      }
    )
  }
}


