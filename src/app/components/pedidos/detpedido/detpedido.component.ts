import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PedidosService } from '../../../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

import { SinoService } from '../../../../servicios/sino.service';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { intRenpedido, renpedDTO, renpedidoDTO } from '../../../../entidades/renpedidoDTO';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { RenpedidoComponent } from '../renpedido/renpedido.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { proveedorDTO } from '../../../../entidades/proveedorDTO';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-detpedido',
  imports: [MatTooltipModule,
            MatIconModule,
            MatButtonModule,
            MatDialogModule,
            FormsModule,
            ReactiveFormsModule,
            MatTableModule],


  templateUrl: './detpedido.component.html',
  styleUrl: './detpedido.component.css'
})
export class DetpedidoComponent {
 @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;

  filtro        : string="";
  cdetpedido    : renpedidoDTO[]=[];
  cdisppedido   : renpedDTO[];
  cproveedores  : proveedorDTO[]=[];

  cantitems   : number;
  ultitem     : number;
  dataSource = new MatTableDataSource<any>();
  nropedido   : number;
  nroprove    : string;
  isloading   : boolean = true;

    constructor( private servicio       : PedidosService,              
               private   router         : Router,
               private   rutaActiva     : ActivatedRoute,
               private   cdr            : ChangeDetectorRef,
               public    dialog         : MatDialog,            
               private   sinoServicio   : SinoService,
               private   notiServicio   : NotiserviceService
                              ) {       
   }   

   colDetPedido: string[] = ["nropedido" , "nrorenglon", "proveedor", "codigo","descripcion","cantidad","coment","M","B"];
   
   ngOnInit(){    
   
     // Extraer parámetros de la ruta
     this.rutaActiva.paramMap.subscribe((params) => {
     this.nropedido      = Number(params.get('nropedido'));      
     this.nroprove       = params.get('nroprov')||'';
     
     this.leerDetallePedido(this.nropedido);
     
     })
   }

   leerDetallePedido(nroped : number) {
    this.cdetpedido   = [];
    this.cproveedores = [];
    forkJoin({
      detalle: this.servicio.getDetallePedido(nroped),
      maxitem: this.servicio.getMaxDetPedido(nroped),
      prove  : this.servicio.getProveedores()
    }).subscribe(res => {   
      this.cdetpedido    = res.detalle;
      this.cproveedores  = res.prove;
      this.ultitem    = res.maxitem; // nro.de ultimo item del pedido

    
      this.cantitems = this.cdetpedido==undefined ? 0 : this.cdetpedido.length;
           if (this.cantitems==0){
               this.notiServicio.showNotification("No hay items para el pedido "+this.nropedido,"Aceptar","mensaje",3000);
               this.ultitem = 0;  

               this.isloading = false;
               this.cdr.detectChanges();
            } else {     
              // mapeo para mostrar el nombre del proveedor     
             this.cdisppedido = this.cdetpedido.map((item) => ({
                nropedido: item.nropedido,
                nrorenglon: item.nrorenglon,
                proveedor: this.cproveedores[this.cproveedores.findIndex(p => p.Idproveedor == item.nroproveedor)]?.nombre,
                codigo: item.codigo,
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                coment: item.coment
              }));

              this.dataSource.data = this.cdisppedido;    
              //console.log(JSON.stringify(this.cdisppedido,null,2));
               this.dataSource.filterPredicate = (dato : renpedDTO, fil : string) => {
                           return dato.descripcion.toLowerCase().includes(fil);
                                   };    
                       // Aplica filtro si hay uno
                if (this.filtro!=='') {                                 
                          this.dataSource.filter = this.filtro;                                                                       
                          this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                }  
              this.isloading = false;
              this.cdr.detectChanges(); // Forzar la detección de cambios
            }
    });


  }

  agregarItemPedido() {
   
     // llama al componente "renpedido" para agregar un nuevo item de pedido
    const datas : intRenpedido = {
      nropedido    : this.nropedido,
      nrorenglon   : this.ultitem+1,   
      nroprov      : this.nroprove,
      accion       : "A"
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
    const dialogRef =  this.dialog.open(RenpedidoComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (datas:any) => { if (datas.clicked === 'Alta'){                   
                 this.leerDetallePedido(this.nropedido); // recargar el detalle de pedido para mostrar el nuevo movimiento                                                                       
                       }})  

  }
  aplicarFiltro(valor : string)  {
  this.dataSource.filter = valor.trim().toLowerCase();   
  }

  generarDetalleCuentaPDF() {
    // Lógica para generar el PDF del detalle de la cuenta
  }

  Volver(){
       this.router.navigate(['/pedidos','']);
  }

modificarItemPedido( nroped : number, nroren : number){

}

eliminarItemPedido( nroped : number, nroren : number){

}

}
