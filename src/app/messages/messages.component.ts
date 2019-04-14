import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginService } from "./../services/login.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  modalRef: BsModalRef | null;
  modalRef2:BsModalRef
  modalReply:BsModalRef
  userDetails : any;
  getMessages:any;
  currentMessage:any;
  messageForm: FormGroup;
  submittedMessage = false;
  selectedType = "recived";
  messageId  :any;
  public messageData = { title:'',  description: '',fromId:'',toId:'' };
  loggedInDetails:any;
  constructor(private modalService: BsModalService,private loginService: LoginService,private formBuilder: FormBuilder,private router : Router, private ngxService: NgxUiLoaderService,private toastr: ToastrService) {}
 
  viewMessage(template: any,message) {
  this.currentMessage = message;
   this.modalRef = this.modalService.show(
    template,
    Object.assign({}, { class: 'gray modal-lg' })
  );
   
  }
  deleteMessage(template: any,message){
    this.messageId = message.messageId
    this.modalRef2 = this.modalService.show(template);
  }
  replyMessage(template: any,message){
    this.currentMessage = message;
    this.modalReply = this.modalService.show(template);

  }
  

  ngOnInit() {
    this.loggedInDetails = this.loginService.getUserDetails();
    this.messageForm = this.formBuilder.group({    
      title: ['',[Validators.required]],
      description: ['',[Validators.required]],
     
  });
    this.userDetails = this.loginService.getUserDetails();
    this.loginService.getRecivedMessage( this.userDetails.id).subscribe(
      res => {
      this.getMessages = res['success']
      },
      err => { 
      
      
        
      }
    )
  }
  sendMessage(){
    
    this.submittedMessage = true;
    if (this.messageForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
    }
    this.ngxService.start();
    this.messageData.fromId = this.loggedInDetails.id;
    this.messageData.toId = this.currentMessage.id;
    this.loginService.sendMessage(this.messageData).subscribe((result) => {
      this.toastr.success('Message Sent Succesfully.');
      
      this.modalReply.hide();
    },
    err => {
      this.toastr.error('Internal Server Error.', 'Create Post');
    this.ngxService.stop();

      
    }) 
   }

   messagesType(type){
    if(type == "recived"){
      this.selectedType = "recived";
      this.ngxService.start();
      this.loginService.getRecivedMessage( this.userDetails.id).subscribe(
        res => {
        this.getMessages = res['success'];
        this.ngxService.stop();
        },
        err => { 
        
          this.ngxService.stop();
          
        }
      )
    }
    else{
      this.selectedType = "sent";
      this.ngxService.start();
      this.loginService.sentMessage( this.userDetails.id).subscribe(
        res => {
        this.getMessages = res['success'];
        this.ngxService.stop();
        },
        err => { 
        
          this.ngxService.stop();
          
        }
      )


    }
   }
   get fMessage() { return this.messageForm.controls; }

   confirmDelete(){
    this.ngxService.start();
    this.loginService.deleteMessage({messageId:this.messageId,userId:this.userDetails.id}).subscribe((result) => {
      this.toastr.success('Message deleted Succesfully.');
      this.ngxService.stop();
      this.modalReply.hide();
    },
    err => {
      this.toastr.error('Internal Server Error.', 'Create Post');
    this.ngxService.stop();

      
    }) 
    
   }

}
