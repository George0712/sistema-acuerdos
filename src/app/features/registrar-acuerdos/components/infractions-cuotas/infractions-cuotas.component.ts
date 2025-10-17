import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Infractor } from '../../../../shared/services/infractor.service';
import { AcuerdoStateService } from '../../../../shared/services/acuerdo-state.service';

interface Infraction {
  id: number;
  numeroComparendo: string;
  fecha: string;
  valor: number;
  estado: string;
  selected: boolean;
}

interface Installment {
  numero: number;
  fechaVencimiento: string;
  valor: number;
  estado: string;
}

@Component({
  selector: 'app-infractions-cuotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './infractions-cuotas.component.html',
  styleUrl: './infractions-cuotas.component.scss'
})
export class InfractionsCuotasComponent implements OnInit, OnDestroy {
  infractorEncontrado: Infractor | null = null;
  private infractorSubscription?: Subscription;

  infractions: Infraction[] = [];
  installments: Installment[] = [];

  numeroCuotas: number | null = null;
  fechaInicial: string = '';
  tipoInteres: string = '';

  installmentsGenerated = false;

  constructor(private acuerdoStateService: AcuerdoStateService) {}

  ngOnInit(): void {
    this.infractorSubscription = this.acuerdoStateService.infractor$.subscribe(infractor => {
      this.infractorEncontrado = infractor;
      if (infractor) {
        this.loadInfractions();
      } else {
        this.infractions = [];
      }
    });
  }

  ngOnDestroy(): void {
    this.infractorSubscription?.unsubscribe();
  }

  get totalAPagar(): number {
    return this.infractions
      .filter(inf => inf.selected)
      .reduce((sum, inf) => sum + inf.valor, 0);
  }

  get canGenerateInstallments(): boolean {
    return this.numeroCuotas !== null &&
           this.numeroCuotas > 0 &&
           this.fechaInicial !== '' &&
           this.tipoInteres !== '' &&
           this.totalAPagar > 0;
  }

  toggleAllInfractions(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.infractions.forEach(inf => inf.selected = checked);
  }

  get allInfractionsSelected(): boolean {
    return this.infractions.length > 0 && this.infractions.every(inf => inf.selected);
  }

  generateInstallments(): void {
    if (!this.canGenerateInstallments || !this.numeroCuotas) return;

    const valorCuota = this.totalAPagar / this.numeroCuotas;
    const startDate = new Date(this.fechaInicial);

    this.installments = [];

    for (let i = 1; i <= this.numeroCuotas; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + (i - 1));

      this.installments.push({
        numero: i,
        fechaVencimiento: this.formatDate(dueDate),
        valor: valorCuota,
        estado: 'Programada'
      });
    }

    this.installmentsGenerated = true;
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(value);
  }

  private loadInfractions(): void {
    // Simulated infractions data - in a real app, this would come from a service
    this.infractions = [
      {
        id: 1,
        numeroComparendo: '123456',
        fecha: '15/05/2024',
        valor: 450000,
        estado: 'Pendiente',
        selected: false
      },
      {
        id: 2,
        numeroComparendo: '123457',
        fecha: '10/08/2024',
        valor: 300000,
        estado: 'Pendiente',
        selected: false
      }
    ];
  }
}
