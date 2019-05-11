import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from "./../admin/services/admin.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardAdmin implements CanActivate {

  constructor(private adminService : AdminService,private router : Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.adminService.isLoggedIn()) {
        this.router.navigateByUrl('admin/loginAdministrator');
        this.adminService.deleteToken();
        return false;
      }
    return true;
  }
}
