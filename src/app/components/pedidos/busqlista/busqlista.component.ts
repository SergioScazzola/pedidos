import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { PedidosService } from '../../../../servicios/service';
import { ActivatedRoute, Router } from '@angular/router';
import { artListaDDTO, artListaDTO, intBusqArt } from '../../../../entidades/artListaDTO';
import { forkJoin } from 'rxjs';
import { NotiserviceService } from '../../../../servicios/notiservice.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-busqlista',
  imports: [MatTableModule,DecimalPipe,DatePipe],
  providers : [DecimalPipe,DatePipe],
  templateUrl: './busqlista.component.html',
  styleUrl: './busqlista.component.css'
})
export class BusqlistaComponent {
  isloading : boolean = true;
  lista     : string; // nombre de lista a buscar
  codib     : string; // prefijo de codigo a buscar en la lista
  descb     : string; // para buscar dentro de la descripcion en la lista

  cartprov  : artListaDTO[]=[];
  cartprovd : artListaDDTO[]=[];  // con sel para mostrar en html
  cantitems : number;
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

   colLista: string[] = ["codigo" , "codbarra", "descripcion", "precio","iva","unidad","moneda","fechaup","Sel"];
   
   ngOnInit(){    
   

     this.lista   = this.data.lista;
     this.codib   = this.data.codi;
     this.descb   = this.data.desc;

     this.titulo = "Lista de Precios : "+this.lista;

    if ((this.codib !== '' && this.descb === '')|| this.codib===''){
       this.busqEnListaxCod(this.codib)
    } else {
      this.busqEnListaxDesc(this.descb)
    }          
     
     
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
                     descripcion : item.descripcion,
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
seleccionoFila(cod : string){
  console.log("Filaaa : "+cod);
   // this.cartprovd[fila].sel = 1;
}
}
