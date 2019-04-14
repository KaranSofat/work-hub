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
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthGuard } from './auth/auth.guard';
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
    ListBookmarkingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ShareButtonModule,
     ToastrModule.forRoot({progressBar:true,preventDuplicates: true}), 
         NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
         FormsModule, 
     ReactiveFormsModule,
     ModalModule.forRoot(),
     NgxPopperModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
    
  },AuthGuard,LoginService,CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
