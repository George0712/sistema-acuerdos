import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfractorService, Infractor } from '../../../../shared/services/infractor.service';

@Component({
  selector: 'app-datos-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent {
  // Búsqueda de infractor
  numeroDocumentoBusqueda = '';
  infractorEncontrado: Infractor | null = null;
  buscando = false;
  mensajeError = '';

  // Apoderado
  registrarApoderado = false;
  nombreApoderado = '';
  fechaNacimientoApoderado = '';
  tipoDocumentoApoderado = '';
  numeroDocumentoApoderado = '';
  ciudadExpedicionApoderado = '';
  tarjetaProfesionalApoderado = '';

  // Datos de ubicación
  usarMismaDireccion = false;
  direccion = '';
  departamento = '';
  ciudad = '';
  telefonoAlternativo = '';
  correoAdicional = '';

  constructor(private infractorService: InfractorService) {}

  buscarInfractor(): void {
    if (!this.numeroDocumentoBusqueda.trim()) {
      this.mensajeError = 'Por favor ingrese un número de documento';
      return;
    }

    this.buscando = true;
    this.mensajeError = '';

    this.infractorService.buscarPorDocumento(this.numeroDocumentoBusqueda).subscribe({
      next: (infractor) => {
        this.buscando = false;
        if (infractor) {
          this.infractorEncontrado = infractor;
          this.cargarDatosInfractor(infractor);
          this.mensajeError = '';
        } else {
          this.infractorEncontrado = null;
          this.mensajeError = 'No se encontró ningún infractor con ese número de documento';
        }
      },
      error: (error) => {
        this.buscando = false;
        this.mensajeError = 'Error al buscar el infractor. Por favor intente nuevamente.';
        console.error('Error:', error);
      }
    });
  }

  cargarDatosInfractor(infractor: Infractor): void {
    // Cargar datos de ubicación del infractor
    this.direccion = infractor.direccion;
    this.departamento = infractor.departamento;
    this.ciudad = infractor.ciudad;
    this.telefonoAlternativo = infractor.telefonoPrincipal;
    this.correoAdicional = infractor.correoElectronico;

    // Marcar que se usa la misma dirección por defecto
    this.usarMismaDireccion = true;
  }

  limpiarBusqueda(): void {
    this.numeroDocumentoBusqueda = '';
    this.infractorEncontrado = null;
    this.mensajeError = '';
    this.direccion = '';
    this.departamento = '';
    this.ciudad = '';
    this.telefonoAlternativo = '';
    this.correoAdicional = '';
    this.usarMismaDireccion = false;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
