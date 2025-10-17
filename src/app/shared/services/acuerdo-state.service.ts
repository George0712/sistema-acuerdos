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
  codigo?: string;
  placa?: string;
  numeroResolucion?: string;
  fechaResolucion?: string;
  interesMora?: string;
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
  private readonly STORAGE_KEYS = {
    INFRACTOR: 'acuerdo_infractor',
    ACUERDO_DATA: 'acuerdo_data',
    DOCUMENTS_UPLOADED: 'acuerdo_documents_uploaded'
  };

  private infractorSubject = new BehaviorSubject<Infractor | null>(this.loadFromStorage(this.STORAGE_KEYS.INFRACTOR));
  public infractor$: Observable<Infractor | null> = this.infractorSubject.asObservable();

  private acuerdoDataSubject = new BehaviorSubject<AcuerdoData | null>(this.loadFromStorage(this.STORAGE_KEYS.ACUERDO_DATA));
  public acuerdoData$: Observable<AcuerdoData | null> = this.acuerdoDataSubject.asObservable();

  private documentsUploadedSubject = new BehaviorSubject<boolean>(this.loadFromStorage(this.STORAGE_KEYS.DOCUMENTS_UPLOADED) || false);
  public documentsUploaded$: Observable<boolean> = this.documentsUploadedSubject.asObservable();

  private loadFromStorage<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return null;
    }
  }

  private saveToStorage<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  setInfractor(infractor: Infractor | null): void {
    this.infractorSubject.next(infractor);
    this.saveToStorage(this.STORAGE_KEYS.INFRACTOR, infractor);
  }

  getInfractor(): Infractor | null {
    return this.infractorSubject.value;
  }

  setAcuerdoData(data: AcuerdoData): void {
    this.acuerdoDataSubject.next(data);
    this.saveToStorage(this.STORAGE_KEYS.ACUERDO_DATA, data);
  }

  getAcuerdoData(): AcuerdoData | null {
    return this.acuerdoDataSubject.value;
  }

  setDocumentsUploaded(uploaded: boolean): void {
    this.documentsUploadedSubject.next(uploaded);
    this.saveToStorage(this.STORAGE_KEYS.DOCUMENTS_UPLOADED, uploaded);
  }

  getDocumentsUploaded(): boolean {
    return this.documentsUploadedSubject.value;
  }

  isConfirmationReady(): boolean {
    return this.infractorSubject.value !== null &&
           this.documentsUploadedSubject.value &&
           this.acuerdoDataSubject.value !== null &&
           (this.acuerdoDataSubject.value?.installments.length || 0) > 0;
  }

  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEYS.INFRACTOR);
    localStorage.removeItem(this.STORAGE_KEYS.ACUERDO_DATA);
    localStorage.removeItem(this.STORAGE_KEYS.DOCUMENTS_UPLOADED);
    localStorage.removeItem('acuerdo_documents_metadata');
    localStorage.removeItem('acuerdo_form_data');
    this.infractorSubject.next(null);
    this.acuerdoDataSubject.next(null);
    this.documentsUploadedSubject.next(false);
  }
}
