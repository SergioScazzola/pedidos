import { Routes } from '@angular/router';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';



export const routes: Routes = [
     
  { path: 'ppal', component: NavegadorComponent },         
  { path: 'pedidos/:filtro', component: PedidosComponent },         
  { path: '**', redirectTo: 'ppal' },         
];
