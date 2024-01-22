import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class ObjectIdValidatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('El id no es valido')
    }
    return ObjectId.createFromHexString(value)
  }
}
