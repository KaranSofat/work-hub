import { Component, OnInit,ViewChild } from '@angular/core';
import { NavigationEnd,Router,ActivatedRoute } from "@angular/router";
import { LoginService } from "./../services/login.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private router : Router,private route: ActivatedRoute,private loginService: LoginService, private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }
  forgetId :any;
  newPasswordForm: FormGroup;
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown: boolean = false;
  public newPassword = { password: '',token:'' };
  ngOnInit() {
    this.newPasswordForm = this.formBuilder.group({    
      newPassword: ['', [Validators.required]]
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
    this.ngxService.start()
    this.newPassword.token = this.forgetId;
    this.loginService.confirmNewPassword(this.newPassword).subscribe(
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

}
