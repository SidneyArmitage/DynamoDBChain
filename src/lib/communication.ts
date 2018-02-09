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

interface IawsCredentials {
  accessKeyId: string,
  secretAccessKey: string
}

interface IHost {
  region: string,
  domain: string
}

export interface ICommunicationOptions {
  awsCredentials?: IawsCredentials,
  Host?: string | IHost
}

export class Communications {

  constructor (options: ICommunicationOptions) {

  }

  public request() {
  
  }

}