import { Communications } from "./communication";

export interface IParams {
  [name: string]: any
}

interface IDatatype {
  B?: any
  BOOL?: boolean
  BS?: [any]
  L?: [IDatatype] //TODO: Not sure - needs investigation
  M?: [IDatatype] //TODO: Not sure - needs investigation
  N?: string
  NS?: [string]
  NULL?: boolean
  S?: string
  SS?: string
}

function detectDataType(data: any):IDatatype {
  return {}
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