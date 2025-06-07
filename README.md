# Pratilipi

A key-value store for the Terminal based on HyperDB and powered by RocksDB under the hood.

***
Version one of Pratilipi only operates locally and do not support syncing peer-to-peer, this functionality will be added in version 2.0.0
***

Pratilipi is simple and fast. Use it to save text or binary data.

```bash
# Store something
pratilipi set hello world

# Fetch something from the local database
pratilipi get hello

# List everything in the store
pratilipi list 

# Spaces are fine
pratilipi set "hello world" "something better"

# Store binary data (files)
pratilipi set wallpaper.jpeg < wallpaper.jpeg
pratilipi get wallpaper.jpeg > my-new-image.jpeg

# For more info
pratilipi --help

```

## Installation

```bash
npm i pratilipi -g
```

## Other Features

### List Filters

```bash
# List keys only
pratilipi list -key 

# List values only 
pratilipi list -v 

# Add a custom delimeter between keys and values; default is a tab 
pratilipi list -d "\t"

``````
## License

[MIT]
