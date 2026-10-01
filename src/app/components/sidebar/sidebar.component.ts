import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
  export class SidebarComponent {
  private auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }

  sidebarOpen = input<boolean>(false);
  // Output per dire al layout di chiudere la sidebar
  closeSidebar = output<void>();
}