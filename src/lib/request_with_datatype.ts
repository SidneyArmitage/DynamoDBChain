import { Request_base } from "./request_base";
import { Communications } from "./communication";

export interface IAttributeMap {
  [name: string]: IDatatype
}

export interface IDatatype {
  B?: string
  BOOL?: boolean
  BS?: string[] | never[]
  L?: any[] | never[]
  M?: IAttributeMap
  N?: string
  NS?: string[] | never[]
  NULL?: boolean
  S?: string
  SS?: string[] | never[]
}

export class Request_with_datatype extends Request_base {

  constructor (communication: Communications, request_type: string) {
    super(communication, request_type)
  }

  protected detectArrayType (array: any[]): IDatatype{
    var specified: string = typeof array[0]
    var isList: boolean
    if(typeof array[0] === 'object'){
      specified = 'buffer'
      isList = !array.every((element) => element instanceof Buffer)
    } else {
      isList = !array.every((element) => typeof element === specified)
    }
    return isList ? {L: array}
         : specified === 'string' ? {SS: array}
         : specified === 'number' ? {NS: array}
         : specified === 'buffer' ? {BS: array.map(e => e.toString('ascii'))}
         :                          {L: array}
  }
  
  protected detectDataType(data: any):IDatatype | Error {
    let dataType: string = typeof data
    return dataType === 'boolean'     ? {BOOL: data}
         : dataType === 'string'      ? {S: data}
         : dataType === 'number'      ? {N: data.toString()}
         : data == null               ? {NULL: true}
         : data instanceof Buffer     ? {B: data.toString('ascii')}
         : data instanceof Array      ? this.detectArrayType(data)
         : dataType === 'object'      ? {M: data}
         : Error('Unknown datatype: ' + dataType)
  }
  
}