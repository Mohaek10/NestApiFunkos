import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import * as process from 'process'
import { Notificacion } from './models/notificacion.model'
import { ResponseFunkoDto } from '../../funkos/dto/response-funko.dto'
const ENDPOINT: string = `/ws/${process.env.VERSION || 'api'}/funkos`

@WebSocketGateway({
  namespace: ENDPOINT,
})
export class FunkosNotificationsGateway {
  @WebSocketServer()
  private server: Server
  private readonly logger = new Logger(FunkosNotificationsGateway.name)

  constructor() {
    this.logger.log(`FunkosNotificationsGateway is listening on ${ENDPOINT}`)
  }

  sendMessage(notification: Notificacion<ResponseFunkoDto>) {
    this.server.emit('updates', notification)
  }

  private handleConnection(client: Socket) {
    this.logger.debug('Cliente conectado:', client.id)
    this.server.emit('connection', 'Updates Notifications WS: Funkos')
  }

  private handleDisconnect(client: Socket) {
    console.log('Cliente desconectado:', client.id)
    this.logger.debug('Cliente desconectado:', client.id)
  }
}
