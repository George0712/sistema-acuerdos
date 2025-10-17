import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
  documentoIdentidadInfractor: File | null = null;
  documentoIdentidadApoderado: File | null = null;
  cartaAutorizacion: File | null = null;

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
