import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.css']
})
export class ListPostsComponent implements OnInit {
  listPosts:any;
  selectedCategory:any;
  modalRef: BsModalRef | null;
  editPostTemps: BsModalRef | null;
  postID:"";
  postForm: FormGroup;
  submittedPostForm = false;
  categories:any;
  modalRefImage: BsModalRef | null;
  selectedImage= "";

  public postData = { title:'',  description: '',category:'',file:'',user_id:'' };
  constructor(private loginService: LoginService,private formBuilder:FormBuilder,private ngxService: NgxUiLoaderService,private router : Router,private modalService: BsModalService,private toastr: ToastrService) { }

  ngOnInit() {

    this.loginService.getcategories().subscribe(
      res => {
       this.categories = res['categories'];
       this.ngxService.stop();
     
      },
      err => { 
        this.ngxService.stop();
        
      }
    )
    let userDetails = this.loginService.getUserDetails();

    this.ngxService.start()
    this.loginService.getUserPosts(userDetails.id).subscribe(
      res => {
       this.listPosts = res['posts'];
       this.listPosts.sort((val1, val2)=> {return <any> new Date(val2.date) - <any> new 
        Date(val1.date)})
       this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
    this.postForm = this.formBuilder.group({    
      title: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.minLength(50)]],
       category: ['', [Validators.required]],
  });
  }
  
  details(event,post){
    event.stopPropagation();
    this.router.navigateByUrl('/details/'+post.postId);
   }
   deletePost(template:any,post,event){
    event.stopPropagation();
    this.postID = post.postId
    this.modalRef = this.modalService.show(template);
   }
   confirmDelete(){
     let userDetails = this.loginService.getUserDetails()
    this.ngxService.start();
    this.loginService.deletePost({postId:this.postID,userId:userDetails.id}).subscribe((result) => {
      this.toastr.success('Post deleted Succesfully.');
      this.ngxService.stop();
      this.modalRef.hide();
      for(var i=0; i<this.listPosts.length; i++){
        if(this.listPosts[i].postId = this.postID){
          this.listPosts.splice(i,1);
        }
      }
    },
    err => {
      this.toastr.error('Internal Server Error.', 'Create Post');
    this.ngxService.stop();

      
    }) 
    
   }
   urls = [];
  fileData= [];
  onSelectFile(event) {
    if(event.target.files[0].size/1024/1024 > 2){
      this.toastr.error('File size should be less than 2 mb.');
      return;
     }
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event:any) => {
                  console.log(event.target.result)
                //  console.log(event.target.result);
                   this.urls.push(event.target.result); 
                 
                }
                this.fileData.push(event.target.files[i]); 
                reader.readAsDataURL(event.target.files[i]);
        }
    }
  }
  removeImg(data:any){
    for( var i =0;i<this.urls.length; i++){
      if ( this.urls[i] == data){
        this.urls.splice(i, 1);
        this.fileData.splice(i,1)
        } 
    }

   
  }
   editPost(template:any,post,event){
    event.stopPropagation();
     console.log(post)
     this.postData.title = post.title;
     this.postData.description = post.description;
     this.postData.category = post.category;
     this.urls = post.files;
    // this.postData.title = post.title;

    this.editPostTemps = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
   }


   publishPost(){

   }
   openImage(template:any,event,postsImages){
    event.stopPropagation();
    this.modalRefImage= this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.selectedImage = postsImages
   }
   get postFormControls() { return this.postForm.controls; }
}
