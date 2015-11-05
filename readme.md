[![Stories in Ready](https://badge.waffle.io/ArtooTrills/pdfkit-form.png?label=ready&title=Ready)](https://waffle.io/ArtooTrills/pdfkit-form)
# pdfkit-form 
------
[![npm version](https://badge.fury.io/js/pdfkit-form.svg)](https://badge.fury.io/js/pdfkit-form) [![Code Climate](https://codeclimate.com/github/ArtooTrills/pdfkit-form/badges/gpa.svg)](https://codeclimate.com/github/ArtooTrills/pdfkit-form)
## Install

```
$ npm install --save pdfkit-form
```


## Usage

```js
var pdfkitForm = require('pdfkit-form');

var options = {
  size:"A4",
  margins:{top:20,left:25,bottom:20,right:25},
  bufferPages: true,
}

var pdfkitForm =  pdfkitForm(options);

pdf.text('hello');
...
```


## API

### pdfkitForm([options])

#### options

## License

MIT © [Artoo](http://artootrills.github.io/pdfkit-form)
