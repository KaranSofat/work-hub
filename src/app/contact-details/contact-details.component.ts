import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  userDetails:any;
  socialForm: FormGroup;

  public socialFormData = { fb:'',  link: "" ,id:''};
  constructor(private loginService: LoginService,private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.userDetails = this.loginService.getUserDetails();
    this.socialForm = this.formBuilder.group({    
      fb: ['', [Validators.required]],
      link: ['', [Validators.required]],
  });
  }

  update(){
    this.socialFormData.id = this.socialFormData.id
    this.loginService.updateSocial(this.socialFormData).subscribe((result) => {
    
     }, (err) => {
      
      
     });
  }

}
