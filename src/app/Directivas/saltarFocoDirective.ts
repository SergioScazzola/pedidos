import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appSaltarFoco]',
  standalone: true // Si usas Angular moderno (14+)
})
export class SaltarFocoDirective {
  // Recibe la referencia del siguiente input directamente desde el HTML
  @Input('appSaltarFoco') siguienteElemento!: HTMLElement | any;

@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault();
   
    if (this.siguienteElemento) {
      // 1. Verificamos si es un ElementRef de Angular o el elemento nativo directamente
      const el = this.siguienteElemento.nativeElement 
        ? this.siguienteElemento.nativeElement 
        : this.siguienteElemento;

      // 2. Nos aseguramos de que el método focus exista antes de ejecutarlo
      if (typeof el.focus === 'function') {
         console.log("el.focus === 'function' : "+el);
        el.focus();
      } else {
        console.log("el.focus !== 'function' : "+el);
        console.warn('El elemento destino no puede recibir foco. ¿Olvidaste ponerle tabindex="-1"?');
      }
    }
  }
}

}
