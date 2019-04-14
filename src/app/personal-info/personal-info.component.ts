import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from "./../services/login.service";
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  public info = { fname:'',  lname: '',email:'',phone:'',file:'' };
  updateInfo: FormGroup;
  submitted = false;
  public files: any[];
  profileImg :any;
userDetails:any;
  constructor(private formBuilder:FormBuilder,private toastr: ToastrService,private ngxService: NgxUiLoaderService,private loginService: LoginService) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    this.userDetails =  this.loginService.getUserDetails();

    this.info.fname =  this.userDetails.name;
    this.info.lname =  this.userDetails.lname;
    this.info.email =  this.userDetails.email;
    this.info.phone =  this.userDetails.phone;
    this.profileImg =  this.userDetails.image;

    this.updateInfo = this.formBuilder.group({    
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required]],
      file:['', [Validators.required]],
  });
  }

  update(){
if(!this.info.file)
{
  //this.info.file = this.profileImg
}
    this.submitted = true;
    if (this.updateInfo.invalid) {
      this.toastr.error('Please fill valid fields', 'Signup Error');
         return;
   }
   this.ngxService.start()
   const formData = new FormData();
   for (const file of this.files) {
       formData.append('file', file, file.name);
   }
   formData.append('id', this.userDetails.id);
   formData.append('name', this.info.fname);
   formData.append('email', this.info.email);
   formData.append('lname', this.info.lname);
   formData.append('phone', this.info.phone);
   this.loginService.updateUser(formData).subscribe((result) => {
    this.ngxService.stop();
    
   this.toastr.success('Your information updated succesfully.', 'Success');
      
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
  onFileChanged(event: any) {
    this.files = event.target.files;
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.profileImg = reader.result;

      reader.readAsDataURL(file);
    }
  }
  get f() { return this.updateInfo.controls; }

}
