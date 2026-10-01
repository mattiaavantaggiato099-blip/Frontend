import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-verificata',
  imports: [],
  templateUrl: './email-verificata.component.html',
  styleUrl: './email-verificata.component.css',
})
export class EmailVerificataComponent {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  seconds = signal(3);

  ngOnInit() {
    const intervalId = window.setInterval(() => {
      const remainingSeconds = this.seconds() - 1;

      this.seconds.set(remainingSeconds);

      if (remainingSeconds <= 0) {
        window.clearInterval(intervalId);

        this.router.navigate(['/login'], {
          queryParams: {
            verified: '1',
          },
        });
      }
    }, 1000);

    this.destroyRef.onDestroy(() => {
      window.clearInterval(intervalId);
    });
  }

  goToLogin() {
    this.router.navigate(['/login'], {
      queryParams: {
        verified: '1',
      },
    });
  }
}