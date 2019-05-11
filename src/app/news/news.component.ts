import { Component, OnInit } from '@angular/core';
import { LoginService } from "./../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  listNews:any;
  constructor(private loginService: LoginService,private ngxService: NgxUiLoaderService) { }

  ngOnInit() {
    this.ngxService.start();
    this.loginService.getNews().subscribe(
      res => {
       this.listNews = res['success'];
       this.listNews.sort((val1, val2)=> {return <any> new Date(val2.date) - <any> new 
        Date(val1.date)})

      
       this.ngxService.stop()
      },
      err => { 
        this.ngxService.stop()
        
      }
    )
  }

}
