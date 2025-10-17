import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcuerdoStateService } from '../../../../shared/services/acuerdo-state.service';

interface FileMetadata {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  documentoIdentidadInfractor: File | null = null;
  documentoIdentidadApoderado: File | null = null;
  cartaAutorizacion: File | null = null;

  private readonly STORAGE_KEY = 'acuerdo_documents_metadata';
  private readonly FORM_DATA_KEY = 'acuerdo_form_data';

  constructor(private acuerdoStateService: AcuerdoStateService) {}

  ngOnInit(): void {
    this.loadDocumentsFromStorage();
  }

  private hasApoderado(): boolean {
    try {
      const stored = localStorage.getItem(this.FORM_DATA_KEY);
      if (stored) {
        const formData = JSON.parse(stored);
        return formData.registrarApoderado === true;
      }
    } catch (error) {
      console.error('Error checking apoderado status:', error);
    }
    return false;
  }

  onFileSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      switch(fileType) {
        case 'infractor':
          this.documentoIdentidadInfractor = file;
          break;
        case 'apoderado':
          this.documentoIdentidadApoderado = file;
          break;
        case 'carta':
          this.cartaAutorizacion = file;
          break;
      }

      // Update documents uploaded status
      this.updateDocumentsStatus();
    }
  }

  private updateDocumentsStatus(): void {
    // Documento del infractor es siempre requerido
    let allDocumentsUploaded = this.documentoIdentidadInfractor !== null;

    // Si hay apoderado registrado, los documentos del apoderado y carta son opcionales
    // Si no hay apoderado, no se requieren estos documentos
    const hasApoderado = this.hasApoderado();
    if (!hasApoderado) {
      // Sin apoderado, solo se requiere el documento del infractor
      allDocumentsUploaded = this.documentoIdentidadInfractor !== null;
    } else {
      // Con apoderado, los documentos adicionales son opcionales
      // Solo se requiere el documento del infractor
      allDocumentsUploaded = this.documentoIdentidadInfractor !== null;
    }

    this.acuerdoStateService.setDocumentsUploaded(allDocumentsUploaded);
    this.saveDocumentsToStorage();
  }

  private saveDocumentsToStorage(): void {
    const metadata = {
      infractor: this.documentoIdentidadInfractor ? {
        name: this.documentoIdentidadInfractor.name,
        size: this.documentoIdentidadInfractor.size,
        type: this.documentoIdentidadInfractor.type
      } : null,
      apoderado: this.documentoIdentidadApoderado ? {
        name: this.documentoIdentidadApoderado.name,
        size: this.documentoIdentidadApoderado.size,
        type: this.documentoIdentidadApoderado.type
      } : null,
      carta: this.cartaAutorizacion ? {
        name: this.cartaAutorizacion.name,
        size: this.cartaAutorizacion.size,
        type: this.cartaAutorizacion.type
      } : null
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metadata));
  }

  private loadDocumentsFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const metadata = JSON.parse(stored);

        // Create mock File objects from metadata to preserve the UI state
        if (metadata.infractor) {
          this.documentoIdentidadInfractor = new File([], metadata.infractor.name, { type: metadata.infractor.type });
        }
        if (metadata.apoderado) {
          this.documentoIdentidadApoderado = new File([], metadata.apoderado.name, { type: metadata.apoderado.type });
        }
        if (metadata.carta) {
          this.cartaAutorizacion = new File([], metadata.carta.name, { type: metadata.carta.type });
        }
      }
    } catch (error) {
      console.error('Error loading documents from localStorage:', error);
    }
  }

  getFileName(fileType: string): string {
    switch(fileType) {
      case 'infractor':
        return this.documentoIdentidadInfractor?.name || 'Documento de identidad del infractor';
      case 'apoderado':
        return this.documentoIdentidadApoderado?.name || 'Documento de identidad del apoderado';
      case 'carta':
        return this.cartaAutorizacion?.name || 'Carta de autorización';
      default:
        return '';
    }
  }

  hasFile(fileType: string): boolean {
    switch(fileType) {
      case 'infractor':
        return this.documentoIdentidadInfractor !== null;
      case 'apoderado':
        return this.documentoIdentidadApoderado !== null;
      case 'carta':
        return this.cartaAutorizacion !== null;
      default:
        return false;
    }
  }

  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }
}
