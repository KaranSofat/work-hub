import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NavigationEnd,Router,ActivatedRoute, Params } from "@angular/router";
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  postForm: FormGroup;
  submittedPostForm = false;
  userDetails:any;
  categories:any;
  catName="";
  public postData = { title:'',  description: '',category:'',file:'',user_id:'' };
  constructor(private loginService: LoginService, private formBuilder:FormBuilder,private activatedRoute: ActivatedRoute,private router : Router,private toastr: ToastrService,private ngxService: NgxUiLoaderService,) { }

  ngOnInit() {
    let title = this.activatedRoute.snapshot.paramMap.get('title'); 
    let cat = this.activatedRoute.snapshot.paramMap.get('cat'); 
   
   
      this.postData.title =  title
      this.postData.category = cat

 
    this.ngxService.start();
    this.loginService.getcategories().subscribe(
      res => {
       this.categories = res['categories'];
       this.ngxService.stop();
       this.checkCategories(this.categories, this.postData.category)
      },
      err => { 
        this.ngxService.stop();
        
      }
    )
    this.userDetails = this.loginService.getUserDetails();
    this.postForm = this.formBuilder.group({    
      title: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.minLength(50)]],
       category: ['', [Validators.required]],
  });
  }
  checkCategories(categories,postCat){

   
    for(var i=0; i<categories.length; i++){
      if(categories[i].id ==  postCat)
      {
        this.catName = categories[i].name;
        break;
      }
    }

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

  publishPost(){
    this.submittedPostForm  = true;
    if (this.postForm.invalid) {
      this.toastr.error('Please fill valid fields', 'Create Post');
         return;
   }
   this.postData.user_id = this.userDetails.id;
    const formData = new FormData();
    if( this.fileData &&  this.fileData.length){
      for (var i = 0; i < this.fileData.length; i++) { 
        formData.append("fileUpload"+i, this.fileData[i]);
      }
    }
    formData.append('title', this.postData.title);
    formData.append('description', this.postData.description);
    formData.append('category', this.postData.category);
    formData.append('user_id', this.postData.user_id);
    this.ngxService.start()
    this.loginService.createPost(formData).subscribe((result) => {
      this.toastr.success('Post Created Succesfully.', 'Create Post');
      this.postForm.reset();
      this.ngxService.stop();
      this.router.navigate(["/postPublished"]); 
      
    },
    err => {
      this.toastr.error('Internal Server Error.', 'Create Post');
    this.ngxService.stop();

      
    })
  }
  get postFormControls() { return this.postForm.controls; }

  selectCategories(){
    this.checkCategories(this.categories, this.postData.category);
  }
}
