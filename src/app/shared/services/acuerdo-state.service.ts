import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Infractor } from './infractor.service';

export interface Infraction {
  id: number;
  numeroComparendo: string;
  fecha: string;
  valor: number;
  estado: string;
  selected: boolean;
}

export interface Installment {
  numero: number;
  fechaVencimiento: string;
  valor: number;
  estado: string;
}

export interface AcuerdoData {
  selectedInfractions: Infraction[];
  installments: Installment[];
  numeroCuotas: number;
  tipoInteres: string;
  fechaInicial: string;
}

@Injectable({
  providedIn: 'root'
})
export class AcuerdoStateService {
  private infractorSubject = new BehaviorSubject<Infractor | null>(null);
  public infractor$: Observable<Infractor | null> = this.infractorSubject.asObservable();

  private acuerdoDataSubject = new BehaviorSubject<AcuerdoData | null>(null);
  public acuerdoData$: Observable<AcuerdoData | null> = this.acuerdoDataSubject.asObservable();

  setInfractor(infractor: Infractor | null): void {
    this.infractorSubject.next(infractor);
  }

  getInfractor(): Infractor | null {
    return this.infractorSubject.value;
  }

  setAcuerdoData(data: AcuerdoData): void {
    this.acuerdoDataSubject.next(data);
  }

  getAcuerdoData(): AcuerdoData | null {
    return this.acuerdoDataSubject.value;
  }
}
