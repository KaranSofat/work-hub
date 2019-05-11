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
import { AuthGuardAdmin } from './auth/auth.guard.admin';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { SiteLayoutComponent } from './site-layout/site-layout.component';
import { RegistrationSuccessComponent } from './registration-success/registration-success.component';
import { ThankYouPostComponent } from './thank-you-post/thank-you-post.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { ListBookmarkingComponent } from './list-bookmarking/list-bookmarking.component';
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
import { SignatureComponent } from './signature/signature.component';
import { NewsComponent } from './news/news.component';
import { ListPostsComponent } from './list-posts/list-posts.component';
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
    path: 'posts',
    component: ListPostsComponent,
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
    path: 'news',
    component: NewsComponent,
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
    path: 'signature',
    component: SignatureComponent,
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
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: 'admin/dashboard',
      component: AdminHomeComponent,
      canActivate:[AuthGuardAdmin],
      pathMatch: 'full',
    },{
    
      path: 'admin/users',
      component: AdminUsersComponent,
      canActivate:[AuthGuardAdmin],
    },{
      
      path: 'admin/posts',
      component: AdminPostsComponent, canActivate:[AuthGuardAdmin],
    },{
      
      path: 'admin/comments',
      component: AdminCommentsComponent,
      canActivate:[AuthGuardAdmin],
    },{
      
      path: 'admin/news',
      component: AdminNewsComponent, canActivate:[AuthGuardAdmin],
    },{
      
      path: 'admin/categories',
      component: AdminCateogryComponent, canActivate:[AuthGuardAdmin],
    }]
  },
  {
    
    path: 'admin/loginAdministrator',
    component: AdminLoginComponent
  },{
    
    path: '**',
    component: ErrorPageComponent
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
