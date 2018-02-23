import { Communications } from "./communication";

export interface IParams {
  [name: string]: any
}

interface IAttributeMap {
  [name: string]: IDatatype
}

interface IDatatype {
  B?: string
  BOOL?: boolean
  BS?: [string] | never[]
  L?: [any] | never[] //TODO: Not sure - needs investigation
  M?: IAttributeMap //TODO: Not sure - needs investigation
  N?: string
  NS?: [string] | never[]
  NULL?: boolean
  S?: string
  SS?: string | never[]
}

function detectArrayType (array: Array<any>): IDatatype{
  if(array.length === 0) {
    return {L: []}
  }
  var specified = typeof array[0]
  var isList = false
  array.every((element) => {
    if(isList === true) {
      return false
    }
    if(typeof element === specified) {
      return true
    }else {
      isList = true
      return false
    }
  })
  return isList ? {L: array}
       : specified === 'string' ? {SS: array}
       :                          {L: array}
}

function detectDataType(data: any):IDatatype | Error {
  let dataType: string = typeof data
  return dataType === 'boolean'     ? {BOOL: data}
       : dataType === 'string'      ? {S: data}
       : dataType === 'number'      ? {N: data.toString()}
       : data == null               ? {NULL: true}
       : Array.isArray(data)        ? detectArrayType(data)
       : dataType === 'object'      ? {M: data}
       : Error('Unknown datatype: ' + dataType)
}

export class Request_base {

  private communication: Communications
  private request_type: string
  private params: IParams

  constructor(communication: Communications, request_type: string){
    this.communication = communication
    this.request_type = request_type
    this.params = {}
  }

  public getParams():IParams {
    return this.params
  }

  public setParams(params: IParams) {
    this.params = params
  }

  public async execute(): Promise<object>{
    return await this.communication.request(this.request_type, this.params)
  }

}