import { expect } from 'chai'
import * as http from 'http'
import * as net from 'net'
import { Communications , IawsCredentials, IHost} from '../lib/communication'
import * as settings from '../test_settings.json'

const local_DB_host = '127.0.0.1'
const local_DB_port = 8000

const proxy_host = '127.0.0.1'
const proxy_port = 8080

describe('communication', () => {

  describe('constructor', () => {
    
    it('has a string host and HTTP', () => {
      let comms = new Communications({
        host: 'http://127.0.0.1'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPort())
        .to
        .equal(null)
    })

    it('has a string host and HTTPS', () => {
      let comms = new Communications({
        host: 'https://127.0.0.1'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
        expect(comms.getIsHTTPs())
          .to
          .equal(true)
        expect(comms.getPort())
          .to
          .equal(null)
    })

    it('has a string host and a port', () => {
      let comms = new Communications({
        host: 'http://127.0.0.1:200'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPort())
        .to
        .equal(200)
    })

    it('has a string host, a port and a path', () => {
      let comms = new Communications({
        host: 'http://127.0.0.1:200/boo'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPath())
        .to
        .equal('/boo')
      expect(comms.getPort())
        .to
        .equal(200)
    })

    it('has a string host with empty path and HTTP', () => {
      let comms = new Communications({
        host: 'http://127.0.0.1/'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPath())
        .to
        .equal('/')
      expect(comms.getPort())
        .to
        .equal(null)
    })

    it('has a string host with custom path and HTTP', () => {
      let comms = new Communications({
        host: 'http://127.0.0.1/boo'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPath())
        .to
        .equal('/boo')
      expect(comms.getPort())
        .to
        .equal(null)
    })

    it('has an IHost', () => {
      let comms = new Communications({
        host: {
          region: 'test',
          domain: 'testing'
        }
      })
      expect(comms.getHost())
        .to
        .equal(undefined)
      expect(comms.getIsHTTPs())
        .to
        .equal(true)
      expect(comms.getPath())
        .to
        .equal('/')
      expect(comms.getPort())
        .to
        .equal(null)
    })

    it('has credentials', () => {

    })

    it('does not have credentials', () => {

    })

  })

  describe('local request', () => {
    var local_run: boolean

    // test if local dynamo is working
    before((done) =>  {
      local_run = false
      let socket = new net.Socket()
      socket.setTimeout(2000, () => socket.destroy())
      socket.connect(local_DB_port, local_DB_host)
      socket.on('data', () => {
        local_run = true
        done()
      })
    })
    
    it('gets a response from the database', (done) => {
      let comms = new Communications({
        host: 'https://127.0.0.1:8000',
        awsCredentials: {
          accessKeyId: 'fakeAccesKeyID',
          secretAccessKey: 'FakeSecretKey'
        }
      })
      comms.request('ListTables', {})
        .then((o) => console.log('done:', o))
        .then(() => done())
        .catch(done)
    }).timeout(10000)

    describe('test proxy', () => {
      var proxy_run: boolean
      // test if the proxy is working
      before(() => {
        proxy_run = false
        let socket = new net.Socket()
        socket.setTimeout(2000, () => socket.destroy())
        socket.connect(local_DB_port, local_DB_host)
        socket.on('data', () => {
          proxy_run = true
        })
        proxy_run = proxy_run && local_run
      })      

    })

  })

  describe('online request', () => {

    var awsCredentials: IawsCredentials,
    host: IHost

    before(() => {
      awsCredentials = (settings as any).credentials
      host = (settings as any).host
    })

    it('gets a response from the database', (done) => {
      let comms = new Communications({
        host: host,
        awsCredentials: awsCredentials
      })
      console.log('token:', comms)
      console.log()
      comms.request('ListTables', {})
        .then(() => done())
        .catch(done)
    }).timeout(50000)

  })

})