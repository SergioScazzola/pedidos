import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
                                           provideRouter(routes), 
                                           provideHttpClient(),
 // Configuración por defecto para los diálogos
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'custom-dialog-container',
        width: '500px',
        maxWidth: '95vw',
        maxHeight: '95vh',
        autoFocus: false,
        disableClose: false,
      },

    },
    provideNativeDateAdapter(),
  
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }      
  ]                                  
};

