import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-admin-comments',
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.css']
})
export class AdminCommentsComponent implements OnInit {

  constructor(private adminService: AdminService,private modalService: BsModalService,private router : Router,private ngxService: NgxUiLoaderService) { }
  listComments:"";
  totalEntries:any;
  perPage = 10;
  modalRef: BsModalRef | null;
  currentcomments = "";
  modalRefDel: BsModalRef | null;
  id:'';
  searchText:'';
  p = 1;
  ngOnInit() {
    this.ngxService.start()
    this.adminService.getComments().subscribe(
      res => {
        this.listComments = res['comments'];
      
        this.totalEntries = this.listComments.length;
        this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }

  viewCommentInfo(template: any,comment){
    this.currentcomments = comment
    console.log(this.currentcomments)
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
 
  }
  deleteComment(template:any,id){
    this.id = id
    this.modalRefDel = this.modalService.show(template)
  }
  confirmDelete(){
    this.ngxService.start()
    this.adminService.deleteComment(this.id).subscribe(
      res => {

        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/comments"]));
        this.modalRefDel.hide();
        this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }

}
