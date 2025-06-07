#!/usr/bin/env node
import process from 'process'
import HyperDB from 'hyperdb'
import b4a from 'b4a'
import db from './spec/db/index.js'
import envPaths from 'env-paths'

const paths = envPaths('pratilipi')
const local = HyperDB.rocks(paths.data + '/localdb', db)

const [,, cmd, key, value] = process.argv

switch (cmd) {
  case 'set': {
    let buffer
    let file
    if (process.stdin.isTTY) {
      buffer = Buffer.from(value)
      file = false
    } else {
      buffer = await readStdin()
      file = true
    }
    await local.insert('@pratilipi/db', { key, value: buffer, file })
    await local.flush()
    break
  }
  case 'get': {
    const data = await local.get('@pratilipi/db', { key })

    if (!data) {
      console.log('Key not found')
      await local.close()
      process.exit()
    }
    if (!data.file) {
      console.log(b4a.toString(data.value))
    } else {
      process.stdout.write(data.value)
    }
    break
  }
  case 'delete': {
    await local.delete('@pratilipi/db', { key })
    await local.flush()
    break
  }
  case 'list' : {
    const flag = key
    if (flag === '-k') {
      const query = await (await local.find('@pratilipi/db', {})).toArray()
      query.forEach(element => {
        console.log(element.key)
      })
      break
    }

    if (flag === '-v') {
      const query = await (await local.find('@pratilipi/db', {})).toArray()
      query.forEach(element => {
        if (!element.file) {
          console.log(b4a.toString(element.value))
        } else {
          console.log('(omitted binary data)')
        }
      })
      break
    }

    if (flag === '-d') {
      const query = await (await local.find('@pratilipi/db', {})).toArray()
      query.forEach(element => {
        if (!element.file) {
          console.log(`${element.key}${value}${b4a.toString(element.value)}`)
        } else {
          console.log(`${element.key}${value}(omitted binary data)`)
        }
      })
      break
    }

    const query = await (await local.find('@pratilipi/db', {})).toArray()
    query.forEach(element => {
      if (!element.file) {
        console.log(element.key, b4a.toString(element.value))
      } else {
        console.log(element.key, '(omitted binary data)')
      }
    })
    break
  }
  case '--help':
    help()
    break
  default:
    help()
    break
}

async function readStdin () {
  return new Promise((resolve, reject) => {
    const chunks = []
    process.stdin.on('data', chunk => chunks.push(chunk))
    process.stdin.on('end', () => resolve(Buffer.concat(chunks)))
    process.stdin.on('error', reject)
    process.stdin.resume()
  })
}

function help () {
  const message = `
    Pratilipi - Key value database for the Terminal

    Usage:
      pratilipi [command] [flags]

    Available Commands:
      set   Add item to the store
      get   Get item from the store
      delete  Delete an item 
      list  List all keys and values

    Available Flags:
      -k  List only the keys 
      -v  List only the values
      -d  Use a custom delimiter
    `
  console.log(message)
}
await local.close()
