import { Component, effect, ElementRef, input, Input, viewChild, ViewChild,  } from '@angular/core';


import { PedidosService } from '../../../servicios/service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SinoService } from '../../../servicios/sino.service';
import { NotiserviceService } from '../../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatTableModule,MatTableDataSource } from '@angular/material/table';


import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { intCabPedido, pedidoDTO } from '../../../entidades/pedidoDTO';
import { CabpedidoComponent } from './cabpedido/cabpedido.component';


@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent {
 @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;

  
  public   filtro    : string;
  private  maxPedido : number;
  
  public cpedidos    : pedidoDTO[]=[];
  formPed            : boolean;
 
  /*    nropedido    : number;
    fechaalta    : Date;
    fechaup      : Date;
    nroproveedor : number;
    proveedor    : string;
    cantitems    : number;  */
  
  
  colPedidos: string[] = ["nropedido" , "fechaup", "nroproveedor", "proveedor","cantitems","Det","M","B"];
  
  dataSource = new MatTableDataSource<any>();
  //private filtroInicial : string = "";

  constructor( private servicio       : PedidosService,               
               private router         : Router,
               private rutaActiva     : ActivatedRoute,
               public  dialog         : MatDialog,
               private sinoServicio   : SinoService,
               private notiServicio   : NotiserviceService
                              ) { 
   
   }     
ngOnInit(){    
   
    this.rutaActiva.paramMap.subscribe((params) => {
      var fil  = params.get('filtro')||'';     
      this.filtro = fil;   
      if (this.inputRef) {
          this.inputRef.nativeElement.value = this.filtro;   
      }             
      }) 
      this.leerPedidos();    
  }

  
  agPedido(){
    const data : intCabPedido = {
      nropedido : this.maxPedido + 1,
      nprov     : "",
      accion    : "A"
    }       
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    dialogConfig.width =  '900';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad

    const dialogRef =  this.dialog.open(CabpedidoComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Alta'){                   
                 //this.cclientes =  toSignal(this.clienteService.getClientes(),{ initialValue: [] });// refrescar                                            
                 this.leerPedidos(); // refrescar                 
              
                       }})
  
  }
  leerPedidos(){
      forkJoin({
                    pedidos      : this.servicio.getPedidos(),                
                    maxped       : this.servicio.getMaxPedidos(),                   
                }).subscribe(res => {   
                    this.cpedidos     = res.pedidos;
                    this.maxPedido    = res.maxped;
                   
          
                   if (this.cpedidos!==null && this.cpedidos.length>0){                 
                       this.dataSource.data = this.cpedidos;         
                       this.dataSource.filterPredicate = (dato : pedidoDTO, fil : string) => {
                            return dato.proveedor.toLowerCase().startsWith(fil);
                                       };    
                  // Aplica filtro si hay uno
                    if (this.filtro!=='') {                                 
                      this.dataSource.filter = this.filtro;                                                                       
                      this.inputRef.nativeElement.value = this.filtro;//setAttribute('value', this.filtro);
                    }             
                } else {
                   this.notiServicio.showNotification("No existen Pedidos registrados",'Aceptar','mensaje',500);  
                }
              })

   }
  modificarPedido(nrocli : number,nombre : string){      
    const data = {
      nrocliente : nrocli,
      nomcli : nombre,
      accion     : "M"
    }       
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = data;
    dialogConfig.panelClass = "";
    const dialogRef =  this.dialog.open(CabpedidoComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (data:any) => { if (data.clicked === 'Modi'){                   
                 this.leerPedidos(); // refrescar                                            
                            }})  
  
  }
  borrarPedido(nrped : number){
    var resu : string;
     this.sinoServicio.abrirSiNoDialogo("Confirmación",
                              "¿ Está seguro de quiere borrar el Pedido Nro."+nrped+" ?")
       .then(result => {
          if (result) {
              var subscri : Subscription;
              subscri = this.servicio.elimPedido(nrped)
                 .pipe(finalize(() => {
                    this.leerPedidos(); // refrescar                               
                    this.notiServicio.showNotification("Pedido nro. "+nrped+" eliminado con éxito "+resu,'Aceptar','mensaje',500); 
                    subscri.unsubscribe();
                    

                  }))
                  .subscribe((data : any): void => {
                       resu = data});       
          } else {
            console.log('El usuario seleccionó "No"');
          }
    })
 }
  manejarOperacion($event:any){
    if ($event==="Alta" || $event==="Modi"){
        this.formPed = false;
        this.leerPedidos(); // refrescar  
    } else {
      this.formPed = false;
    }
   }


  aplicarFiltro(valor : string)  {
    this.dataSource.filter = valor.trim().toLowerCase();
 }


}
