import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NavigationEnd,Router } from "@angular/router";
import {filter} from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginService } from "./../services/login.service";
declare var $ :any;
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  signinForm: FormGroup;
  forgotPassForm: FormGroup;
  newPasswordForm:FormGroup;
  public loginData = { email:'',  password: '',rememberme:'' };
  public forgotPass = { email:'' };
  public code = {verifyCodes:'',email:'',password:''}
  submitted = false;
  modalRef: BsModalRef | null;
  modalRefForgot =  null;
  modalRefConfirmEmail = null;
  serverErrorMessages:"";
  isLoggedIn:any;
  submittedForget = false;
  unreadMessage:'';
  notifications:any;
  notificationsList:'';
  intervalId:any;
  constructor(private _cookieService:CookieService,private toastr: ToastrService,private modalService: BsModalService,private router : Router, private ngxService: NgxUiLoaderService, private formBuilder: FormBuilder,  private loginService: LoginService,) { 
    this.subscribeRouterEvents();
    let cookies = String(_cookieService.get('remember'));

    if(cookies == "true") {
      
      this.loginData.email=this._cookieService.get('username');
      this.loginData.password=this._cookieService.get('password');
      this.loginData.rememberme=this._cookieService.get('remember');
   }
  }
  subscribeRouterEvents = () => {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if(this.signinForm){
        this.signinForm.reset();
      }
   
      this.isLoggedIn = this.loginService.isLoggedIn(); 
          
      let userDetails = this.loginService.getUserDetails();
      if(userDetails){
        this.getUnreadMessage(userDetails.id);
        this.getNotifications(userDetails.id); 
      }
  
    });
  }

  ngOnInit() {
    let userDetails = this.loginService.getUserDetails();
    if(userDetails){
      this.intervalId = setInterval(() => {
        this.getUnreadMessage(userDetails.id);
        this.getNotifications(userDetails.id); 
      }, 20000);
    }
    
 
    this.signinForm = this.formBuilder.group({    
             username: ['', [Validators.required]],
             password: ['', [Validators.required]],
             remember:['']
         });
         this.forgotPassForm = this.formBuilder.group({    
          forgotPassw: ['', [Validators.required]]
      });
      this.newPasswordForm = this.formBuilder.group({    
        codeVerification: ['', [Validators.required]]
    });

   }


   
   signup(){
     if(this.modalRef){
      this.modalRef.hide();
     }

     this.router.navigateByUrl('/signup');
   }
   login(template: any){
  
    this.submitted = true;
    if (this.signinForm.invalid) {
          this.toastr.error('Please fill valid fields');
             return;
     }
     this._cookieService.put('username',this.loginData.email);
     this._cookieService.put('password',this.loginData.password);
     this._cookieService.put('remember',this.loginData.rememberme);

     this.ngxService.start()
 
         this.loginService.login(this.loginData).subscribe(
      res => {
       
      this.ngxService.stop();
      this.toastr.success('Hi! You are LoggedIn..');
       this.loginService.setUserDetails(res['userDetails'])
        this.loginService.setToken(res['success']['token']);
    
        this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["/"])); 
        if(this.modalRef){
          this.modalRef.hide();
         }
      },
      err => {
      if(err.error.error == "inActive"){
        this.modalRefConfirmEmail = this.modalService.show(template);
      }else{
        this.toastr.error('Invalid username/password.');
      }
      this.ngxService.stop();
  
        
      }



    );
     
    
   }

   ngAfterViewInit() {
    this.loginService.updateMessage$.subscribe((data) => {
    
      let userDetails = this.loginService.getUserDetails();
      if(userDetails){
        this.getUnreadMessage(userDetails.id)
      }
     

    });
    // let userDetails = this.loginService.getUserDetails()
    // if(userDetails){
    //   this.getUnreadMessage(userDetails.id);
    //   this.getNotifications(userDetails.id);
      
    // }
   }
   getNotifications(id){
    this.loginService.deleteNotifications(id).subscribe(

      res => {
        this.loginService.notifications(id).subscribe(
          res => {
            let seenArr = []
            this.notificationsList = res['success'];
   
            for(var i=0; i< this.notificationsList.length; i++){
              if(this.notificationsList[i]['seen'] == 0){
                seenArr.push(this.notificationsList[i]);
              }
              if(this.notificationsList[i]["type"] == "livePost"){
                this.notificationsList[i]["type"] = "Your post is live now."
              }
              if(this.notificationsList[i]["type"] == "commentAdded"){
                this.notificationsList[i]["type"] = "A comment is added on your post."
              }
              if(this.notificationsList[i]["type"] == "messageComing"){
                this.notificationsList[i]["type"] = "You have recieved new message."
              }
            }
            if(seenArr.length == 0){
              this.notifications = "";
            }else{
              this.notifications =seenArr.length;
            }
         
      
          },
          err => { 
          }
        )
      },
      err => {
     
        
      }
    );

   
   }
   notificationSeen(){
    let userDetails = this.loginService.getUserDetails()
    let data = {userId:userDetails.id}
    this.loginService.messageSeen(data).subscribe(
      res => {
        this.notifications = "";
      
      },
      err => {
     
        
      }
    );
   }
   
   getUnreadMessage(id){

    this.loginService.getUnreadMessage(id).subscribe(
      res => {
        if(res['success'].length == 0){
          this.unreadMessage = "";
        }else{
          this.unreadMessage = res['success'].length;
        }
     
     this.loginService.setUnreadMessages(this.unreadMessage)
      },
      err => { 
      }
    )
   }
   logout(){
    clearInterval(this.intervalId);
    this.ngxService.start()
    this.loginService.deleteToken();
    this.loginService.deleteUserDetails();
    this.isLoggedIn = false;
    this.loginService.sendLogout(false); 
    this.router.navigate(["/"])
    this.toastr.success('You are successfully logout!!!');
    this.ngxService.stop();
   }
  
   sidebar(event){
    event.stopPropagation();
       $('#contain').toggleClass('hide-sidebar');
   }
   
   loginMobile(template: any){
     this.modalRef = this.modalService.show(template);
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
    this.loginService.forgotPassword(this.forgotPass).subscribe(
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
   verifyCode(){
    this.ngxService.start()
    this.code.email = this.loginData.email;
    this.code.password = this.loginData.password
    this.loginService.verifycode(this.code).subscribe(
      res => {
        this.modalRefConfirmEmail.hide();
        this.toastr.success('You are activated !', 'Success'); 
        this.ngxService.stop();
        this.newPasswordForm.reset();
        this.signinForm.reset();
        this.loginService.setUserDetails(res['userDetails'])
        this.loginService.setToken(res['token']['token']);
        this.router.navigateByUrl('/dashboard', {skipLocationChange: true}).then(()=>
        this.router.navigate(["/"])); 
      },
      err => { 
        this.toastr.error('You enterend wrong code.'); 
        this.ngxService.stop()
      }
    );
    
   }
   cancelConfirmEmail(){
    this.modalRefConfirmEmail.hide();
    this.newPasswordForm.reset();
   }

   cancelForgotEmail(){
    this.modalRefForgot.hide()
    this.forgotPassForm.reset()
   }

   resendCode(){
    this.ngxService.start()
    var email =  {"email":this.loginData.email};
    this.loginService.resendCode(email).subscribe(
      res => {
        this.toastr.success('A verification code is sent to your email/phone number');
      this.ngxService.stop();
      
      },
      err => {
        this.toastr.error('Internal server error.');
      this.ngxService.stop();
      }
    );
   }
   get f() { return this.signinForm.controls; }
   get resetPas() {return this.forgotPassForm.controls;}
   listMessages(){
    this.router.navigateByUrl('/messages');
   }
}
