import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from "@angular/router";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as cloneDeep from 'lodash/cloneDeep';
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
  catName = "";
  public files: any[];
  public postData = { title:'',  description: '',category:'',file:'',user_id:'',postId:'',imageId:'' };
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
    if(post.status == 0){
      this.toastr.error('Your post is inactive state.');
      return;
    }
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
    this.files = event.target.files;
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
                   this.urls.push({postImage:event.target.result}); 
                 
                }
                this.fileData.push(event.target.files[i]); 
                reader.readAsDataURL(event.target.files[i]);
        }
        setTimeout(()=>{ 
        const formData = new FormData();
        for (const file of this.files) {
          formData.append('file', file, file.name);
        } 
        formData.append('postId', this.postData.postId);
        this.ngxService.start()
        this.loginService.addPostImage(formData).subscribe((result) => {
          this.ngxService.stop()
          this.toastr.success('Image added Succesfully.');
         }, (err) => {
          this.toastr.error('Internal server error.');
          this.ngxService.stop()
         });
        },100);

    }
  }
  removeImg(data:any){
    for( var i =0;i<this.urls.length; i++){
      if ( this.urls[i] == data){
        this.urls.splice(i, 1);
        this.fileData.splice(i,1)
        } 

    }
    if(data.imageId){
      this.ngxService.start()
      this.loginService.deletePostImage(data.imageId).subscribe((result) => {
         this.ngxService.stop()
      this.toastr.success('Image deleted Succesfully.');
       }, (err) => {
         this.toastr.error('Internal server error.');
         this.ngxService.stop()
       });
    }

   
  }
   editPost(template:any,post,event){
    event.stopPropagation();
     console.log(post)
     this.postData.title = post.title;
     this.postData.description = post.description;
     this.postData.category = post.category;
     //this.urls = cloneDeep(post.files);
     this.urls = post.files;
     this.postData.postId = post.postId;
    // this.postData.imageId = post.imageId
    // this.postData.title = post.title;

    this.editPostTemps = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
   }

   getCategoryName(categories,postCat){
    for(var i=0; i<categories.length; i++){
      if(categories[i].id ==  postCat)
      {
       return categories[i].name;
       
      }
    }

  } 

   publishPost(){
    this.submittedPostForm  = true;
    if (this.postForm.invalid) {
      this.toastr.error('Please fill all valid fields');
         return;
   }
   if(this.catName.toLowerCase() == "general" &&  this.urls.length > 0){
    this.toastr.error('Please delete all images before updating with category general.');
    return;
   }
    this.ngxService.start()
     let data = {title:this.postData.title,description:this.postData.description,postId:this.postData.postId,category:this.postData.category};
    this.loginService.updatePost(data).subscribe((result) => {
      this.ngxService.stop();

      for(var i=0; i< this.listPosts.length; i++){
        if(this.listPosts[i].postId == this.postData.postId){
          this.listPosts[i].title = this.postData.title
          this.listPosts[i].description = this.postData.description
          this.listPosts[i].category =  this.postData.category
          this.listPosts[i].categoryName = this.getCategoryName(this.categories, this.postData.category)
          break;
        }
      }
   this.toastr.success('post updated Succesfully.');
    }, (err) => {
      this.toastr.error('Internal server error.');
      this.ngxService.stop()
    });
    this.editPostTemps.hide();
   }
   openImage(template:any,event,postsImages){
    event.stopPropagation();
    this.modalRefImage= this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
    this.selectedImage = postsImages.postImage;
   }
   get postFormControls() { return this.postForm.controls; }
   selectCategories(){

   this.catName =  this.getCategoryName(this.categories, this.postData.category);
   console.log(this.catName)
  }
}
