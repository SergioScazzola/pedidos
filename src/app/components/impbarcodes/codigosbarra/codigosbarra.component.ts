import { Component } from '@angular/core';
import JsBarcode from 'jsbarcode';
import { PedidosService } from '../../../../servicios/service';
import { Router } from '@angular/router';
import { selCodBar } from '../../../../entidades/artListaDTO';


@Component({
  selector: 'app-codigosbarra',
  imports: [],
  templateUrl: './codigosbarra.component.html',
  styleUrl: './codigosbarra.component.css'
})
export class CodigosbarraComponent {

 cselCodBar     : selCodBar[]=[];   //  para imprimir codigos de barra

   constructor( private   servicio       : PedidosService,                           
               private    router         : Router                              
                              ) {       
   }  

   ngOnInit(){
   
     this.cselCodBar = this.servicio.getArticulosParaCodificar();

     setTimeout(() => {

        this.cselCodBar.forEach((arti, i) => {

          JsBarcode("#barcode-" + i,arti.nroproveedor.toString().padStart(3, '0') + arti.codigo, {
            format: "CODE128",
            width: 2,
            height: 40,
            displayValue: true,
            fontSize: 14,
            margin: 5
         });    
        });

      }, 0);
  }

  imprimir() {
    window.print();
  }

  Volver() {
    this.router.navigate(['/impCodigos']);
  }
}
