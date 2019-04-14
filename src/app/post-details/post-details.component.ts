import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  postDetails :any
  modalRefShare:BsModalRef | null;
  commentForm: FormGroup;
  postId:any;
  commentsPost:any;
  userDetails:any;
  submitted = false;
  isLoggedIn:any;
  public commentsData = { comment:'',  postId: '',userId:'' };
  constructor(private toastr: ToastrService,private loginService: LoginService,private activatedRoute: ActivatedRoute,private modalService: BsModalService,private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService,) { }

  ngOnInit() {
    this.userDetails = this.loginService.getUserDetails();
    this.isLoggedIn = this.loginService.isLoggedIn();   
    let id = this.activatedRoute.snapshot.paramMap.get('id'); 
    this.postId = id;
    let posts = this.loginService.getPosts();
    this.postDetails = []  
 
    for(var i=0; i<posts.length; i++){
      if(posts[i].postId == id){
        this.postDetails.push(posts[i]);
        break;
      }
    }

    this.commentForm = this.formBuilder.group({    
      comment: ['', [Validators.required]],
  });
  this.ngxService.start()
  this.loginService.getComments(this.postId).subscribe(
    res => {
      this.commentsPost = res["comments"];
      this.ngxService.stop()
    },
    err => { 
     
    }
  )


  }
  postShare(template: any){
    console.log("share")
    this.modalRefShare = this.modalService.show(template);
  }

  comment(){
    if(this.isLoggedIn == false){
      this.toastr.error('Please Logged In to comment the post.');
      return;
    }
    this.submitted = true;
    if (this.commentForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
   }
    let UserID = this.userDetails.id;
    this.commentsData.postId =   this.postId;
    this.commentsData.userId =  UserID;
   
    if(UserID ==   this.postDetails[0].userId){
      this.toastr.error('You cannot comment your own post.');
      return;
    }
    this.ngxService.start()
    this.loginService.addComments(this.commentsData).subscribe((result) => {
      this.commentsPost.push(result["comments"][0]);
      this.ngxService.stop();
      this.commentForm.reset();
     }, (err) => {
     
      
     });
  }
  get f() { return this.commentForm.controls; }

}
