import { Component, OnInit } from '@angular/core';
import { AdminService } from "./../admin/services/admin.service";
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd,Router } from "@angular/router";
import {filter} from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})

export class AdminLoginComponent implements OnInit {
  signinForm: FormGroup;
  submitted = false
  modalRefForgot =  null;
  forgotPassForm: FormGroup;
  submittedForget = false
  public loginData = { email:'',  password: '',rememberme:'' };
  public forgotPass = { email:'' };
  constructor(private toastr: ToastrService,private modalService: BsModalService,private router : Router, private ngxService: NgxUiLoaderService, private formBuilder: FormBuilder,  private adminService: AdminService,) {} 

  ngOnInit() {
    this.forgotPassForm = this.formBuilder.group({    
      forgotPassw: ['', [Validators.required]]
  });
    this.signinForm = this.formBuilder.group({    
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember:['']
  });
  }
  cancelForgotEmail(){
    this.modalRefForgot.hide()
    this.forgotPassForm.reset()
   }

  login(){
    console.log(this.loginData.rememberme)
   this.submitted = true;
   if (this.signinForm.invalid) {
         this.toastr.error('Please fill valid fields');
            return;
    }


    this.ngxService.start()

        this.adminService.login(this.loginData).subscribe(
     res => {
      this.adminService.setAdminDetails(res['userDetails'])
      this.adminService.setToken(res['success']['token']);
     this.ngxService.stop();
       this.router.navigate(["admin/dashboard"]); 
     },
     err => {
      this.toastr.error("Invalid Login Details....");
     this.ngxService.stop();
     }
   );

    }

    forgotPassword(template: any){
      this.modalRefForgot = this.modalService.show(template);
     }
     confirmForgotPass(){
       this.submittedForget = true;
      if (this.forgotPassForm.invalid) {
        this.toastr.error('Please fill valid fields');
           return;
   }
      this.ngxService.start()
      this.adminService.forgotPassword(this.forgotPass).subscribe(
        res => {
          this.toastr.success('A link is sent to your registerd email id.'); 
          this.ngxService.stop();
          this.forgotPassForm.reset()
          this.modalRefForgot.hide()
        },
        err => { 
          this.toastr.error('You enterend wrong email.'); 
          this.ngxService.stop()
        }
      );
     }




     get resetPas() {return this.forgotPassForm.controls;}
  get f() { return this.signinForm.controls; }

}
