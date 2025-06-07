import Hyperschema from 'hyperschema'
import HyperDB from './node_modules/hyperdb/builder/index.js'

const schema = Hyperschema.from('./spec/schema')
const ns = schema.namespace('pratilipi')

// Create a schema for collection
ns.register({
  name: 'db',
  compact: false,
  fields: [{
    name: 'key',
    type: 'string',
    required: true
  }, {
    name: 'value',
    type: 'buffer',
    required: true
  }, {
    name: 'file',
    type: 'bool',
    required: false
  }]
})

Hyperschema.toDisk(schema)
// End schema
//
// Start HyperDB

const db = HyperDB.from('./spec/schema', './spec/db')
const blobs = db.namespace('pratilipi')
blobs.collections.register({
  name: 'db',
  schema: '@pratilipi/db',
  key: ['key']
})

HyperDB.toDisk(db)
