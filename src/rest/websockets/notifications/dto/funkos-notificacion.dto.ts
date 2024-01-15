export class FunkosNotificationDto {
  constructor(
    public id: number,
    public nombre: string,
    public precio: number,
    public cantidad: number,
    public imagen: string,
    public fechaCreacion: Date,
    public fechaActualizacion: Date,
    public isDeleted: boolean,
    public categoria: string,
  ) {}
}
