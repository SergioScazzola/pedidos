      
import { Component, Inject,NgZone,ChangeDetectorRef, QueryList, ViewChildren} from '@angular/core';

import { ImporteDirective } from '../../../Directivas/importeDirective';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { PedidosService } from '../../../../servicios/service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';



import { proveedorDTO } from '../../../../entidades/proveedorDTO';

import { MatCheckboxModule } from '@angular/material/checkbox';

import { intRenpedido, renpedidoDTO } from '../../../../entidades/renpedidoDTO';
import { SelecTextDirective } from '../../../Directivas/selectTextDirective';
import { Router } from '@angular/router';
import { artListaDDTO, intBusqArt } from '../../../../entidades/artListaDTO';
import { BusqlistaComponent } from '../busqlista/busqlista.component';


export const DATE_FORMATS : MatDateFormats = {

  
  parse : { dateInput : "dd-MM-yyyy"},
  display : {
      dateInput :  "dd-MM-yyyy",
      monthYearLabel : "MMM yyyy",
      dateA11yLabel : "LL",
      monthYearA11yLabel : "yyyy",
  }
}

@Component({
  selector: 'app-renpedido',
 imports: [MatFormField,
    MatLabel,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    DragDropModule,
    SelecTextDirective ],
    providers: [
    DatePipe,
    CurrencyPipe
   
],               

  templateUrl: './renpedido.component.html',
  styleUrl: './renpedido.component.css'
})
export class RenpedidoComponent {

 cproveedores : proveedorDTO[]=[];
 operacion    : string;
 itpedido     : renpedidoDTO;
 formItPed    : FormGroup;
 isloading    : boolean = true;
 leerArtic    : number = 0;
   itemSel    : artListaDDTO[]=[];
 
 constructor(    public  fb          : FormBuilder,
                  private currencyPipe: CurrencyPipe,
                  private servicio    : PedidosService,                
                  public dialogRef    : MatDialogRef<RenpedidoComponent>,
                  private cdr         : ChangeDetectorRef,
                  private zone        : NgZone,
                  private router      : Router,
                  public    dialog    : MatDialog, 
                  @Inject(MAT_DIALOG_DATA) public data: intRenpedido,  
                  private notiService : NotiserviceService )
       {  }

 
  ngOnInit(){

    this.initFormulario();      
    
    if (this.data.accion==="A") { // "A" -> Alta de Item de Pedido
      forkJoin({             
          proveed   : this.servicio.getProveedores(),                           
           
         }).subscribe(res2 => {
            this.cproveedores      =  res2.proveed           
      
            if (this.cproveedores!==null && this.cproveedores.length>0){                  
                this.operacion = "Agregar Item al Pedido Nro. "+this.data.nropedido; ;            
                this.prepararAlta();    
                this.isloading = false;
                this.cdr.detectChanges()
            } else { 
               this.notiService.showNotification("No existen proveedores registrados",'Aceptar','mensaje',500);  
            }
         })     
        } else {  // "M" -> Modificacion de Item de Pedido
           forkJoin({             
             proveed   : this.servicio.getProveedores(),     
             itped     : this.servicio.getItemPedido(this.data.nropedido,this.data.nrorenglon)                      
           
   
         }).subscribe(res2 => {
            this.cproveedores   =  res2.proveed,
            this.itpedido       =  res2.itped
            
      
            if (this.cproveedores!==null && this.cproveedores.length>0){        
               if (this.itpedido !== null){
                this.operacion = "Modificar Item de Pedido Nro. "+this.data.nropedido;
                this.formItPed.controls['nropedido'].setValue(this.itpedido.nropedido);
                this.formItPed.controls['nrorenglon'].setValue(this.itpedido.nrorenglon);
                this.formItPed.controls['nroproveedor'].setValue(this.itpedido.nroproveedor);
                this.formItPed.controls['codigo'].setValue(this.itpedido.codigo);
                this.formItPed.controls['descripcion'].setValue(this.itpedido.descripcion);
                this.formItPed.controls['cantidad'].setValue(this.itpedido.cantidad);
                this.formItPed.controls['coment'].setValue(this.itpedido.coment);
                this.isloading = false;
                this.cdr.detectChanges()
               } else {
                 this.notiService.showNotification("No se encuentra el item de pedido",'Aceptar','mensaje',500);    
               }                                        
            } else { 
              this.notiService.showNotification("No existen proveedores registrados",'Aceptar','mensaje',500);  
            }

        })
      }

   }
  initFormulario(){
     this.formItPed = this.fb.group({        
      nropedido     : [''],       
      nrorenglon    : [''],    
      nroproveedor  : [0], 
      codigo        : [''],
      descripcion   : ['',Validators.required],           
      cantidad      : [0,Validators.min(1)],
      coment        : ['']
    })    
  }

