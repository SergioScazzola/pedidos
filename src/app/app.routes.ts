import { Routes } from '@angular/router';
import { NavegadorComponent } from './components/navegador/navegador.component';



export const routes: Routes = [
     
  { path: 'ppal', component: NavegadorComponent },         
                    
  { path: '**', redirectTo: 'ppal' },         
];
