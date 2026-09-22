import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { PedidosService } from '../../../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { artListaDDTO, artListaDTO, intBusqArt } from '../../../../entidades/artListaDTO';
import { forkJoin } from 'rxjs';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SelecTextDirective } from '../../../Directivas/selectTextDirective';

@Component({
  selector: 'app-busqlista',
  imports: [CommonModule,MatTableModule, DecimalPipe, DatePipe, DragDropModule, SelecTextDirective],
  providers : [DecimalPipe,DatePipe],
  templateUrl: './busqlista.component.html',
  styleUrl: './busqlista.component.css'
})
export class BusqlistaComponent {
  @ViewChild('prefcodigo') inputCod!: ElementRef<HTMLInputElement>;
  @ViewChild('txtdesc')    inputDesc!: ElementRef<HTMLInputElement>;

  isloading : boolean = true;
  lista     : string; // nombre de lista a buscar
  codib     : string; // prefijo de codigo a buscar en la lista
  descb     : string; // para buscar dentro de la descripcion en la lista

  cartprov  : artListaDTO[]=[];
  cartprovd : artListaDDTO[]=[];  // con sel para mostrar en html
  cantitems : number;
  itemsSel  : number = 0;  // cantidad de items de lista seleccionados
  selMult   : number = 0;  // 0-Seleccion Simple, 1-Seleccion Multiple
  dataSource = new MatTableDataSource<any>();
  titulo    : string;
  
  constructor( private   servicio       : PedidosService,              
               private   router         : Router,
               private   rutaActiva     : ActivatedRoute,
               private   cdr            : ChangeDetectorRef,
               private   notiService    : NotiserviceService,
               public    dialogRef      : MatDialogRef<BusqlistaComponent>,
               @Inject(MAT_DIALOG_DATA) public data: intBusqArt,  
              
            
                              ) {       
   }   

   colLista: string[] = ["codigo" , "descripcion", "precio","unidad","moneda","fechaup","sel"];
   
   ngOnInit(){    
   

     this.lista   = this.data.lista;
    this.codib  = " ";
    this.descb  = " ";
    this.titulo = "Seleccionar articulo de lista : "+this.lista;    
    this.busqEnListaxCod(this.codib)
    
     
     
   }

   busqEnListaxCod(codb : string){
        this.cartprov   = [];
        
        forkJoin({
            artiprov : this.servicio.getArticulosListaxCod(this.lista,codb),
        
          }).subscribe(res => {   
            this.cartprov    = res.artiprov;         
                
            this.cantitems = this.cartprov==undefined ? 0 : this.cartprov.length;
            if (this.cantitems==0){
                     this.notiService.showNotification("No existen articulos con pref. de código "+codb,"Aceptar","mensaje",3000);                     
                     this.isloading = false;
                     this.cdr.detectChanges();
             } else {     
                    // mapeo para mostrar "sel"     
                   this.cartprovd = this.cartprov.map((item) => ({
                     codigo      : item.codigo,
                     codbarra    : item.codbarra,
                     descripcion : item.descripcion.length>50?item.descripcion.slice(0,49):item.descripcion,
                     precio      : item.precio,
                     tiva        : item.tiva,
                     unidad      : item.unidad,
                     moneda      : item.moneda,
                     fechaup     : item.fechaup,
                     sel         : 0,

                    }));
      
                    this.dataSource.data = this.cartprovd;                                        
                    this.isloading = false;
                    this.cdr.detectChanges(); // Forzar la detección de cambios
                  }
          });
      
     }

  busqEnListaxDesc(desb : string){
        this.cartprov   = [];
        
        forkJoin({
            artiprov : this.servicio.getArticulosListaxDesc(this.lista,desb),
        
          }).subscribe(res => {   
            this.cartprov    = res.artiprov;         
                
            this.cantitems = this.cartprov==undefined ? 0 : this.cartprov.length;
            if (this.cantitems==0){
                     this.notiService.showNotification("No existen articulos que contengan "+desb,"Aceptar","mensaje",3000);                     
                     this.isloading = false;
                     this.cdr.detectChanges();
             } else {     
                    // mapeo para mostrar "sel"     
                   this.cartprovd = this.cartprov.map((item) => ({
                     codigo      : item.codigo,
                     codbarra    : item.codbarra,
                     descripcion : item.descripcion,
                     precio      : item.precio,
                     tiva         : item.tiva,
                     unidad      : item.unidad,
                     moneda      : item.moneda,
                     fechaup     : item.fechaup,
                     sel         : 0,

                    }));
      
                    this.dataSource.data = this.cartprovd;                                        
                    this.isloading = false;
                    this.cdr.detectChanges(); // Forzar la detección de cambios
                  }
          });
      
     }     

 Anular(){
    this.dialogRef.close({ clicked : "Cancelar"})
}


ingresoCodigo(prefc : string){
  this.busqEnListaxCod(prefc);
  this.inputDesc.nativeElement.value = ""
}

ingresoDesc(textodesc : string){
  this.busqEnListaxDesc(textodesc);
  this.inputCod.nativeElement.value = ""
}

seleccionoFila(codigoSelected: string) {
  // 1. Buscamos el elemento en el arreglo original de datos
  
    if (this.data.Selmult==0){ // seleccion simple -> borrar selecciones anteriores
       this.dataSource.data.forEach(x => x.sel = 0)
    };
    const   item = this.dataSource.data.find(x => x.codigo === codigoSelected);
    
    if (item) {
    /* Alternativa A: Si quieres que solo se pueda seleccionar UNA fila a la vez (limpia las demás)
    this.dataSource.data.forEach(x => x.sel = null); // O x.sel = 0 según prefieras
    item.sel = 1;*/
    
    
    // Alternativa B: Si permites selección MÚLTIPLE (comenta la Alternativa A y usa esta)
    if (item.sel === 1){
       item.sel = 0
       this.itemsSel--
    } else {
      item.sel = 1
      this.itemsSel++
    }
    
    

    // 2. IMPORTANTE: Angular Material necesita que le avises al dataSource que los datos cambiaron
    this.dataSource._updateChangeSubscription(); 
  }
}  
  
 aceptarSeleccion(){
  // Filtramos el arreglo de datos original buscando los que tengan sel igual a 1
  const articulosSeleccionados = this.dataSource.data.filter(item => item.sel === 1);

  // Cerramos el diálogo y enviamos el estado 'Acepto' junto con la lista de artículos
  this.dialogRef.close({
    clicked: 'Acepto',
    articulos: articulosSeleccionados
  });
 }


}
