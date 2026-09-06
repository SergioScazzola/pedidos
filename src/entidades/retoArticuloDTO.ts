export interface retoArticuloDTO {
    // tipo para devolver los datos de articulo y la cantidad solicitada
    codigo        : string;
    descripcion   : string;
    precio        : number;
    tiva          : number;
    unidad        : string;
    moneda        : string;
    indcompra     : number;
    margen        : number;
    fecha_act     : Date;
    cantidad      : number;
}