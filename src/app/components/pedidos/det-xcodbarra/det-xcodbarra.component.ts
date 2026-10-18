import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PedidosService } from '../../../../servicios/service';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { artListaCBar, artListaDDTO, artListaDTO, intBusqArt } from '../../../../entidades/artListaDTO';
import { finalize, forkJoin, Subscription } from 'rxjs';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { proveedorDTO } from '../../../../entidades/proveedorDTO';
import { renpedidoDTO } from '../../../../entidades/renpedidoDTO';

@Component({
  selector: 'app-det-xcodbarra',
 imports: [CommonModule,MatTableModule,  MatSelectModule,
            DecimalPipe, DatePipe, DragDropModule],
  providers : [DecimalPipe,DatePipe],
  templateUrl: './det-xcodbarra.component.html',
  styleUrl: './det-xcodbarra.component.css'
})
export class DetXCodbarraComponent {
   @ViewChild('codbar') inputRef!: ElementRef<HTMLInputElement>;
  titulo        : string;
  isloading     : boolean = true;
  cartprov      : artListaDTO[]=[];
  cartCodBar    : artListaCBar[]=[];
  itSelect      : renpedidoDTO[]=[]; // para enviar al componente padre "detpedido"
  cproveedores  : proveedorDTO[]=[];
  itemsSel      : number = 0;  // cantidad de items de lista seleccionados
  dataSource = new MatTableDataSource<any>();


   constructor( private  servicio       : PedidosService,                           
               private   cdr            : ChangeDetectorRef,
               private   notiService    : NotiserviceService,
               public    dialogRef      : MatDialogRef<DetXCodbarraComponent>){}

 colLista: string[] = ["proveedor","codigo","descripcion", "precio","iva","unidad","moneda","fechaup"];    
 ngAfterViewInit() {
    setTimeout(() => {
      //console.log('inputCod:', this.inputCod);

      if (this.inputRef) {
        this.inputRef.nativeElement.focus();
    }
    });
 }
 ngOnInit(){    
  this.titulo = "Seleccion por Código de Barras";
  forkJoin({    
      prove  : this.servicio.getProveedores()
    }).subscribe(res => {         
      this.cproveedores  = res.prove;

      
      this.isloading = false;
      this.cdr.detectChanges();

    })
      
 }

 ingresoCodigoBarra(codbarra : string) {
  // Busca el codigo en la lista del proveedor correspondiente y lo agrega en la tabla de seleccion
  var idprov = codbarra.substring(0,3);
  
  var codigo = codbarra.substring(3);
  //console.log("ingresoCodigoBarra codbarra: ",codbarra," idprov: ",idprov," codigo: ",codigo);
  var arti   : artListaDTO;
  var articb : artListaCBar;
  const indp = this.cproveedores.findIndex(p=>p.Idproveedor===Number(idprov));
  var lista = "";
  if (indp!==-1) {
     lista = this.cproveedores[indp].nomlista;
     
     var subs : Subscription;
     subs = this.servicio.getArticuloExactaxCod(lista,codigo)
       .pipe(finalize(() => {         
           subs.unsubscribe();
          if (arti!==null){
           
            articb = {
              nroprov   : this.cproveedores[indp].Idproveedor,
              proveedor : this.cproveedores[indp].nombre,
              codigo    : arti.codigo,
              codbarra  : arti.codbarra,
              descripcion : arti.descripcion,
              precio    : arti.precio,
              tiva      : arti.tiva,
              unidad    : arti.unidad,
              moneda    : arti.moneda,
              fechaup   : arti.fechaup
            }            
            this.cartCodBar.push(articb);
            this.dataSource.data = this.cartCodBar;
            this.itemsSel++;
            /* console.log("articulo : ",JSON.stringify(articb,null,2));
             console.log("Cantidad : "+this.itemsSel);          */
            console.log("cartCodBar : ",JSON.stringify(this.cartCodBar,null,2));
            this.inputRef.nativeElement.value = ""; // limpia el input para el siguiente ingreso
            this.inputRef.nativeElement.focus();    // pone el foco en el input
            this.isloading = false;
            this.cdr.detectChanges();

          } else {
            this.notiService.showNotification("No se encontró el artículo para el código de barras ingresado","Aceptar","error",5000);
          } }))
       .subscribe(res => {
         arti = res;
       });
  } else {
    this.notiService.showNotification("Proveedor no encontrado para el código de barras ingresado","Aceptar","error",5000);
    return;
  }
}

 Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
}

  aceptarSeleccion(){
 
  this.itSelect = this.cartCodBar.map((item : artListaCBar)=> ({
           nropedido    : 0,
           nrorenglon   : 0,
           nroproveedor : item.nroprov,
           codigo       : item.codigo,
           descripcion  : item.descripcion,
           cantidad     : 1,
           coment       : " "
  }))
  // Cerramos el diálogo y enviamos el estado 'Acepto' junto con la lista de artículos
  this.dialogRef.close({
    clicked: 'Acepto',
    articulos: this.itSelect
  });
 }


}
