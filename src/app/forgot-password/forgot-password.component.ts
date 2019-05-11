import { Component, OnInit,ViewChild } from '@angular/core';
import { NavigationEnd,Router,ActivatedRoute } from "@angular/router";
import { LoginService } from "./../services/login.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from './../helpers/must-match.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private router : Router,private route: ActivatedRoute,private loginService: LoginService, private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }
  forgetId :any;
  newPasswordForm: FormGroup;
  issubmitted = false;
  config = {
    
    ignoreBackdropClick: true
  };
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown: boolean = false;
  public passwordData = { password: '',token:'' };
  ngOnInit() {
    this.newPasswordForm = this.formBuilder.group({    
      newPassword: ['', [Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      confirmPassword: ['', Validators.required]
  }, {
    validator: MustMatch('newPassword', 'confirmPassword')
});
    this.route.params.subscribe(params => {
      this.ngxService.start();
      this.forgetId = params.id;
      this.loginService.validateFogetToken({"token":this.forgetId}).subscribe(
        res => {
          this.isModalShown = true;
          this.ngxService.stop()
        },
        err => {  
          this.router.navigateByUrl('/error');
          this.ngxService.stop()
        }
      );
    })
  }
  onHidden(): void {
    this.isModalShown = false;
  }
  hideModal(): void {
    this.autoShownModal.hide();
  }
  confirmNewPassword(){
    this.issubmitted  = true;
    if (this.newPasswordForm.invalid) {
      this.toastr.error('please fill valid data.');
         return;
   }
    this.ngxService.start()
    this.passwordData.token = this.forgetId;
    this.loginService.confirmNewPassword(this.passwordData).subscribe(
      res => {
        this.toastr.success('Password change succesfully..', 'Reset Password');
        this.isModalShown = false;
        this.ngxService.stop();
        this.router.navigateByUrl('/');
      },
      err => {  
        this.ngxService.stop()
        this.toastr.error('something went wrong.', 'Error.');
      }
    );
    
  }
  get resetPasswordControls() { return this.newPasswordForm.controls; }

}
