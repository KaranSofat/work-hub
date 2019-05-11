import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  userDetails:any;
  socialForm: FormGroup;
  submitted = false;
  public socialFormData = { fb:'',  link: "" ,id:''};
  constructor(private loginService: LoginService,private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService,private toastr: ToastrService) { }

  ngOnInit() {
    this.userDetails = this.loginService.getUserDetails();
    this.socialForm = this.formBuilder.group({    
      fb: ['', [Validators.required]],
      link: ['', [Validators.required]],
  });
  }

  update(){
    this.submitted = true;
    if (this.socialForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
 }
    this.ngxService.start()
    this.socialFormData.id = this.userDetails.id
    this.loginService.updateSocial(this.socialFormData).subscribe((result) => {
      this.ngxService.stop();
      this.userDetails.fb_url = this.socialFormData.fb
      this.userDetails.link_url = this.socialFormData.link
      this.toastr.success('Details upated successfully.');
     }, (err) => {
      this.toastr.error('Internal Server Error.');
      this.ngxService.stop()
     });
  }
  get f() { return this.socialForm.controls; }
}
