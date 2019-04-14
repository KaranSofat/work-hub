import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { SignupComponent } from './signup/signup.component';
import { SettingsComponent } from './settings/settings.component';
import { MessagesComponent } from './messages/messages.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { AuthGuard } from './auth/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { ThankYouPostComponent } from './thank-you-post/thank-you-post.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ListBookmarkingComponent } from './list-bookmarking/list-bookmarking.component';
const routes: Routes = [ {
  path: '',
  component: SiteLayoutComponent,
  children: [{
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    runGuardsAndResolvers: 'always',
  },{
    path: 'dashboard',
    component: DashboardComponent,
    canActivate:[AuthGuard],
    pathMatch: 'full'
  },{
    path: 'details/:id',
    component: PostDetailsComponent,
    pathMatch: 'full'
  },{
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full'
  },{
    path: 'settings',
    component: SettingsComponent,
    pathMatch: 'full'
  },{
    path: 'messages',
    component: MessagesComponent,
    pathMatch: 'full'
  },
  
  {
    path: 'registerdConfirmation/:id',
    component: RegistrationSuccessComponent,
    pathMatch: 'full'
  }, {
    path: 'postPublished',
    component: ThankYouPostComponent,
    canActivate:[AuthGuard],
    pathMatch: 'full'
  },

  
  {
    path: 'createPost/:title/:cat',
    component: CreatePostComponent,
   // canActivate:[AuthGuard],
    pathMatch: 'full'
  },{
    path: 'forgotPassword/:id',
    component: ForgotPasswordComponent,
    pathMatch: 'full'
  },
  {
    path: 'userInfo',
    component: PersonalInfoComponent,
    pathMatch: 'full'
  },
  {
    path: 'contactDetail',
    component: ContactDetailsComponent,
    pathMatch: 'full'
  },
  {
    path: 'bookmarks',
    component: ListBookmarkingComponent,
    pathMatch: 'full'
  },
]},
  {
    
    path: '**',
    component: ErrorPageComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
