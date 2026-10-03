import { Component, DestroyRef, inject, signal } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { ProfiloService } from '../../services/profilo.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-app-layout',
  imports: [SidebarComponent, NavbarComponent, RouterOutlet],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.css',
})
export class AppLayoutComponent {

  private profiloSrv = inject(ProfiloService);
  private destroyRef = inject(DestroyRef);

  nome = signal('');
  cognome = signal('');

  ngOnInit() {
    this.profiloSrv
      .getProfilo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: utente => {
          this.nome.set(utente.nomeTitolare);
          this.cognome.set(utente.cognomeTitolare);
        },

        error: err => {
          console.error('Errore caricamento profilo:', err);
        },
      });
  }

  sidebarOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }
}
