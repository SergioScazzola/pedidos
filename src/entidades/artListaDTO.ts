import { renpedidoDTO } from "./renpedidoDTO";

export interface artListaDTO {
    // tipo para recibir articulos de lista del proveedor de la API
    codigo        : string;
    codbarra      : string;
    descripcion   : string;
    precio        : number;
    tiva          : number;
    unidad        : string;
    moneda        : string;
    fechaup       : Date;  
}

export interface artListaDDTO {
    // tipo para mostrar en html con campo "sel" para seleccionar
    codigo        : string;
    codbarra      : string;
    descripcion   : string;
    precio        : number;
    tiva          : number;
    unidad        : string;
    moneda        : string;
    fechaup       : Date;  
    sel           : number;
}

export interface intBusqArt {
    lista   : string;
    nroprov : number;
    Selmult : number; // 0-Simple 1-Multiple
   
}

export interface selMultB {  // usada para seleccion multiple, para enviar al back a grabar items agregados
    cantitped    : number;
    items        : renpedidoDTO[]    
}
