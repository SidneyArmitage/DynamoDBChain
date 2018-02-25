import { Communications } from '../lib/communication';
import { expect } from 'chai'
import { Request_with_datatype_exposed } from './test_resources/request_with_datatype_exposed';

const comms = new Communications({
  host: '127.0.0.1:8000'
})
const request = new Request_with_datatype_exposed(comms)

describe('request with datatype', () => {
  describe('data type assignment', () => {

    describe('assigns a string', () => {

      it('empty', () => {
        expect(request.exposed_detectDataType(''))
          .to
          .deep
          .equal({
            S: ''
          })
      })

      it('non-empty', () => {
        expect(request.exposed_detectDataType('test'))
          .to
          .deep
          .equal({
            S: 'test'
          })
      })

    })

    it('assigns a number', () => {
      expect(request.exposed_detectDataType(10))
        .to
        .deep
        .equal({
          N: '10'
        })
    })

    describe('assigns binary', () => {

      it('empty', () => {

      })

      it('non-empty', () => {

      })

    })

    it('assigns a boolean', () => {

    })

    it('assigns a null', () => {

    })

    describe('assigns a map', () => {

      it('empty', () => {

      })

      it('non-empty', () => {

      })

    })

    describe('detect array', () => {

      describe('assigns a list', () => {

        it('empty', () => {

        })
  
        it('non-empty', () => {
  
        })

      })

      it('assigns a string set', () => {

      })

      it('assigns a number set', () => {

      })

      it('assigns a binary set', () => {
        
      })

    })

  })

  describe('data type decode', () => {

  })
})