import { expect } from 'chai'
import * as communication from '../lib/communication'

describe('communication', () => {

  describe('constructor', () => {
    
    it('has a string host and HTTP', () => {
      let comms = new communication.Communications({
        host: 'http://127.0.0.1:200'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1:200')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
    })

    it('has a string host and HTTPS', () => {
      let comms = new communication.Communications({
        host: 'https://127.0.0.1:200'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1:200')
        expect(comms.getIsHTTPs())
          .to
          .equal(true)
    })

    it('has a string host with empty path and HTTP', () => {
      let comms = new communication.Communications({
        host: 'http://127.0.0.1:200/'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1:200')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPath())
        .to
        .equal('/')
    })

    it('has a string host with custom path and HTTP', () => {
      let comms = new communication.Communications({
        host: 'http://127.0.0.1:200/boo'
      })
      expect(comms.getHost())
        .to
        .equal('127.0.0.1:200')
      expect(comms.getIsHTTPs())
        .to
        .equal(false)
      expect(comms.getPath())
        .to
        .equal('/boo')
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
    })

    it('has credentials', () => {

    })

    it('does not have credentials', () => {

    })

  })

})