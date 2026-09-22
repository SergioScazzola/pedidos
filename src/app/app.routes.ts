import { Routes } from '@angular/router';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { DetpedidoComponent } from './components/pedidos/detpedido/detpedido.component';
import { BusqlistaComponent } from './components/pedidos/busqlista/busqlista.component';



export const routes: Routes = [
     
  { path: 'ppal', component: NavegadorComponent },         
  { path: 'pedidos/:filtro', component: PedidosComponent },         
  { path: 'detpedido/:nropedido/:nroprov/:nombre', component: DetpedidoComponent },       
  { path: '**', redirectTo: 'ppal' },         
];
