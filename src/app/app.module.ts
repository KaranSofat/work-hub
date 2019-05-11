import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ShareButtonModule } from '@ngx-share/button';
import { ModalModule } from 'ngx-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { MessagesComponent } from './messages/messages.component';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { CreatePostComponent } from './create-post/create-post.component';
import { ComingsoonComponent } from './comingsoon/comingsoon.component';
import { LoginService } from "./services/login.service";
import { AdminService } from "./admin/services/admin.service";
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
import { AuthGuardAdmin } from './auth/auth.guard.admin';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NumberDirective } from './directives/numbers-only.directive';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { ListPostsComponent } from './list-posts/list-posts.component';
import { ThankYouPostComponent } from './thank-you-post/thank-you-post.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ListBookmarkingComponent } from './list-bookmarking/list-bookmarking.component';
import {NgxPopperModule} from 'ngx-popper';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import {TimeAgoPipe} from 'time-ago-pipe';
import  {  NgxEmojiPickerModule  }  from  'ngx-emoji-picker';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminHeaderComponent } from './admin/admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin/admin-sidebar/admin-sidebar.component';
import { AdminHomeComponent } from './admin/admin-home/admin-home.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminPostsComponent } from './admin/admin-posts/admin-posts.component';
import { AdminCateogryComponent } from './admin/admin-cateogry/admin-cateogry.component';
import { AdminCommentsComponent } from './admin/admin-comments/admin-comments.component';
import { AdminNewsComponent } from './admin/admin-news/admin-news.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { TruncateModule } from 'ng2-truncate';
import { NgxEditorModule } from 'ngx-editor';
import { SignatureComponent } from './signature/signature.component';
import { NewsComponent } from './news/news.component';
import { FooterComponent } from './footer/footer.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  fgsType: SPINNER.threeStrings,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 2, // progress bar thickness
};
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    HomeComponent,
    DashboardComponent,
    PostDetailsComponent,
    SignupComponent,
    SettingsComponent,
    MessagesComponent,
    CreatePostComponent,
    ComingsoonComponent,
    ForgotPasswordComponent,
    ErrorPageComponent,
    NumberDirective,
    SiteLayoutComponent,
    RegistrationSuccessComponent,
    ListPostsComponent,
    ThankYouPostComponent,
    PersonalInfoComponent,
    ContactDetailsComponent,
    ListBookmarkingComponent,
    TimeAgoPipe,
    AdminLoginComponent,
    AdminLayoutComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminHomeComponent,
    AdminPostsComponent,
    AdminCateogryComponent,
    AdminCommentsComponent,
    AdminNewsComponent,
    AdminUsersComponent,
    SignatureComponent,
    NewsComponent,
    FooterComponent,
    NewsDetailsComponent,
  
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ShareButtonModule,
     ToastrModule.forRoot({progressBar:true,preventDuplicates: true,timeOut:2000}), 
         NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
         FormsModule, 
     ReactiveFormsModule,
     ModalModule.forRoot(),
     NgxPopperModule,
     NgxEmojiPickerModule.forRoot(),
     Ng2SearchPipeModule,
     NgxPaginationModule,
     TruncateModule,
     NgxEditorModule ,
     OwlDateTimeModule, 
     OwlNativeDateTimeModule,
     NgxLinkifyjsModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
    
  },AuthGuard,AuthGuardAdmin,LoginService,CookieService,AdminService],
  bootstrap: [AppComponent]
})
export class AppModule { }
