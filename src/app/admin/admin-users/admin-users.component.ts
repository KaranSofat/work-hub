import { Component, OnInit,ChangeDetectionStrategy } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  constructor(private adminService: AdminService,private modalService: BsModalService,private formBuilder:FormBuilder,private ngxService: NgxUiLoaderService,private toastr: ToastrService,private router : Router,) { }
  listUsers:any;
  signupForm: FormGroup;
  updateInfo: FormGroup;
  perPage = 10;
  totalEntries = "";
  currentUser = "";
  modalRef: BsModalRef | null;
  modalRefAdd: BsModalRef | null;
  modalRefUpdate: BsModalRef | null;
  public files: any[];
profileImg :any;
categories:any;
userId:'';
id:'';
searchText:'';
p = 1;
modalRefDel:BsModalRef | null;

 
  public infos = { fname:'',  lname: '',email:'',phone:'',file:'' };
  public signupData = { name:'',  lname: '',password:'',email:'',c_password:'',phone:'',file:'' };
submitted = false;
  ngOnInit() {
    this.updateInfo = this.formBuilder.group({    
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required]],
      file:['', [Validators.required]],
  });
   this.signupForm = this.formBuilder.group({    
    fname: ['', [Validators.required]],
    lname: ['', [Validators.required]],
     password: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
    
       phone: ['', [Validators.required]],
         cPass: ['', [Validators.required]],
         file:['', [Validators.required]],
});
this.ngxService.start()
    this.adminService.getListUsers().subscribe(
      res => {
        this.listUsers = res['success'];
        this.totalEntries = this.listUsers.length;
        
        this.ngxService.stop();
      },
      err => { 
        this.ngxService.stop();
        
      }
    )
  
  }
  
  onFileChanged(event: any) {
    this.files = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.profileImg = reader.result;

      reader.readAsDataURL(file);
  }
  }
  viewUserInfo(template: any,users){
    this.currentUser = users
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
 
  }
  addUser(template: any){
    this.modalRefAdd = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  cancelAddUser(){
    this.signupData.name = "";
    this.signupData.lname = "";
    this.signupData.email = "";
    this.signupData.password = "";
    this.signupData.c_password = "";
    this.signupData.phone = "";
    this.profileImg = "";
this.modalRefAdd.hide();

  }


  signup(){
   


  this.submitted = true;
  if (this.signupForm.invalid) {
         this.toastr.error('Please fill valid fields', 'Signup Error');
            return;
      }
      this.ngxService.start()
      const formData = new FormData();
      for (const file of this.files) {
          formData.append('file', file, file.name);
      }
      formData.append('name', this.signupData.name);
      formData.append('email', this.signupData.email);
      formData.append('password', this.signupData.password);
      formData.append('c_password', this.signupData.c_password);
      formData.append('lname', this.signupData.lname);
      formData.append('phone', this.signupData.phone);
      this.adminService.registerUser(formData).subscribe((result) => {
        this.ngxService.stop();
        this.toastr.success('User added succesfully.');
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/users"]));
          this.signupForm.reset();
          this.modalRefAdd.hide();
          
       }, (err) => {
        try{
          if(err.error.error.email){
            this.toastr.error(err.error.error.email[0], 'SignUp Error');
          }else if(err.error.error.c_password){
            this.toastr.error("password and confirm password does not matched.", 'SignUp Error');
          }else if(err.error.error == "phoneError"){
            this.toastr.error("Provide phone number with country code..", 'Invalid phone number');
          }
          else if(err.error.error.phone){
            this.toastr.error("This phone number is already registerd.", 'Invalid phone number');
          }
        }catch(e){
          this.toastr.error("Internal Server Error.", 'SignUp Error');
        }
        this.ngxService.stop();
        
       });
  }
  get f() { return this.signupForm.controls; }
  get upateF() { return this.updateInfo.controls; }
 
  updateUser(template:any,userDetails){
   
    this.modalRefUpdate = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.infos.fname = userDetails.name;
    this.infos.lname =  userDetails.lname;
    this.infos.email =  userDetails.email;
    this.infos.phone = userDetails.phone;
    this.profileImg =  userDetails.image;

    this.userId = userDetails.id
  }
  update(){
    if(!this.infos.file)
    {
      //this.info.file = this.profileImg
    }
        this.submitted = true;
        if (this.updateInfo.invalid) {
          this.toastr.error('Please fill valid fields');
             return;
       }
       this.ngxService.start()
       const formData = new FormData();
       for (const file of this.files) {
           formData.append('file', file, file.name);
       }
       formData.append('id', this.userId);
       formData.append('name', this.infos.fname);
       formData.append('email', this.infos.email);
       formData.append('lname', this.infos.lname);
       formData.append('phone', this.infos.phone);
       this.adminService.updateUser(formData).subscribe((result) => {
        this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["admin/users"]));
        this.ngxService.stop();
        this.modalRefUpdate.hide();
       this.toastr.success('Your information updated succesfully.', 'Success');
          
       }, (err) => {
        try{
          if(err.error.error.email){
            this.toastr.error(err.error.error.email[0]);
          }else if(err.error.error.c_password){
            this.toastr.error("password and confirm password does not matched.");
          }else if(err.error.error == "phoneError"){
            this.toastr.error("Provide phone number with country code..");
          }
          else if(err.error.error.phone){
            this.toastr.error("This phone number is already registerd.");
          }
        }catch(e){
          this.toastr.error("Internal Server Error.");
        }
        this.ngxService.stop();
        
       });
    
      }
      deleteUser(template:any,id){
        this.id = id
        this.modalRefDel = this.modalService.show(template)
      }
      confirmDelete(){
        this.ngxService.start();
        this.adminService.deleteUser(this.id).subscribe(
          res => {
            this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
            this.router.navigate(["admin/users"]));
            this.modalRefDel.hide();
            this.ngxService.stop();
          },
          err => { 
            this.ngxService.stop();
            
          }
        )
      }

}
