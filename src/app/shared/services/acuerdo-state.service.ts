import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Infractor } from './infractor.service';

@Injectable({
  providedIn: 'root'
})
export class AcuerdoStateService {
  private infractorSubject = new BehaviorSubject<Infractor | null>(null);
  public infractor$: Observable<Infractor | null> = this.infractorSubject.asObservable();

  setInfractor(infractor: Infractor | null): void {
    this.infractorSubject.next(infractor);
  }

  getInfractor(): Infractor | null {
    return this.infractorSubject.value;
  }
}
