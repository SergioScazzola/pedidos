import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PedidosService } from '../../../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';

import { SinoService } from '../../../../servicios/sino.service';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { intRenpedido, renpedDTO, renpedidoDTO } from '../../../../entidades/renpedidoDTO';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { RenpedidoComponent } from '../renpedido/renpedido.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { proveedorDTO } from '../../../../entidades/proveedorDTO';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { artListaDDTO, intBusqArt, selMultB } from '../../../../entidades/artListaDTO';
import { BusqlistaComponent } from '../busqlista/busqlista.component';
import { finalize, Subscription } from 'rxjs';


@Component({
  selector: 'app-detpedido',
  imports: [MatTooltipModule,
            MatIconModule,
            MatButtonModule,
            MatDialogModule,
            FormsModule,
            ReactiveFormsModule,
            MatTableModule],

  providers : [DatePipe],
  templateUrl: './detpedido.component.html',
  styleUrl: './detpedido.component.css'
})
export class DetpedidoComponent {
 @ViewChild('filtroInput') inputRef!: ElementRef<HTMLInputElement>;

  filtro        : string="";
  cdetpedido    : renpedidoDTO[]=[];
  cdisppedido   : renpedDTO[];
  cproveedores  : proveedorDTO[]=[];
  cselMultiple  : artListaDDTO[]=[]; // para recibir de "busqlista"
  cselDestino   : renpedidoDTO[]=[]; // para enviar a grabar al back
  cantitems     : number;
  ultitem       : number;
  dataSource = new MatTableDataSource<any>();
  nropedido     : number;
  nroprove      : number;
  nomprov       : string;
  isloading     : boolean = true;


    constructor( private servicio       : PedidosService,              
               private   router         : Router,
               private   rutaActiva     : ActivatedRoute,
               private   cdr            : ChangeDetectorRef,
               public    dialog         : MatDialog,       
               private   datepipe       : DatePipe,     
               private   sinoServicio   : SinoService,
               private   notiServicio   : NotiserviceService
                              ) {       
   }   

   colDetPedido: string[] = ["nropedido" , "nrorenglon", "proveedor", "codigo","descripcion","cantidad","coment","M","B"];
   
   ngOnInit(){    
   
     // Extraer parámetros de la ruta
     this.rutaActiva.paramMap.subscribe((params) => {
     this.nropedido      = Number(params.get('nropedido'));      
     this.nroprove       = Number(params.get('nroprov'));
     this.nomprov        = params.get('nombre')||'';
     
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
      this.ultitem       = res.maxitem; // nro.de ultimo item del pedido

    
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
      cantit       : this.cdetpedido==null?0:this.cdetpedido.length, // es para actualizar en el back
      nroprov      : this.nroprove,
      accion       : "A"
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '800px';         // ancho máximo de la ventana
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

   agregarMultItemPedido() {
   
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
               this.cselDestino = datas.articulos.map((item : artListaDDTO) => ({
                  nropedido    : this.nropedido,
                  nrorenglon   : 0,  // el nro de renglon lo pone el back
                  nroproveedor : this.nroprove,
                  codigo      : item.codigo,
                  descripcion : item.descripcion,
                  cantidad    : 1,
                  coment      : ""}))
                const selmul : selMultB = {
                  cantitped  : this.ultitem,
                  items      : this.cselDestino                  
                }
                var subs : Subscription;
                   var resu = "";
                   subs = this.servicio.grabarSelMultiple(selmul)  
                           .pipe(finalize(() => {                               
                               subs.unsubscribe();
                               this.leerDetallePedido(this.nropedido);
                               this.isloading = false;
                               this.cdr.detectChanges()
                               }))                  
                          .subscribe((data : any): void => {resu= data});   
                              }   
                 
                } )             
              

  }
  aplicarFiltro(valor : string)  {
  this.dataSource.filter = valor.trim().toLowerCase();   
  }

  generarDetalleCuentaPDF() {
    // Lógica para generar el PDF del detalle de la cuenta
  }
 agregarMultiplesItems(){
  
 }
  Volver(){
       this.router.navigate(['/pedidos','']);
  }

modificarItemPedido( nroped : number, nroren : number){
   // llama al componente "renpedido" para modificar el item de pedido
    const datas : intRenpedido = {
      nropedido    : nroped,
      nrorenglon   : nroren,   
      cantit       : 0,
      nroprov      : this.nroprove,
      accion       : "M"
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '600px';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
    const dialogRef =  this.dialog.open(RenpedidoComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (datas:any) => { if (datas.clicked === 'Modi'){                   
                 this.leerDetallePedido(nroped); // recargar el detalle de pedido para mostrar el nuevo movimiento                                                                       

                       }})  
}

eliminarItemPedido( nroped : number, nroren : number){

}

generarPedidoPDF() : void {
   var filas                 : any;
   var colspdf : any = [
     { header: 'NroIt', dataKey: 'nrorenglon' },
     { header: 'Proveedor', dataKey: 'nprov' },
     { header: 'Código', dataKey: 'codigo' },     
     { header: 'Descripción', dataKey: 'ntipo' },
     { header: 'Cantidad', dataKey: 'cantidad' },
     { header: 'Aclaración', dataKey: 'coment' },
   ];
                
       const doc = new jsPDF('p','mm','A4');
       var pageNumber : number = 0;
    
        const title = this.nroprove===0?'Pedido a proveedores':'Pedido al proveedor : '+this.cdisppedido[0].proveedor;
     
       // Fecha actual
       const fecha = new Date();
       const fechaStr = fecha.toLocaleDateString('es-AR');
       const totalPagesExp = '{total_pages_count_string}';
                
       filas = this.cdisppedido.map((item)=> [
         item.nrorenglon,
         item.proveedor,
         item.codigo,
         item.descripcion,
         item.cantidad,       
         item.coment
         
       ]);      
        
       autoTable(doc, 
         {
          head: [colspdf.map((item:any)=>item.header)],
          body: filas,
          columns: colspdf,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [63, 81, 181], halign: 'center' },
          startY:  25,   // 25,  Espacio debajo del título
          columnStyles: {
             nrorenglon        : { halign: 'center' },
             proveedor         : { halign: 'center' },                                                        
             codigo            : { halign: 'center' },                  
             descripcion       : { halign: 'center' },
             cantidad          : { halign: 'center' },                
             coment            : { halign: 'center' },                
             
             
          },
              
  
         didDrawPage: (data) => {
             //const pageNumber = doc.getCurrentPageInfo().pageNumber;
             if (data.pageNumber>=1){
                  data.settings.margin.top = 25; 
             }
         },
          margin: { left: 10, right: 10 }}                      
      );         
        // ➕ Reemplazar marcador de total de páginas
     const totalPages = doc.getNumberOfPages();
   
     for (let i = 1; i <= totalPages; i++) {
       doc.setPage(i);
       const pageSize = doc.internal.pageSize;
       const text = `Página ${i} de ${totalPages}`;
       doc.setFontSize(8);
       doc.text("Bulonera Pehuajó S.R.L", 10, 15, { align: 'left' });
   
        // Título centrado
       //doc.setFontSize(8);
       doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
     
       // Fecha alineada a la derecha
       //doc.setFontSize(8);
       doc.text(`Fecha: ${fechaStr}`, doc.internal.pageSize.getWidth() - 10, 10, { align: 'right' });
       //doc.setFontSize(8);
       doc.text(text, pageSize.width - 10, 15, { align: 'right' });
     }
      doc.save('Pedido_A_Proveedor_'+this.datepipe.transform(new Date(),"dd/MM/yyyy")+'.pdf');       
      
     }

}
