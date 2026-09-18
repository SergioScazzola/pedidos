      
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
import { intBusqArt } from '../../../../entidades/artListaDTO';
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
                this.operacion = "Agregar Item de Pedido Nro. "+this.data.nropedido; ;            
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
                       
                this.operacion = "Modificar Item de Pedido Nro. "+this.data.nropedido;
               
                
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
      nroproveedor  : 0,
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

}

ModificarItemPedido(){

}

chleerArtic(checked : boolean){
  if (checked){
  this.leerArtic = 1
} else {
  this.leerArtic = 0
}

}

BusqXCodigo(){
  // llama al componente "busqlista" para buscar un articulo de la lista
  const nrop = this.formItPed.controls['nroproveedor'].value;
  const indp = this.cproveedores.findIndex(p=>p.Idproveedor===nrop);
  const listaa   = this.cproveedores[indp].nomlista;
  const codig    = this.formItPed.controls['codigo'].value;
  const descri   = this.formItPed.controls['descripcion'].value;
  
    const datas : intBusqArt = {
      lista       : listaa,
      codi        : codig,
      desc        : descri
      
    }  
   
   
    const dialogConfig = new MatDialogConfig();   
    dialogConfig.autoFocus = false;
    dialogConfig.data = datas;
    dialogConfig.width =  '500';         // ancho máximo de la ventana
    dialogConfig.maxWidth = '95vw';      
    dialogConfig.height   = 'auto';        // altura se ajusta al contenido
    dialogConfig.panelClass = 'custom-dialog-container';
    dialogConfig.disableClose =  false; // opcional según necesidad
    const dialogRef =  this.dialog.open(BusqlistaComponent, dialogConfig);
          dialogRef.afterClosed().subscribe( // 
          (datas:any) => { if (datas.clicked === 'Acepto'){                   
                                                                           
                       }})  
}

BusqXDescrip(){
  
}
  Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }
}
