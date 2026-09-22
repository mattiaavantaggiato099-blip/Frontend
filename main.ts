/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';
import localeIt from '@angular/common/locales/it';
import localeItExtra from '@angular/common/locales/extra/it';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeIt, 'it-IT', localeItExtra);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
