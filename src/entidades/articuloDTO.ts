export interface articuloDTO {
    // tipo para recibir de la API
    codigo        : string;
    descripcion   : string;
    precio        : number;
    tiva          : number;
    unidad        : string;
    moneda        : string;
    fecha_act     : Date;
    cantidad      : number;
}

export interface articulos {
    articulos : articuloDTO[];
}