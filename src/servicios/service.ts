import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { proveedorDTO} from '../entidades/proveedorDTO';
import { artListaDTO } from '../entidades/artListaDTO';
import { pedidoDTO } from '../entidades/pedidoDTO';
import { renpedidoDTO } from '../entidades/renpedidoDTO';
import { ConfigService } from './config.service';



@Injectable({
  providedIn: 'root'
})

export class PedidosService {
  private apiUrl    : string;
  
  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.getApiUrl();
  }
         
  public getProveedores(){    
    return this.http.get<proveedorDTO[]>(this.apiUrl+`proveedores`);    
  }

  // Llamadas a la API

  
    
  // Articulos de Lista del proveedor
  public getArticulosListaxCod(lista : string, codi : string){       
      return this.http.get<artListaDTO[]>(this.apiUrl+`listasxCod?lis=`+lista+`&&cod=`+codi);    
  }

  public getArticulosListaxDesc(lista : string, desc : string){       
      return this.http.get<artListaDTO[]>(this.apiUrl+`listasxDes?lis=`+lista+`&&des=`+desc);    
  }

  /* Articulos de ARTICULOS
  public getArticulosxCod(codi : string){   
        return this.http.get<articuloDTO[]>(this.apiUrl+`articulosxCod?pcod=`+codi);    
  }

  public getArticulosxDesc(desc : string){   
    return this.http.get<articuloDTO[]>(this.apiUrl+`articulosxDesc?desc=`+desc);    
  }*/
 
 

  public getPedidos() {
     return this.http.get<pedidoDTO[]>(this.apiUrl+`pedidos`);    
  } 

  public getDetallePedido(nrop : number){    
     return this.http.get<renpedidoDTO[]>(this.apiUrl+`pedidos/detalle?id=`+nrop);    
  } 

  public getItemPedido(nrop : number, nritem : number){
    return this.http.get<renpedidoDTO>(this.apiUrl+`pedidos/itpedido?idpedido=`+nrop+`&nroitem=`+nritem);    
  }

  public getMaxPedidos() {
      return this.http.get<number>(this.apiUrl + `pedidos/max`);  
  }

public getMaxDetPedido(nroped : number){
    return this.http.get<number>(this.apiUrl + `pedidos/maxdet?id=` + nroped);
}
  public crearPedido(pedido : pedidoDTO) {
     return this.http.post<pedidoDTO>(this.apiUrl+`pedidos/nuevo`, pedido);
  }
  
  public elimPedido(idpedido: number) {
    return this.http.delete(this.apiUrl + `pedidos/delete?id=` +idpedido);
  }




 public grabarItemPedido(itpedido : renpedidoDTO,cantit : number) {
     return this.http.post<renpedidoDTO>(this.apiUrl+`pedidos/nuevoitem?cantit=`+cantit,itpedido);
  }

public updateItemPedido(itpedido : renpedidoDTO){
    return this.http.put<renpedidoDTO>(this.apiUrl+`pedidos/updateitem`,itpedido);  
}
  

  public actualizarPedido(nrope : number,cantit : number){   
    return this.http.put<pedidoDTO>(this.apiUrl+`pedidos/actualizarCab?nrop=`+nrope+`&cantitems=`+cantit,null);  
  }
  public obtenerCabPedido(nroped : number){
    return this.http.get<pedidoDTO>(this.apiUrl+`pedidos?id=`+nroped);    
  }
}
