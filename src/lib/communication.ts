/**
 * This file will handle the communications between our 
 * application and typescript.
 * 
 * Sign the request using the hash whih the AWS4-HMAC-SHA256 sig
 * https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
 * 
 */

import * as http from 'http'
import * as https from 'https'
import * as aws4 from 'aws4'

const api_target = 'DynamoDB_20120810'
const service = 'dynamodb'

export interface IawsCredentials {
  accessKeyId: string,
  secretAccessKey: string
}

export interface IHost {
  region: string,
  domain: string
}

export interface ICommunicationOptions {
  awsCredentials?: IawsCredentials,
  host: string | IHost
  method?: string
}

interface IAwsOptions {
  host: string
  path: string
  method: string
  headers: any
  body: string
}

export class Communications {

  private options: IAwsOptions
  private isHTTPs: boolean

  constructor (options: ICommunicationOptions) {
    this.options = {} as IAwsOptions
    if(typeof options.host === 'string'){
      this.isHTTPs = options.host.match(/https\:\/\//) !== null
      let host = options
        .host
        .substring(this.isHTTPs ? 8 : 7, options.host.length)
      this.options.host = 
        host.indexOf('/')  != -1 ? 
          host.substr(0, host.indexOf('/')) : 
          host
      this.options.path = 
        host.indexOf('/')  != -1 ? 
          host.substring(host.indexOf('/'), host.length) :
          '/'
    }else{
      this.isHTTPs = true
      this.options.host = 
        service + 
        '.' +
        options.host.region + 
        '.' + 
        options.host.domain
      this.options.path = '/'
    }
    this.options.method = options.method ? options.method : 'POST'
    this.options.body = '{}'
    this.options.headers['Content-Type'] = 'application/x-amz-json-1.0'
    this.options.headers['X-Amz-Target'] = 'DynamoDB_20120810.ListTables'
  }

  public getHost() {
    return this.options.host
  }

  public getPath() {
    return this.options.path
  }

  public getIsHTTPs(): boolean {
    return this.isHTTPs
  }

  public request(): Promise<JSON>{
    return new Promise<JSON>((resolve, reject) => {
      let req: http.ClientRequest
      aws4.sign(this.options)
      if (this.isHTTPs) {
        req = http.request(this.options, (res) => {
          response(res, resolve, reject)
        })
      } else {
        req = https.request(this.options, (res) => {
          response(res, resolve, reject)
        })
      }

      req.on('error', reject)
    })
  }

}

function response(res: http.IncomingMessage, resolve: (out: JSON) => void, reject: (out: any) => void) {

}