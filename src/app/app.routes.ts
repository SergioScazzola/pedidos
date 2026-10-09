import { Routes } from '@angular/router';
import { NavegadorComponent } from './components/navegador/navegador.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { DetpedidoComponent } from './components/pedidos/detpedido/detpedido.component';
import { BusqlistaComponent } from './components/pedidos/busqlista/busqlista.component';
import { CodigosbarraComponent } from './components/impbarcodes/codigosbarra/codigosbarra.component';
import { ImpbarcodesComponent } from './components/impbarcodes/impbarcodes.component';



export const routes: Routes = [
     
  { path: 'ppal', component: NavegadorComponent },         
  { path: 'pedidos/:filtro', component: PedidosComponent },         
  { path: 'detpedido/:nropedido/:nroprov/:nombre', component: DetpedidoComponent },       
  { path: 'codigosbarra', component: CodigosbarraComponent },
  { path: 'impCodigos', component: ImpbarcodesComponent },
  { path: '**', redirectTo: 'ppal' },         
];
