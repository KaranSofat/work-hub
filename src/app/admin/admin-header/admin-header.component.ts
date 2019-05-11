import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../services/admin.service";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
declare var $ :any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd,Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {
  adminDetails:any;
  modalRefUpdate: BsModalRef | null;
  updateInfo: FormGroup;
  profileImg:any;
  submitted = false;
  userDetails:any;
    public files: any[];
  public infos = { fname:'',  lname: '',email:'',phone:'',file:'',userId:'' };
  constructor(private adminService: AdminService,private modalService: BsModalService,private formBuilder:FormBuilder,private ngxService: NgxUiLoaderService,private toastr: ToastrService,private router : Router,) { }

  ngOnInit() {
    $(window).resize(function() {
   console.log
      if($(window).width() <= 567) {
          // if larger or equal
          $('#contain').addClass('hide-sidebar-admin');
      } 
  }).resize();
    this.userDetails = this.adminService.getAdminDetails();
    this.updateInfo = this.formBuilder.group({    
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required]],
      file:['', [Validators.required]],
  });
    this.adminDetails =   this.adminService.getAdminDetails()
  }
  sidebarToggle(){


       $('#contain').toggleClass('hide-sidebar-admin');
   }
   logout(){
    
    this.adminService.deleteToken();
    this.adminService.deleteAdminDetails();
  
    this.router.navigate(["admin/loginAdministrator"])
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
   settings(template:any){
    this.modalRefUpdate = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.infos.fname = this.userDetails.name;
    this.infos.lname =  this.userDetails.lname;
    this.infos.email =  this.userDetails.email;
    this.infos.phone = this.userDetails.phone;
    this.profileImg =  this.userDetails.image;

    this.infos.userId = this.userDetails.id

   }
   get upateF() { return this.updateInfo.controls; }

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
       formData.append('id', this.infos.userId);
       formData.append('name', this.infos.fname);
       formData.append('email', this.infos.email);
       formData.append('lname', this.infos.lname);
       formData.append('phone', this.infos.phone);
    
  

       this.adminService.updateUser(formData).subscribe((result) => {
        let AdminDetails = this.adminService.getAdminDetails();
        AdminDetails.name = this.infos.fname
         AdminDetails.lname = this.infos.lname
         AdminDetails.phone = this.infos.phone
 
        AdminDetails.email = this.infos.email
      let splitted = AdminDetails.image.split('uploads/');
     let fileupdated =  splitted[0] + 'uploads/'+this.files[0].name
     AdminDetails.image = fileupdated
     this.adminService.setAdminDetails(AdminDetails)
     this.adminDetails = this.adminService.getAdminDetails();
        // this.router.navigateByUrl('admin/dashboard', {skipLocationChange: true}).then(()=>
        // this.router.navigate(["admin/users"]));
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
   
}
