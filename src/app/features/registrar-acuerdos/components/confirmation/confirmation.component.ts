import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcuerdoStateService, AcuerdoData } from '../../../../shared/services/acuerdo-state.service';
import { Infractor } from '../../../../shared/services/infractor.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  infractor: Infractor | null = null;
  acuerdoData: AcuerdoData | null = null;
  showModal = false;
  acuerdoNumero = '';
  fechaActual = '';

  constructor(private acuerdoStateService: AcuerdoStateService) {}

  ngOnInit(): void {
    this.infractor = this.acuerdoStateService.getInfractor();
    this.acuerdoData = this.acuerdoStateService.getAcuerdoData();
    this.fechaActual = this.getCurrentDate();
  }

  get selectedInfractions(): number {
    return this.acuerdoData?.selectedInfractions.length || 0;
  }

  get totalAmount(): number {
    return this.acuerdoData?.selectedInfractions.reduce((sum, inf) => sum + inf.valor, 0) || 0;
  }

  get numeroCuotas(): number {
    return this.acuerdoData?.numeroCuotas || 0;
  }

  get valorCuota(): number {
    if (!this.acuerdoData || this.acuerdoData.installments.length === 0) return 0;
    return this.acuerdoData.installments[0].valor;
  }

  getCurrentDate(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(value);
  }

  generatePDF(): void {
    console.log('Generating PDF...');
    // TODO: Implement PDF generation
  }

  saveAcuerdo(): void {
    // Generate acuerdo number
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    this.acuerdoNumero = `AP-${year}-${random}`;

    this.showModal = true;
    console.log('Agreement saved:', this.acuerdoNumero);
    // TODO: Implement actual save logic
  }

  closeModal(): void {
    this.showModal = false;
  }

  createNewAcuerdo(): void {
    this.showModal = false;
    // TODO: Navigate to new agreement or reset form
  }
}
