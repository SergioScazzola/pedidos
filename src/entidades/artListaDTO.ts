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
    codi    : string;
    desc    : string
}
