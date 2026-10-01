import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-verifica-email',
  imports: [RouterLink],
  templateUrl: './verifica-email.component.html',
  styleUrl: './verifica-email.component.css',
})
export class VerificaEmailComponent {
  private route = inject(ActivatedRoute);

  email = signal<string | null>(null);

  ngOnInit() {
    this.email.set(
      this.route.snapshot.queryParamMap.get('email')
    );
  }
}