  prepararAlta(){
    this.formItPed.patchValue({
      nropedido     : this.data.nropedido,
      nrorenglon    : this.data.nrorenglon,
      nroproveedor  : this.data.nroprov,
      codigo        : '',
      descripcion   : '',           
      cantidad      : 0,
      coment        : ''
    })
  }
onSelectionProv(nroprov : number){
  this.formItPed.controls['nroproveedor'].setValue(nroprov);

  }
modificoCodigo(){
    var codi : string = this.formItPed.controls['codigo'].value;
    var nroprov : number = this.formItPed.controls['nroproveedor'].value;

    if (codi!=='' && nroprov>0){}
}
modificoDescripcion(){
    var desc : string = this.formItPed.controls['descripcion'].value;
    var nroprov : number = this.formItPed.controls['nroproveedor'].value;

    if (desc!=='' && nroprov>0){}
}
AgregarItemPedido(){
var itped : renpedidoDTO = {
  nropedido    : this.formItPed.controls['nropedido'].value,
  nrorenglon   : this.formItPed.controls['nrorenglon'].value,
  nroproveedor : this.formItPed.controls['nroproveedor'].value,
  codigo       : this.formItPed.controls['codigo'].value,
  descripcion  : this.formItPed.controls['descripcion'].value,
  cantidad     : this.formItPed.controls['cantidad'].value,
  coment       : this.formItPed.controls['coment'].value,
}
 
var subs : Subscription;
var resu = "";
subs = this.servicio.grabarItemPedido(itped,this.data.cantit)  
  .pipe(finalize(() => {   
    this.notiService.showNotification("El Item de Pedido Nro "+itped.nrorenglon+" se ha agregado con éxito("+resu+')','Aceptar','mensaje',500); 
    subs.unsubscribe();
    this.dialogRef.close({ clicked : "Alta"})
  }))                  
  .subscribe((data : any): void => {resu= data});   
}


ModificarItemPedido(){
var itped : renpedidoDTO = {
  nropedido    : this.formItPed.controls['nropedido'].value,
  nrorenglon   : this.formItPed.controls['nrorenglon'].value,
  nroproveedor : this.formItPed.controls['nroproveedor'].value,
  codigo       : this.formItPed.controls['codigo'].value,
  descripcion  : this.formItPed.controls['descripcion'].value,
  cantidad     : this.formItPed.controls['cantidad'].value,
  coment       : this.formItPed.controls['coment'].value,
}
 
var subs : Subscription;
var resu = "";
subs = this.servicio.updateItemPedido(itped)  
  .pipe(finalize(() => {   
    this.notiService.showNotification("El Item de Pedido Nro "+itped.nrorenglon+" ha sido modificado con éxito("+resu+')','Aceptar','mensaje',500); 
    subs.unsubscribe();
    this.dialogRef.close({ clicked : "Modi"})
  }))                  
  .subscribe((data : any): void => {resu= data});  
}

chleerArtic(checked : boolean){
  if (checked){
  this.leerArtic = 1
} else {
  this.leerArtic = 0
}

}

BusqEnLista(){
  // llama al componente "busqlista" para buscar un articulo de la lista
  const nrop = this.formItPed.controls['nroproveedor'].value;
  const indp = this.cproveedores.findIndex(p=>p.Idproveedor===nrop);
  const listaa   = this.cproveedores[indp].nomlista;
 
  
    const datas : intBusqArt = {
      lista       : listaa,
      Selmult     : 0,           
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '1000px';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = '600px';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
    const dialogRef =  this.dialog.open(BusqlistaComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (datas:any) => { if (datas.clicked === 'Acepto' && datas.articulos){                   
               // me devuelve solo un item -> seleccion simple
   
               this.formItPed.controls['codigo'].setValue(datas.articulos[0].codigo);
               this.formItPed.controls['descripcion'].setValue(datas.articulos[0].descripcion);
               this.isloading = false;
               this.cdr.detectChanges()
                       }})  
}


  Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }
}
