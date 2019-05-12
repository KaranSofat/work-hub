import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import {Router, ActivatedRoute, Params} from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
import Giphy from 'giphy-api';
import { $ } from 'protractor';
declare const microlink;
@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {
  postDetails :any
  modalRefShare:BsModalRef | null;
  commentForm: FormGroup;
  postId:any;
  commentsPost:any;
  userDetails:any;
  submitted = false;
  isLoggedIn:any;
  totalComments = ""
  toggled: boolean;
  currentSelectedPost :any;
  submittedMessage = false;
  modalRefMessage:BsModalRef | null;
  messageForm: FormGroup;
  giphyResults="";
  giphySearchTerm="";
  showGiphySearch = false;
  tabSelected="";
  modalRefImage: BsModalRef | null;
  selectedImage="";
  public files: any[];
  url= "";
  public messageData = { title:'',  description: '',fromId:'',toId:'' };
  public commentsData = { comment:'',  postId: '',userId:'' };
  profileImg :any;
  constructor(private toastr: ToastrService,private loginService: LoginService,private activatedRoute: ActivatedRoute,private modalService: BsModalService,private formBuilder: FormBuilder,private ngxService: NgxUiLoaderService,) { 

    this.toggled = false;
   
  }
  

  ngOnInit() {
    this.getGiphyIcons('stickers');
    this.messageForm = this.formBuilder.group({    
      title: ['',[Validators.required]],
      description: ['',[Validators.required]],
     
  });
    this.userDetails = this.loginService.getUserDetails();
    this.isLoggedIn = this.loginService.isLoggedIn();   
    let id = this.activatedRoute.snapshot.paramMap.get('id'); 
    this.postId = id;
    let posts = this.loginService.getPosts();
    this.postDetails = []  
 
    for(var i=0; i<posts.length; i++){
      if(posts[i].postId == id){
     
       
        this.postDetails.push(posts[i]);
        break;
      }
    }
    console.log(this.postDetails)
    this.commentForm = this.formBuilder.group({    
      comment: ['', [Validators.required]],
  });
  this.ngxService.start()
  this.loginService.getComments(this.postId).subscribe(
    res => {


 
      this.commentsPost = res["comments"];
      this.totalComments =  this.commentsPost.length;
      this.postDetails[0].commentsCount = this.totalComments
      this.ngxService.stop();
      let isInserted = res['isInserted'];
      if(isInserted){
        this.postDetails[0].viewsCount = this.postDetails[0].viewsCount + 1;
      }
    },
    err => { 
     
    }
  )


  }
   ngAfterViewChecked() {
        microlink('.link-preview');
      }


  getGiphyIcons(type){
    this.tabSelected = type;
    const giphy = Giphy({apiKey :'m844i7x4OSH3bwEVzGdSCQoRi5cNU3Ml',https:true});
    if(type == "stickers"){
      this.ngxService.start()
    
 
      //   
      giphy.search({api: 'stickers',
      q: 'funny',limit: 20})
        .then(res => {
         
          this.giphyResults = res.data;
          this.ngxService.stop()
        })
        .catch(console.error);
        
        this.ngxService.stop()
    }else{

      this.ngxService.start()
      giphy.trending({limit: 20,
        rating: 'g',
        fmt: 'json'})
        .then(res => {
       
          this.giphyResults = res.data;
          this.ngxService.stop()
        })
        .catch(console.error);
        this.ngxService.stop()
    }

  }
  toggleGiphySearch() {
    this.showGiphySearch = !this.showGiphySearch;
    this.tabSelected = "stickers"
  }
  postShare(template: any){
    if( this.postDetails[0].status == 0){
      this.toastr.error('Your post is inActive state.');
      return;
    }
    this.modalRefShare = this.modalService.show(template);
  }

  comment(){
    if( this.postDetails[0].status == 0){
      this.toastr.error('Your post is inActive state.');
      return;
    }
    if(this.isLoggedIn == false){
      this.toastr.error('Please Logged In to comment the post.');
      return;
    }
    this.submitted = true;
    if (this.commentForm.invalid) {
      this.toastr.error('Please fill valid fields');
         return;
   }
    let UserID = this.userDetails.id;
    this.commentsData.postId =   this.postId;
    this.commentsData.userId =  UserID;
   
    if(UserID ==   this.postDetails[0].userId){
      this.toastr.error('You cannot comment your own post.');
      return;
    }
   // this.ngxService.start()
   let staticCommentData = {
      id:"",
      image: this.userDetails.image,
      lname:this.userDetails.lname,
      name:this.userDetails.name,
      created_date:new Date(),
      comment:this.commentsData.comment
   } 
   this.commentsPost.push(staticCommentData);
    this.loginService.addComments(this.commentsData).subscribe((result) => {
    //  this.commentsPost.push(result["comments"][0]);
      this.totalComments = this.totalComments + 1;
      this.postDetails[0].commentsCount = this.postDetails[0].commentsCount + 1;
     // this.ngxService.stop();
  
      this.commentForm.reset();
      //this.commentForm.pristine = true; 
     // this.commentForm.controls['comment'].setErrors({'incorrect': false});
      
     }, (err) => {
     
      
     });
  }
  get f() { return this.commentForm.controls; }

  bookMarkPost(records, event){

    if(this.postDetails[0].status == 0){
      this.toastr.error('Your post is inActive state.');
      return;
    }
   
    let post = records[0];
    event.stopPropagation();

    let userDetails = this.loginService.getUserDetails();
    var arr = []
    if(!userDetails){
    if(this.loginService.getofflineBookMarks() !=null){
      arr = this.loginService.getofflineBookMarks();
      for(var i=0; i<arr.length; i++){
        if(arr[i].postId == post.id){
          this.toastr.error('You already saved this post');
          return;
          break;
        }
      }
    
    }
    arr.push(post);
    this.loginService.setofflineBookMarks(arr);
    this.toastr.success('Post saved succesfully.');
    this.loginService.setofflineBookMarks(arr);
      return;
    }
    this.ngxService.start();
    
    let userId = userDetails.id;
    let postId = post.id;
    let data = {userId:userId,postId:postId};
    this.loginService.bookmarkPost(data).subscribe((result) => {
      this.postDetails[0].bookmarksCount =  this.postDetails[0].bookmarksCount + 1;
    this.toastr.success('Post saved succesfully.');
      this.ngxService.stop();

     }, (err) => {
      this.ngxService.stop();
      this.toastr.error('You already saved this post');
     });

   }
   handleSelection(event) {
     if(this.commentsData.comment == null || !this.commentsData.comment){
      this.commentsData.comment =  event.char;
     }else{
      this.commentsData.comment =  this.commentsData.comment + event.char;
     }
   
    this.toggled = false;
    }
    onShown(event,post){
     console.log(post)
      this.currentSelectedPost = post
     // console.log(this.currentSelectedPost)
     }

   
     message(template: any){
      if(this.postDetails[0].status == 0){
        this.toastr.error('Your post is inActive state.');
        return;
      }
      if(this.userDetails){
       
     if(this.userDetails.id == this.currentSelectedPost.userId){
       this.toastr.error('You cannot send message to yourself.');
       return;
      }
      this.modalRefMessage = this.modalService.show(template);
     }else{
       this.toastr.error('Please login to send the message');
     }
     
    }

    sendMessage(){
    console.log(this.userDetails)
      this.submittedMessage = true;
      if (this.messageForm.invalid) {
        this.toastr.error('Please fill valid fields');
           return;
      }
      this.ngxService.start();
      this.messageData.fromId = this.userDetails.id;
      this.messageData.toId = this.currentSelectedPost.userId;
      console.log(this.messageData)
      this.loginService.sendMessage(this.messageData).subscribe((result) => {
        this.toastr.success('Message Sent Succesfully.');
        this.ngxService.stop();
        this.modalRefMessage.hide();
      },
      err => {
        this.toastr.error('Internal Server Error.');
      this.ngxService.stop();
  
        
      })
  
  
      
     }
     get fMessage() { return this.messageForm.controls; }
     searchGiphy() {
      this.ngxService.start()
      const giphy = Giphy({apiKey :'m844i7x4OSH3bwEVzGdSCQoRi5cNU3Ml',https:true});
      const searchTerm = this.giphySearchTerm;
      //   {api: 'stickers',
  //q: 'funny'}
  if(this.tabSelected == "stickers"){
    giphy.search({api: 'stickers',
    q: searchTerm,limit: 20})
      .then(res => {
       
        this.giphyResults = res.data;
        this.ngxService.stop()
      })
      .catch(console.error);
      
      this.ngxService.stop()
      }
      else{
        giphy.search(searchTerm)
        .then(res => {
          console.log(res);
          this.giphyResults = res.data;
          this.ngxService.stop()
        })
        .catch(console.error);
        
        this.ngxService.stop()
      }
    }

    sendGif(title, url) {
    
      if(this.isLoggedIn == false){
        this.toastr.error('Please Logged In to comment the post.');
        return;
      }
      let UserID = this.userDetails.id;
    this.commentsData.postId =   this.postId;
    this.commentsData.userId =  UserID;
  
    if(UserID ==   this.postDetails[0].userId){
      this.toastr.error('You cannot comment your own post.');
      return;
    }
      url= "<img width=93 src="+ url +">"
      let staticCommentData = {
        id:"",
        image: this.userDetails.image,
        lname:this.userDetails.lname,
        name:this.userDetails.name,
        created_date:new Date(),
        comment:url
     } 
     this.commentsData.comment =  url;
     this.commentsPost.push(staticCommentData);
    this.loginService.addComments(this.commentsData).subscribe((result) => {

      this.totalComments = this.totalComments + 1;
      this.postDetails[0].commentsCount = this.postDetails[0].commentsCount + 1;
      this.showGiphySearch = false;
      this.commentForm.reset();
     }, (err) => {
     
      this.showGiphySearch = false;
     });
    }
  
    openImage(template:any,event,postsImages){
      event.stopPropagation();
      this.modalRefImage= this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));
      this.selectedImage = postsImages
     }

     onFileChanged(event: any) {
       
      this.files = event.target.files;
     if(this.files[0].size/1024/1024 > 2){
      this.toastr.error('File size should be less than 2 mb.');
      return;
     }

     if(this.isLoggedIn == false){
      this.toastr.error('Please Logged In to comment the post.');
      return;
    }
    let UserID = this.userDetails.id;
  this.commentsData.postId =   this.postId;
  this.commentsData.userId =  UserID;

  if(UserID ==   this.postDetails[0].userId){
    this.toastr.error('You cannot comment your own post.');
    return;
  }
   


      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
  
        const reader = new FileReader();
        reader.onload = e => this.profileImg = reader.result;
   
     
        reader.readAsDataURL(file);
    }
    
    const formData = new FormData();
    
   
    setTimeout(()=>{ 
   this.url= "<img width=93 height=93 src="+ this.profileImg +">"

    let staticCommentData = {
      id:"",
      image: this.userDetails.image,
      lname:this.userDetails.lname,
      name:this.userDetails.name,
      created_date:new Date(),
      comment: this.url
   }
   this.commentsPost.push(staticCommentData); 
   for (const file of this.files) {
    formData.append('file', file, file.name);
   
  
  } 
  formData.append('postId', this.postId);
  formData.append('userId', UserID);
  this.loginService.addCommentsImage(formData).subscribe((result) => {

    // this.totalComments = this.totalComments + 1;
    // this.postDetails[0].commentsCount = this.postDetails[0].commentsCount + 1;
   
    // this.commentForm.reset();
   }, (err) => {
   
    //this.showGiphySearch = false;
   });

  },100);

   
  //  

    }
}
