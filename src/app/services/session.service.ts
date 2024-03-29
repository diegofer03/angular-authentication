import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  saveToken(token: string){
    setCookie('token',token, {expires: 365, path:'/login'})
  }

  getToken(){
    console.log(getCookie('token'))
    return getCookie('token')
  }

  removeToken(){
    removeCookie('token')
  }

  saveRefreshToken(Refreshtoken: string){
    setCookie('Refreshtoken',Refreshtoken, {expires: 365, path:'/login'})
  }

  getRefreshToken(){
    console.log(getCookie('Refreshtoken'))
    return getCookie('Refreshtoken')
  }

  removeRefreshToken(){
    removeCookie('Refreshtoken')
  }

  isValid(){
    const token = getCookie('token')
    if(!token) return false
    const decodeToken = jwtDecode<JwtPayload>(token)
    if(decodeToken && decodeToken.exp){
      const tokenDate = new Date(0)
      tokenDate.setUTCSeconds(decodeToken.exp)
      const now = new Date()
      return tokenDate.getTime() > now.getTime()
    }
    return false
  }

  isRefreshValid(){
    const token = getCookie('Refreshtoken')
    if(!token) return false
    const decodeToken = jwtDecode<JwtPayload>(token)
    if(decodeToken && decodeToken.exp){
      const tokenDate = new Date(0)
      tokenDate.setUTCSeconds(decodeToken.exp)
      const now = new Date()
      return tokenDate.getTime() > now.getTime()
    }
    return false
  }
}
