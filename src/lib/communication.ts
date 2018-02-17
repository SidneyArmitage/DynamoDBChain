/**
 * This file will handle the communications between our 
 * application and typescript.
 * 
 */

import * as http from 'http'
import * as https from 'https'
import * as aws4 from 'aws4'
import { error } from 'util'

const api_target = 'DynamoDB_20120810'
const service = 'dynamodb'

export interface IawsCredentials {
  accessKeyId: string
  secretAccessKey: string
  sessionToken?: string
}

export interface IHost {
  region: string
  domain: string
}

export interface ICommunicationOptions {
  awsCredentials?: IawsCredentials
  host: string | IHost
  method?: string
}

interface IAwsOptions {
  host?: string
  service?:string
  region?:string
  path: string
  port: number
  method: string
  headers: any
  body: string
}

export class Communications {

  private options: IAwsOptions
  private isHTTPs: boolean
  private credentials?: IawsCredentials

  constructor (options: ICommunicationOptions) {
    this.options = {
      headers: {} as any
    } as IAwsOptions
    if(typeof options.host === 'string'){
      this.isHTTPs = options.host.match(/https\:\/\//) !== null
      let host = options
        .host
        .substring(this.isHTTPs ? 8 : 7, options.host.length),
      next = host.match(/\:|\//) as RegExpMatchArray
      // determine host here
      this.options.host = 
        next != null ? 
          host.substr(0, host.indexOf((next)[0])) : 
          host
      // determine port here
      if(host.indexOf(':') != -1){
        let end = host.indexOf('/')
        end = end !== -1 ? end : host.length
        this.options.port = 
          Number
            .parseInt(host.substring(
              host.indexOf(':') + 1,
              end))
        }
      // determine path here
      if(host.indexOf('/') != -1) {
        this.options.path = 
            host.substring(host.indexOf('/'), host.length)
      } else {
        this.options.path = '/'
      }
    }else{
      this.isHTTPs = true
      this.options.service = service 
      this.options.region = options.host.region
//      this.options.path = '/'
    }
    this.credentials = options.awsCredentials
    this.options.method = options.method ? options.method : 'POST'
    this.options.headers['Content-Type'] = 'application/x-amz-json-1.0'
    this.options.headers['User-Agent'] = 'NodeJS'
  }
  public getPort(): number | null{
    return this.options.port || null
  }

  public getHost(): string | undefined {
    return this.options.host
  }

  public getPath(): string {
    return this.options.path
  }

  public getIsHTTPs(): boolean {
    return this.isHTTPs
  }

  public request(operation: string, data?: object): Promise<object>{
    return new Promise<object>((resolve, reject) => {
      let req: http.ClientRequest
      let body = JSON.stringify(data)
      this.options.body = body
      this.options.headers['X-Amz-Target'] = 'DynamoDB_20120810.' + operation
//      console.log('options:', this.options)
//      console.log()
      let request = aws4.sign(this.options, this.credentials)
//      console.log('request:', request)
      if (this.isHTTPs) {
        req = https.request(request, (res) => {
//          console.log(res.headers)
          res.pipe(process.stdout)
          response(res, resolve, reject)
        })
      } else {
        req = http.request(request, (res) => {
//          console.log(res.headers)
          res.pipe(process.stdout)
          response(res, resolve, reject)
        })
      }

      req.on('error', (err) => {
        reject(err)
      })
      req.write(body)
      req.end()
    })
  }

}

function response(res: http.IncomingMessage, resolve: (out: object) => void, reject: (out: any) => void) {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })

  res.on('end', ()  => {
    try {
      resolve(JSON.parse(data))
    } catch(error) {
      reject(error)
    }
  })
}