import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { proveedorDTO} from '../entidades/proveedorDTO';
import { articuloDTO } from '../entidades/articuloDTO';
import { pedidoDTO } from '../entidades/pedidoDTO';
import { renpedidoDTO,renpedidos } from '../entidades/renpedidoDTO';
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

  public getArticulosxCod(codi : string){   
        return this.http.get<articuloDTO[]>(this.apiUrl+`articulosxCod?pcod=`+codi);    
  }
    

  public getArticulosListaxCod(lista : string, codi : string){       
      return this.http.get<articuloDTO[]>(this.apiUrl+`listasxCod?lis=`+lista+`&&cod=`+codi);    
  }

  public getArticulosxDesc(desc : string){   
    return this.http.get<articuloDTO[]>(this.apiUrl+`articulosxDesc?desc=`+desc);    
  }
 
  public getArticulosListaxDesc(lista : string, desc : string){       
   return this.http.get<articuloDTO[]>(this.apiUrl+`listasxDesc?lis=`+lista+`&&des=`+desc);    
  }

  public getPedidos() {
     return this.http.get<pedidoDTO[]>(this.apiUrl+`pedidos`);    
  } 

  public getDetallePedido(nrop : number){    
     return this.http.get<renpedidoDTO[]>(this.apiUrl+`pedidos/detalle?id=`+nrop);    
  } 

  public getMaxPedidos() {
      return this.http.get<number>(this.apiUrl + `pedidos/max`);  
  }

  public crearPedido(nroproveedor : number,nombprov : string){
     return this.http.post<pedidoDTO>(this.apiUrl+`pedidos/nuevo?nroprov=`+nroproveedor+'&&nomprov='+nombprov,null);    
  }
  
  public elimPedido(idpedido: number) {
    return this.http.delete(this.apiUrl + `pedidos/delete?id=` +idpedido);
  }




  public grabarItems(lrenped : renpedidoDTO[]){
    // Actualiza también la cabecera del pedido
    return this.http.post<string>(this.apiUrl+`pedidos/actualizarDet`,lrenped);    
  }

  public modificarItems(lrenped : renpedidoDTO[]){    
    return this.http.put<renpedidos>(this.apiUrl+`pedidos/modificar`,lrenped);    
  }

  public actualizarPedido(nrope : number,cantit : number){   
    return this.http.put<pedidoDTO>(this.apiUrl+`pedidos/actualizarCab?nrop=`+nrope+`&cantitems=`+cantit,null);  
  }
  public obtenerCabPedido(nroped : number){
    return this.http.get<pedidoDTO>(this.apiUrl+`pedidos?id=`+nroped);    
  }
}
