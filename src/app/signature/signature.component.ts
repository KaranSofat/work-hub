import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements OnInit {

  constructor(private loginService: LoginService,private toastr: ToastrService,private ngxService: NgxUiLoaderService) { }
  public data = {signature:'',userId:''};
  userDetails:any
  ngOnInit() {
    this.userDetails = this.loginService.getUserDetails();
    this.data.signature =  this.userDetails.signature;
   
  }
  
  createSignature(){

    if(!this.data.signature){
      this.toastr.error('Field should not be empty.');
  }else{
    this.ngxService.start()
    this.data.userId = this.userDetails.id 
    this.loginService.createSignature(this.data).subscribe(
      res => {

        let signature = this.data.signature;
        this.userDetails.signature = signature;
        this.loginService.setUserDetails(this.userDetails);

        this.toastr.success('Signature Updated succesfully.');
        this.ngxService.stop()
      },
      err => {
        this.ngxService.stop();
        this.toastr.error('Internal Server error.');
      }
    );
  }
}

}
