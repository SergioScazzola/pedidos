
export interface renpedidoDTO {
    nropedido    : number;
    nrorenglon   : number;
    nroproveedor : number;
    codigo       : string;
    descripcion  : string;
    cantidad     : number;
    coment       : string;
}
export interface renpedDTO { // con nombre de proveedor para mostrar en la grilla
    nropedido    : number;
    nrorenglon   : number;
    proveedor    : string;
    codigo       : string;
    descripcion  : string;
    cantidad     : number;
    coment       : string;
}

export interface intRenpedido {
    nropedido    : number;
    nrorenglon   : number;
    cantit       : number;
    nroprov      : number;
    accion       : string;    
}

