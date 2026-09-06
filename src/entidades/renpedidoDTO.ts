import { DecimalPipe } from "@angular/common";

export interface renpedidoDTO {
    nropedido    : number;
    nrorenglon   : number;
    nroproveedor : number;
    codigo       : string;
    descripcion  : string;
    cantidad     : number;
    coment       : string;
}

export interface renpedidos {
    renpedidos : renpedidoDTO[];
}