import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

@Component({
  selector: 'app-root',
  imports: [AppLayoutComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}