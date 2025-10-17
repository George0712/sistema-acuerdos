import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Infractor {
  numeroDocumento: string;
  tipoDocumento: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  fechaNacimiento: string;
  edad: number;
  genero: string;
  direccion: string;
  departamento: string;
  ciudad: string;
  telefonoPrincipal: string;
  correoElectronico: string;
  estadoCivil: string;
  ocupacion: string;
  lugarTrabajo: string;
  direccionTrabajo: string;
  telefonoTrabajo: string;
  ingresoMensual: number;
  tipoInfractor: string;
  numeroLicencia: string;
  categoriaLicencia: string;
  vigenciaLicencia: string;
  antecedentes: {
    infracciones: number;
    acuerdosPrevios: number;
    deudaPendiente: number;
    estadoAcuerdos: string;
  };
  observaciones: string;
}

@Injectable({
  providedIn: 'root'
})
export class InfractorService {
  private infractoresUrl = 'assets/data/infractores.json';

  constructor(private http: HttpClient) { }

  buscarPorDocumento(numeroDocumento: string): Observable<Infractor | null> {
    return this.http.get<Infractor[]>(this.infractoresUrl).pipe(
      map(infractores => {
        const infractor = infractores.find(i => i.numeroDocumento === numeroDocumento);
        return infractor || null;
      }),
      catchError(error => {
        console.error('Error al buscar infractor:', error);
        return of(null);
      })
    );
  }

  getAllInfractores(): Observable<Infractor[]> {
    return this.http.get<Infractor[]>(this.infractoresUrl).pipe(
      catchError(error => {
        console.error('Error al obtener infractores:', error);
        return of([]);
      })
    );
  }
}
