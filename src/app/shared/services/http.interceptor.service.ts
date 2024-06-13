import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JsonResponse } from '../interfaces/json-response';
import { MatDialog } from '@angular/material/dialog';
import { CardMessageComponent } from '../pages/card-message/card-message.component';

// export interface DialogData {
//   mensaje?: string;
// }

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  status: string = '';
  mensaje: string = '';
  constructor(public dialog: MatDialog) {}

  openDialog(statusResponse: string, message: string) {
    this.dialog.open(CardMessageComponent, {
      data: {
        status: statusResponse,
        mensaje: message,
      },
      width: '30%',
    });
  }

  /**
   * Interceptor para manejar las respuestas HTTP.
   *
   * @param request - La solicitud HTTP.
   * @param next - El siguiente manejador de solicitudes HTTP.
   * @returns Un Observable que emite eventos HTTP.
   */
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          if (event.body && 'statusCode' in event.body) {
            const statusCode = (event.body as JsonResponse<any>).statusCode;
            const message = (event.body as JsonResponse<any>).message;
            switch (statusCode) {
              case 200:
                if (message != null) {
                  this.openDialog('ok', message);
                }
                break;
              case 400:
                // Código de estado 400 (Bad Request)
                // window.alert(message);
                this.openDialog('error', message);
                // window.location.href = '/registro';
                // Ejemplo: Manejar errores de validación o mostrar un mensaje al usuario
                break;
              case 401:
                // Código de estado 401 (Unauthorized)
                // Ejemplo: Redirigir al usuario a la página de inicio de sesión
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login';
                }
                break;
              case 404:
                // Código de estado 404 (Not Found)
                // Ejemplo: Mostrar un mensaje de "recurso no encontrado" al usuario
                break;
              case 500:
                // Código de estado 500 (Internal Server Error)
                // Ejemplo: Mostrar un mensaje genérico de error al usuario o registrar el error en el backend
                break;
              default:
                break;
            }
          }
        }
      })
    );
  }
}
