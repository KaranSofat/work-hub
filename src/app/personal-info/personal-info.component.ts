import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoginService } from "./../services/login.service";
import { NavigationEnd,Router } from "@angular/router";
@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit {
  public info = { fname:'',  lname: '',email:'',phone:'',file:'',dob:'',gender:'' };
  updateInfo: FormGroup;
  submitted = false;
  public files: any[];
  profileImg :any;
userDetails:any;
  constructor(private formBuilder:FormBuilder,private toastr: ToastrService,private ngxService: NgxUiLoaderService,private loginService: LoginService,private router : Router) { }
  ngAfterViewInit() {

  }
  ngOnInit() {
    var arr = [];
    this.userDetails =  this.loginService.getUserDetails();

    this.info.fname =  this.userDetails.name;
    this.info.lname =  this.userDetails.lname;
    this.info.email =  this.userDetails.email;
    this.info.phone =  this.userDetails.phone;
    this.info.dob =  this.userDetails.dob;
    this.info.gender =  this.userDetails.gender;
    this.profileImg =  this.userDetails.image;
  //  this.srcToFile('this.profileImg', 'new.png', 'image/png').then(data => {
  //   let response :any;
  //   response = data
  //    arr.push(response)
  //    this.files = arr;
 
  
  //  })
 
    this.updateInfo = this.formBuilder.group({    
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required]],
      file:[''],
      dob:['', [Validators.required]],
      gender:['', [Validators.required]]
  });
  }

//   srcToFile(src, fileName, mimeType){
//     return (fetch(src)
//         .then(function(res){return res.arrayBuffer();})
//         .then(function(buf){return new File([buf], fileName, {type:mimeType});})
//     );
// }

  update(){
if(!this.info.file)
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
   if(this.files){
    for (const file of this.files) {

      formData.append('file', file, file.name);
  }
   }
   
   formData.append('id', this.userDetails.id);
   formData.append('name', this.info.fname);
   formData.append('email', this.info.email);
   formData.append('lname', this.info.lname);
   formData.append('phone', this.info.phone);
   formData.append('email', this.info.email);
   formData.append('gender', this.info.gender);
   formData.append('dob', this.info.dob);
   this.loginService.updateUser(formData).subscribe((result) => {
   
    let userDetails =  this.loginService.getUserDetails();
    userDetails.name = this.info.fname
    userDetails.lname = this.info.lname
    userDetails.phone = this.info.phone
    userDetails.gender = this.info.gender
    userDetails.dob = this.info.dob

    userDetails.email = this.info.email
 
  if(this.info.file !=""){
    let splitted = userDetails.image.split('uploads/');
    let fileupdated =  splitted[0] + 'uploads/'+this.files[0].name
    userDetails.image = fileupdated
  }
 
 this.loginService.setUserDetails(userDetails)
 this.userDetails = this.loginService.getUserDetails();
     this.router.navigateByUrl('dashboard', {skipLocationChange: true}).then(()=>
     this.router.navigate(["/"]));
    this.ngxService.stop();
    
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
  onFileChanged(event: any) {
    this.files = event.target.files;
    if(event.target.files[0].size/1024/1024 > 2){
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
  get f() { return this.updateInfo.controls; }

}
