import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink,
  RouterLinkActive, } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navegador',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navegador.component.html',
  styleUrl: './navegador.component.css'
})
export class NavegadorComponent {
  constructor(
    private ruta   : ActivatedRoute,   
    private router : Router
  ) {}
logout(): void {

  localStorage.clear();
  sessionStorage.clear();
  window.close();
  // Ejecuta la orden para cerrar la solapa del navegador
  
  }

}
