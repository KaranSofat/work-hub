import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from "./../services/login.service";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
signupForm: FormGroup;
public files: any[];
profileImg :any;
categories:any;
show: boolean;
public signupData = { name:'',  lname: '',password:'',email:'',c_password:'',phone:'',file:'' };
submitted = false;
 constructor(private toastr: ToastrService,private router : Router, private ngxService: NgxUiLoaderService, private formBuilder:FormBuilder,private loginService: LoginService) { }

  ngOnInit() {
   

   this.signupForm = this.formBuilder.group({    
            fname: ['', [Validators.required]],
            lname: ['', [Validators.required]],
             password: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
              email: ['', [Validators.required,Validators.email]],
            
               phone: ['', [Validators.required]],
                 cPass: ['', [Validators.required]],
                 file:['', [Validators.required]],
        });
  }
  onFileChanged(event: any) {
    this.files = event.target.files;
   if(this.files[0].size/1024/1024 > 2){
    this.toastr.error('File size should be less than 2 mb.');
    return;
   }
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      const reader = new FileReader();
      reader.onload = e => this.profileImg = reader.result;

      reader.readAsDataURL(file);
  }
  }
  signup(){
    this.loginService.userData = {"email":this.signupData.email,"password":this.signupData.password}; 
    var id = this.makeid(10);


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
      this.loginService.registerUser(formData).subscribe((result) => {
        this.ngxService.stop();
       this.toastr.success('Verification code is Sent to your registerd mail id.', 'Success');
          this.signupForm.reset();
           var id = this.makeid(10);
          this.router.navigateByUrl('/registerdConfirmation/'+id);
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
   makeid(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < length; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
   get f() { return this.signupForm.controls; }
   password() {
    this.show = !this.show;
}
}
