import { Communications } from '../../lib/communication';
import { Request_with_datatype, IDatatype } from '../../lib/request_with_datatype'

export class Request_with_datatype_exposed extends Request_with_datatype {

  constructor(communications: Communications) {
    super( communications, 'test')
  }

  public exposed_detectDataType (data: any): IDatatype | Error {
    return this.detectDataType(data)
  }

}