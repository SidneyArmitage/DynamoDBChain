import { expect } from 'chai'
import * as http from 'http'
import * as net from 'net'
import * as communication from '../lib/communication'
import { Communications } from '../lib/communication';

const local_DB_host = '127.0.0.1'
const local_DB_port = 8000

const proxy_host = '127.0.0.1'
const proxy_port = 8080

describe('communication', () => {

  describe('constructor', () => {
    
    it('has a string host and HTTP', () => {
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
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
      let comms = new communication.Communications({
        host: {
          region: 'test',
          domain: 'testing'
        }
      })
      expect(comms.getHost())
        .to
        .equal('dynamodb.test.testing')
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
    before(() => {
      local_run = false
      let socket = new net.Socket()
      socket.setTimeout(2000, () => socket.destroy())
      socket.connect(local_DB_port, local_DB_host)
      socket.on('data', () => {
        local_run = true
      })
    })
    
    it('gets a response from the database', () => {
      if(local_run) {
        console.warn('Could not find local db')
        return
      }
      let comms = new Communications({
        host: 'http://127.0.0.1:200'
      })
    })

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

  })

})