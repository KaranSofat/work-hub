import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css']
})
export class AdminNewsComponent implements OnInit {
  listNews:"";
  totalEntries:any;
  perPage = 10;
  modalRef: BsModalRef | null;
  modalRefNews: BsModalRef | null;
  currentNews = "";
  postForm: FormGroup;
  submittedPostForm = false;
  userDetails:any;
  categories:any;
  modalRefDel: BsModalRef | null;
  id:"";
  searchText:'';
  p = 1;
  public postData = { title:'',  description: '',category:'',file:'',user_id:'' };
  constructor(private adminService: AdminService,private modalService: BsModalService,private formBuilder:FormBuilder,private router : Router,private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }

  ngOnInit() {
    this.ngxService.start()
    this.adminService.getNews().subscribe(
      res => {
        this.listNews = res['news'];
        this.ngxService.stop()
        this.totalEntries = this.listNews.length;
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
    this.postForm = this.formBuilder.group({    
      title: ['', [Validators.required]],
      description: ['', [Validators.required,Validators.minLength(50)]],
     
  });
  }

  viewNewsInfo(template: any,news){
    this.currentNews = news
 
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
 
  }
  addNews(template:any){
    this.modalRefNews = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );

  }

  urls = [];
  fileData= [];
  onSelectFile(event) {
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
    
         return;
   }

    const formData = new FormData();
    if( this.fileData &&  this.fileData.length){
      for (var i = 0; i < this.fileData.length; i++) { 
        formData.append("fileUpload"+i, this.fileData[i]);
      }
    }
    formData.append('title', this.postData.title);
    formData.append('description', this.postData.description);

    this.ngxService.start()
   
    this.adminService.createNews(formData).subscribe((result) => {
      this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/news"]));
      this.toastr.success('News added succesfully..');
      this.modalRef.hide();
      this.ngxService.stop()
      
    },
    err => {
   
      this.ngxService.stop()
      
    })
  }
  get postFormControls() { return this.postForm.controls; }

  deleteNews(template:any,id){
    this.id = id
    this.modalRefDel = this.modalService.show(template)
  }
  confirmDelete(){
    this.ngxService.start()
    this.adminService.deleteNews(this.id).subscribe(
      res => {
        this.ngxService.stop()
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/news"]));
        this.modalRefDel.hide();
        this.toastr.success('News deleted succesfully..');
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }





}
