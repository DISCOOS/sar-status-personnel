import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    constructor() {}

    isLoggedIn() {
        return localStorage.getItem('currentUser') != undefined;    
    }
}