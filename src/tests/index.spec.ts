import { expect } from 'chai' 
import { Database } from '../index'
import { Database as db } from '../lib/database'

describe('index', () => {

  it('returns the database class', () => {
    expect(new Database({
      host: 'http://127.0.0.1'
    }))
      .to
      .be
      .an
      .instanceOf(db)
  })

})