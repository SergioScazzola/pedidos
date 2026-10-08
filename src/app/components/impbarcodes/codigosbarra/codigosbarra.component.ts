import { Component } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { PedidosService } from '../../../../servicios/service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-codigosbarra',
  imports: [],
  templateUrl: './codigosbarra.component.html',
  styleUrl: './codigosbarra.component.css'
})
export class CodigosbarraComponent {


   constructor( private   servicio       : PedidosService,                           
               private    router         : Router                              
                              ) {       
   }  
}
