import {Injectable, NgZone} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';
import {TimeoutDialogComponent} from "../utils/TimeoutDialogComponent";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private readonly timeoutDuration = 15 * 60 * 1000; // 15 minutes

  constructor(private router: Router, private authService: AuthService, private ngZone: NgZone, private dialog: MatDialog) {
    this.startWatching();
  }

  private startWatching() {
    this.resetTimeout();
    const events = [
      'mousemove',
      'keydown',
      'click',
      'mouseenter',
      'mouseleave',
      'mouseover',
      'mouseout',
      'mousedown',
      'mouseup',
      'dblclick',
      'keypress',
      'keyup',
      'focus',
      'blur',
      'submit',
      'reset',
      'change',
      'input',
      'load',
      'resize',
      'scroll',
      'play',
      'pause',
      'touchstart',
      'touchmove',
      'touchend',
      'error',
      'contextmenu'
    ];
    events.forEach(event => {
      window.addEventListener(event, () => this.resetTimeout(), {passive: true});
    });
  }

  private resetTimeout() {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => this.handleTimeout(), this.timeoutDuration);
  }

  private handleTimeout() {
    const dialogRef = this.dialog.open(TimeoutDialogComponent, {
      width: '450px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.authService.logout();
      this.ngZone.run(() => this.router.navigate(['/login']));
    });
  }
}
