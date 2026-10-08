import { ChangeDetectorRef, Component } from '@angular/core';

import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { proveedorDTO } from '../../../entidades/proveedorDTO';
import { artListaDDTO, intBusqArt, selCodBar } from '../../../entidades/artListaDTO';
import { PedidosService } from '../../../servicios/service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BusqlistaComponent } from '../pedidos/busqlista/busqlista.component';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-impbarcodes',
  imports: [  MatSelectModule,MatTableModule,MatFormField,MatLabel],
  templateUrl: './impbarcodes.component.html',
  styleUrl: './impbarcodes.component.css'
})
export class ImpbarcodesComponent {

 isloading      : boolean = true;
 nroprove       : number;
 cproveedores   : proveedorDTO[]=[];
 cselMultiple   : artListaDDTO[]=[]; // para recibir de "busqlista"
 cselCodBar     : selCodBar[]=[];   //  para imprimir codigos de barra
  constructor( private   servicio       : PedidosService,                           
               private   router         : Router,
               private   cdr            : ChangeDetectorRef,
               public    dialog         : MatDialog,       
          
                              ) {       
   }  

   colArticulos: string[] = ["nroproveedor" , "codigo" , "descripcion"];

 ngOnInit(){   
   forkJoin({       
        prove  : this.servicio.getProveedores()
      }).subscribe(res => {          
        this.cproveedores  = res.prove;
        this.isloading      = false;
        this.cdr.detectChanges();
      })       
 }
  onSelectionProv(event : any) {
    this.nroprove = event;
  }
  
  seleccionarArticulos() {
   
     // llama al componente "busqlista" para agregar uno ó mas items de pedido
    const indp = this.cproveedores.findIndex(p=>p.Idproveedor===this.nroprove);
    const datas : intBusqArt = {
      lista    : this.cproveedores[indp].nomlista,
      nroprov  : this.nroprove,
      Selmult  : 1   // puede seleccionar + de 1 articulos de la lista
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus    = false;
    dialogConfig.data         = datas;
    dialogConfig.width        = '1000px';         // ancho máximo de la ventana
    dialogConfig.maxWidth     = '95vw';      
    dialogConfig.height       = '600px';        // altura se ajusta al contenido
    dialogConfig.panelClass   = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
    const dialogRef =  this.dialog.open(BusqlistaComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
            (datas:any) => {
              if (datas.clicked === 'Acepto' && datas.articulos){                   
               // me devuelve uno ó mas items en datas.articulos -> seleccion multiple
               this.cselCodBar = datas.articulos.map((item : artListaDDTO,index : number) => ({                
                  nroproveedor : this.nroprove,
                  codigo       : item.codigo,
                  descripcion  : item.descripcion,
               }));
               this.isloading = false;
               this.cdr.detectChanges();
              }
            }
          );
  }

  Volver(){
       this.router.navigate(['/pedidos','']);
  }
              
                 
                
              

  
}
