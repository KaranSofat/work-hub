import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginService } from "./../services/login.service";
import {PlatformLocation } from '@angular/common';
import { Observable, Subject,BehaviorSubject,of } from 'rxjs';
declare var $ :any;
modalRef2:BsModalRef

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  originalList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
signinForm: FormGroup;
selectedImage="";
public loginData = { username:'',  password: '', };
public cat = { title:'',  name: '', };
public messageData = { title:'',  description: '',fromId:'',toId:'' };
submitted = false;
submittedMessage = false
catForm: FormGroup;
urlShare = "";
listPosts:any
currentSelectedPost:any;
modalRef: BsModalRef | null;
modalRefImage: BsModalRef | null;
modalRefShare:BsModalRef | null;

modalRefMessage:BsModalRef | null;
categories = "";
loggedInDetails:any;
copyData:any;
messageForm: FormGroup;
  constructor(private toastr: ToastrService,private loginService: LoginService,private modalService: BsModalService,private router : Router, private ngxService: NgxUiLoaderService, private formBuilder: FormBuilder,) { }

  ngOnInit() {
   
 this.loggedInDetails = this.loginService.getUserDetails();
    this.catForm = this.formBuilder.group({    
      title: ['',[Validators.required]],
      name: ['',[Validators.required]],
     
  });
  this.messageForm = this.formBuilder.group({    
    title: ['',[Validators.required]],
    description: ['',[Validators.required]],
   
});
    this.ngxService.start()
    this.loginService.getlistPosts().subscribe(
      res => {
       this.listPosts = res['posts'];
       this.loginService.setPosts(this.listPosts);
       for(var i=0; i<this.listPosts.length; i++){
       
         if(this.listPosts[i].status == 0){
         
          this.listPosts.splice(i,1);
         }
       }
     
       this.listPosts.sort((val1, val2)=> {return <any> new Date(val2.date) - <any> new 
        Date(val1.date)})

       this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )

    

    this.loginService.getcategories().subscribe(
      res => {
       this.categories = res['categories'];
       this.ngxService.stop();
      },
      err => { 
        this.ngxService.stop();
        
      }
    )
  }


  ngAfterViewInit(){
  
    this.loginService.categoryType$.subscribe((data) => {
      var arr = []
      let posts =  this.loginService.getPosts();
      for(var j=0; j<posts.length; j++){
        if(posts[j].categoryName  == data){
          arr.push(posts[j])
        }
      }
     
     this.listPosts = arr

   });
  
  }
  details(event,post){
    event.stopPropagation();
    this.router.navigateByUrl('/details/'+post.postId);
   }
   createThread(){
     this.submitted = true;
    if (this.catForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
   }
   let title = this.cat.title
   let cat = this.cat.name
    this.router.navigateByUrl('/createPost/'+title+'/'+cat);
  }


  openShare(template: any,event,post){
    this.urlShare  = location.origin + '/details/'+post.postId;


    event.stopPropagation();
    this.modalRefShare = this.modalService.show(template);
   }

   bookMarkPost(post, event){
    event.stopPropagation();
   
    let userDetails = this.loginService.getUserDetails();
    var arr = []
    if(!userDetails){
    if(this.loginService.getofflineBookMarks() !=null){
      arr = this.loginService.getofflineBookMarks();
      for(var i=0; i<arr.length; i++){
        if(arr[i].postId == post.id){
          this.toastr.error('You already saved this post');
          return;
          break;
        }
      }
    
    }
    arr.push(post);
    this.loginService.setofflineBookMarks(arr);
    this.toastr.success('Post saved succesfully.');
    this.loginService.setofflineBookMarks(arr);
      return;
    }
    this.ngxService.start();
    
    let userId = userDetails.id;
    let postId = post.id;
    let data = {userId:userId,postId:postId};
    this.loginService.bookmarkPost(data).subscribe((result) => {
    this.toastr.success('Post saved succesfully.');
      this.ngxService.stop();
      for(var i=0; i<this.listPosts.length; i++){
        if(this.listPosts[i].postId == post.postId){
          this.listPosts[i].bookmarksCount =  this.listPosts[i].bookmarksCount + 1;
        }
      }
     }, (err) => {
      this.ngxService.stop();
      this.toastr.error('You already saved this post');
     });

   }
   get f() { return this.catForm.controls; }
   get fMessage() { return this.messageForm.controls; }

   message(template: any){
     if(this.loggedInDetails){
      
    if(this.loggedInDetails.id == this.currentSelectedPost.userId){
      this.toastr.error('You cannot send message to yourself.');
      return;
     }
     this.modalRefMessage = this.modalService.show(template);
    }else{
      this.toastr.error('Please login to send the message');
    }
    
   }
   onShown(event,post){
     
    this.currentSelectedPost = post
   // console.log(this.currentSelectedPost)
   }

   sendMessage(){
    
    this.submittedMessage = true;
    if (this.messageForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
    }
    this.ngxService.start();
    this.messageData.fromId = this.loggedInDetails.id;
    this.messageData.toId = this.currentSelectedPost.userId;
    this.loginService.sendMessage(this.messageData).subscribe((result) => {
      this.toastr.success('Message Sent Succesfully.');
      this.ngxService.stop();
      this.modalRefMessage.hide();
    },
    err => {
      this.toastr.error('Internal Server Error.');
    this.ngxService.stop();

      
    })


    
   }

   openImage(template:any,event,postsImages){
    event.stopPropagation();
    this.modalRefImage= this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.selectedImage = postsImages
   }
}
