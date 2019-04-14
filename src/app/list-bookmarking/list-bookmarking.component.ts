import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-list-bookmarking',
  templateUrl: './list-bookmarking.component.html',
  styleUrls: ['./list-bookmarking.component.css']
})
export class ListBookmarkingComponent implements OnInit {
  bookmarks:any;
  modalRef: BsModalRef | null;
  modalRef2:BsModalRef
  bookMarkId: any;
  postId="";
  userDetails:any;
  bookmarksOffline:any;
  constructor(private toastr: ToastrService,private loginService: LoginService,private ngxService: NgxUiLoaderService,private router : Router,private modalService: BsModalService) { }

  ngOnInit() {
   
    this.userDetails = this.loginService.getUserDetails();
    this.bookmarksOffline = this.loginService.getofflineBookMarks();
    if(!this.userDetails){
      this.bookmarks = this.bookmarksOffline;
      return;
    }
    this.ngxService.start()
    this.loginService.listBookmarks(this.userDetails.id).subscribe(
      res => {
       this.bookmarks= res['success'];
   
       this.ngxService.stop()
      },
      err => { 
      
        this.ngxService.stop()
        
      }
    )
  }
  details(event,post){
    event.stopPropagation();
    this.router.navigateByUrl('/details/'+post.id);
   }
   deleteBookmark(event,template: any,bookMarkId,postId){
     this.bookMarkId = bookMarkId;
     this.postId = postId
    event.stopPropagation();
    this.modalRef2 = this.modalService.show(template);
  }

  deleteBookMark(){

    if(!this.userDetails){
      let offline = this.bookmarksOffline;

      for(var i=0; i<this.bookmarksOffline.length; i++){
        if(this.bookmarksOffline[i].postId == this.postId){
          this.bookmarksOffline.splice(i,1); 
          this.modalRef2.hide()
          break;
        }
      }
      this.loginService.setofflineBookMarks(this.bookmarksOffline);
      this.bookmarks =   this.loginService.getofflineBookMarks();
      this.toastr.success('Bookmark deleted succesfully.');
      return;
    }
    this.ngxService.start()
    this.loginService.deleteBookMark(this.bookMarkId).subscribe(
      res => {
        for(var i=0;i<this.bookmarks.length; i++){

          if(this.bookmarks[i].bookMarkId == this.bookMarkId){
            this.bookmarks.splice(i,1); 
          }
        }

        this.modalRef2.hide()
        this.toastr.success('Bookmark deleted succesfully.');
       this.ngxService.stop()
      },
      err => { 
      
        this.ngxService.stop()
        
      }
    )
  }

}
