import { Component, Inject,NgZone,ChangeDetectorRef, QueryList, ViewChildren} from '@angular/core';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDateFormats, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';

import { PedidosService } from '../../../../servicios/service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { finalize, forkJoin, Subscription } from 'rxjs';



import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelecTextDirective } from '../../../Directivas/selec-text.directive';
import { intCabPedido, pedidoDTO } from '../../../../entidades/pedidoDTO';
import { proveedorDTO } from '../../../../entidades/proveedorDTO';


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
  selector: 'app-cabpedido',
   imports: [MatFormField,
    MatLabel,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatSelectModule,
    DragDropModule,
    SelecTextDirective],
    providers: [
    DatePipe,
    CurrencyPipe
   
],   
  templateUrl: './cabpedido.component.html',
  styleUrl: './cabpedido.component.css'
})
export class CabpedidoComponent {
isloading       : boolean = true;
operacion       : string;
formPed         : FormGroup;
proxPed         : number;
cproveed        : proveedorDTO[]=[];


hoy             : Date = new Date;
importeformat   : string = "";


  constructor(    public  fb          : FormBuilder,
                  private currencyPipe: CurrencyPipe,
                  private servicio    : PedidosService,                
                  public  dialogRef    : MatDialogRef<CabpedidoComponent>,
                  private cdr         : ChangeDetectorRef,
                  private zone        : NgZone,
                  @Inject(MAT_DIALOG_DATA) public data: intCabPedido,  
                  private notiService : NotiserviceService )
       {  }

 
  ngOnInit(){
    //registerLocaleData(localeEsAR, 'es-AR');
    this.initFormulario();      
    
    if (this.data.accion==="A"){  // Alta de Pedido
      this.mostrarHora();
      var subs : Subscription;
      subs = this.servicio.getProveedores()
        .pipe(finalize(() => 
           {if (this.cproveed!==null && this.cproveed.length>0){
                 
                this.operacion = "Agregar Pedido Nro.: "+this.data.nropedido;
                this.prepararAlta();      
                this.isloading = false;
                this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo      
            } else { 
               this.notiService.showNotification("No existen proveedores registrados",'Aceptar','mensaje',500);  
            }             
           }))
         .subscribe((data : any): void => {
                          this.cproveed = data});  
            
         }

      

   }
  

  initFormulario(){
     this.formPed = this.fb.group({        
      nropedido     : [0, Validators.required],
      fechaalta     : ['', Validators.required], 
      idproveedor  : [0, Validators.required],  
      proveedor     : [''],   
      cantitems     : [0, Validators.required],     
      coment        : [''] 
    
    })    
  }

  prepararAlta(){
    this.formPed.controls['nropedido'].setValue(this.data.nropedido);
    this.formPed.controls['fechaalta'].setValue(this.hoy);
    this.formPed.controls['idproveedor'].setValue(0);
    const indp = this.cproveed.findIndex(prov => prov.idproveedor === 0);
    this.formPed.controls['proveedor'].setValue(this.cproveed[0].nombre);
   
  }

  mostrarHora() {
   this.zone.runOutsideAngular(() => {
    setInterval(() => {
      const hoy = new Date();
      const valorControl = this.formPed.controls['fechaalta'].value;
      
      if (valorControl) {
        const fechaform = new Date(valorControl);
        fechaform.setHours(hoy.getHours(), hoy.getMinutes(), hoy.getSeconds());

        // Volvemos a la zona de Angular solo para actualizar el valor
        this.zone.run(() => {
          this.formPed.controls['fechaalta'].setValue(fechaform, { emitEvent: false });
          this.cdr.detectChanges(); // Forzamos la actualización sin romper el ciclo
        });
      }
    }, 1000);
  }) 
  }

    onFechaChange(event: any) {
    const nuevaFecha: Date = event.value; // Fecha seleccionada en el datepicker
    const ahora = new Date(); // Hora actual
  
    // Copiar la hora actual a la fecha seleccionada
    nuevaFecha.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds(), 0);

    // Establecer la fecha con hora en el form
    this.formPed.controls['fechaalta'].setValue(nuevaFecha);
  }

  onSelectionChangeProveedor(event : any) {
   /* const selectedProveedor = this.cproveed.findIndex(prov => prov.nombre === event.value);
    this.formPed.controls['nroproveedor'].setValue(this.cproveed[selectedProveedor].idproveedor);    */
}

AgregarPedido(){
  if (this.formPed.invalid) {
    this.notiService.showNotification("Complete todos los campos obligatorios",'Aceptar','mensaje',500);  
    return;
  }
}

  Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
  }


}
