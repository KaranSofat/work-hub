import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";

import { LoginService } from "./../services/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private loginService : LoginService,private router : Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
  console.log(req.headers.get('noauth'))
        if (req.headers.get('noauth')){
            return next.handle(req.clone());
        }    
        else {
            console.log("dasdasdas")
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + this.loginService.getToken())
            });
            return next.handle(clonedreq).pipe(
                tap(
                    event => { },
                    err => {
                        if (err.error.auth == false) {
                            this.router.navigateByUrl('/login');
                        }
                    })
            );
        }
    }
}