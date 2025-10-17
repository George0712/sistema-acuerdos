import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfractorService, Infractor } from '../../../../shared/services/infractor.service';
import { AcuerdoStateService } from '../../../../shared/services/acuerdo-state.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-datos-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent implements OnInit, OnDestroy {
  private readonly STORAGE_KEY = 'acuerdo_form_data';
  private saveSubject = new Subject<void>();

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

  constructor(
    private infractorService: InfractorService,
    private acuerdoStateService: AcuerdoStateService
  ) {
    // Auto-save form data with debounce
    this.saveSubject.pipe(debounceTime(500)).subscribe(() => {
      this.saveFormData();
    });
  }

  ngOnInit(): void {
    this.loadFormData();
    this.infractorEncontrado = this.acuerdoStateService.getInfractor();
  }

  ngOnDestroy(): void {
    this.saveSubject.complete();
  }

  onFormChange(): void {
    this.saveSubject.next();
  }

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
          this.acuerdoStateService.setInfractor(infractor);
          this.cargarDatosInfractor(infractor);
          this.mensajeError = '';
        } else {
          this.infractorEncontrado = null;
          this.acuerdoStateService.setInfractor(null);
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

    this.saveFormData();
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
    this.saveFormData();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private saveFormData(): void {
    const formData = {
      registrarApoderado: this.registrarApoderado,
      nombreApoderado: this.nombreApoderado,
      fechaNacimientoApoderado: this.fechaNacimientoApoderado,
      tipoDocumentoApoderado: this.tipoDocumentoApoderado,
      numeroDocumentoApoderado: this.numeroDocumentoApoderado,
      ciudadExpedicionApoderado: this.ciudadExpedicionApoderado,
      tarjetaProfesionalApoderado: this.tarjetaProfesionalApoderado,
      usarMismaDireccion: this.usarMismaDireccion,
      direccion: this.direccion,
      departamento: this.departamento,
      ciudad: this.ciudad,
      telefonoAlternativo: this.telefonoAlternativo,
      correoAdicional: this.correoAdicional
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(formData));
  }

  private loadFormData(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const formData = JSON.parse(stored);
        this.registrarApoderado = formData.registrarApoderado || false;
        this.nombreApoderado = formData.nombreApoderado || '';
        this.fechaNacimientoApoderado = formData.fechaNacimientoApoderado || '';
        this.tipoDocumentoApoderado = formData.tipoDocumentoApoderado || '';
        this.numeroDocumentoApoderado = formData.numeroDocumentoApoderado || '';
        this.ciudadExpedicionApoderado = formData.ciudadExpedicionApoderado || '';
        this.tarjetaProfesionalApoderado = formData.tarjetaProfesionalApoderado || '';
        this.usarMismaDireccion = formData.usarMismaDireccion || false;
        this.direccion = formData.direccion || '';
        this.departamento = formData.departamento || '';
        this.ciudad = formData.ciudad || '';
        this.telefonoAlternativo = formData.telefonoAlternativo || '';
        this.correoAdicional = formData.correoAdicional || '';
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error);
    }
  }
}
