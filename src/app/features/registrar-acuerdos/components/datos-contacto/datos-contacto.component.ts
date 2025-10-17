import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-datos-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent {
  // Apoderado
  registrarApoderado = false;
  nombreApoderado = '';
  tipoDocumentoApoderado = '';
  numeroDocumentoApoderado = '';
  telefonoApoderado = '';
  correoApoderado = '';
  tarjetaProfesionalApoderado = '';

  // Datos de ubicación
  usarMismaDireccion = false;
  direccion = '';
  departamento = '';
  ciudad = '';
  telefonoAlternativo = '';
  correoAdicional = '';
}
