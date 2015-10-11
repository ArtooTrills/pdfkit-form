'use strict';
var PdfKit = require('pdfkit');
var extend = require('./extend');

var PDFKitForm = (function(superClass){
		extend(PDFKitForm, superClass);
		
		function PDFKitForm(options) {
			PDFKitForm.__super__.constructor.apply(this, arguments);
		}
		
		PDFKitForm.prototype.toString = function() {
			return "[object PDFKitForm]";
		};
		
		PDFKitForm.prototype.addPageNumbers = function(pdf) {
				var range = this.bufferedPageRange();
				for(var i = range.start; i < range.start + range.count; i++){
						this.switchToPage(i);
						this.x = this.page.width - this.page.margins.bottom - 80;
						this.y = this.page.height - this.page.margins.right - 10;
						this.text("Page " + (i + 1) + " of " + range.count);
				}
		};
		
		return PDFKitForm;
})(PdfKit);

module.exports = PDFKitForm;
