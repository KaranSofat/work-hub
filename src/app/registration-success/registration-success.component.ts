import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.css']
})

export class RegistrationSuccessComponent implements OnInit {
  public code = {verifyCodes:'',email:'',password:''};
  newPasswordForm:FormGroup;
  constructor(private loginService: LoginService,private toastr: ToastrService,private ngxService: NgxUiLoaderService,private router : Router, private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.ngxService.start()
    this.loginService.registrationCheck(this.loginService.userData).subscribe((result) => {
      this.ngxService.stop();
     }, (err) => {
     // this.router.navigateByUrl('/error');
      this.ngxService.stop();
      
     });
     this.newPasswordForm = this.formBuilder.group({    
      codeVerification: ['', [Validators.required]]
  });

  }

  confirm(){
    this.ngxService.start()
   this.code.email = this.loginService.userData.email;
   this.code.password = this.loginService.userData.password;
    this.loginService.verifycode(this.code).subscribe(
      res => {
      
       
        this.ngxService.stop();
        this.loginService.setToken(res['token']['token']);
        this.loginService.setUserDetails(res['userDetails'])
        this.toastr.success('You are activated', ' Success'); 
        this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["/"])); 
      },
      err => { 
        this.toastr.error('You enterend wrong code.', ' Error'); 
        this.ngxService.stop()
      }
    );
  }

  resend(){

    this.ngxService.start()
    var email =  {"email":this.loginService.userData.email};
    this.loginService.resendCode(email).subscribe(
      res => {
        this.toastr.success('A verification code is sent to your email/phone number', 'Code Resend');
      this.ngxService.stop();
      
      },
      err => {
        this.toastr.error('Internal server error.', 'Code Error');
      this.ngxService.stop();
      }
    );
  }

}
