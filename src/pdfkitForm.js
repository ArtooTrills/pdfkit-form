'use strict';
var PdfKit = require('pdfkit');
var extend = require('./extend');

var PDFKitForm = (function(superClass){
		extend(PDFKitForm, superClass);
		
		function PDFKitForm(options) {
			arguments[0] = options || {};
			PDFKitForm.__super__.constructor.apply(this, arguments);
			this.fontBold				 = options.fontBold || "Helvetica-Bold"; 
			this.fontP						 = options.fontP || "Helvetica";
			this.fontBoldW			 = options.fontBoldW || 6.23914;
			this.fontSizeL			 = options.fontSizeL || 16; 
			this.fontSizeM			 = options.fontSizeM || 14; 
			this.fontSizeS			 = options.fontSizeS || 12; 
			this.fontSizeP				 = options.fontSizeP || 10;
			this.fontSizeXS			 = options.fontSizeXS || 9;
			this.fontColor			 = options.fontColor || "black";
			this.fieldFillColor	 = options.fieldFillColor || "#f9f9f9";
		}
		
		PDFKitForm.prototype.toString = function() {
			return "[object PDFKitForm]";
		};
		
		PDFKitForm.prototype.lineFeed = function(step,left,offset) {
        this.y = this.y + step * 2.5;
        if(((this.page.height - this.page.margins.bottom - this.fontSizeP*2.2) - this.y) <= 0) {
            this.addPage();
            //this.y = this.page.mari
        }
        if(left) {
            this.x = this.page.margins.left;
        }

        if(offset) {
            this.x += offset;
        }
    };
		
		PDFKitForm.prototype.drawRule = function(options){
        this.moveTo(this.page.margins.left, this.y).lineTo(this.page.width - this.page.margins.right, this.y).stroke();
        this.lineFeed(this.fontSizeP);
    };
		
		PDFKitForm.prototype.addPageNumbers = function() {
				var range = this.bufferedPageRange();
				for(var i = range.start; i < range.start + range.count; i++){
						this.switchToPage(i);
						this.x = this.page.width - this.page.margins.bottom - 80;
						this.y = this.page.height - this.page.margins.right - 10;
						this.text("Page " + (i + 1) + " of " + range.count);
				}
		};
		
		//Sets blocks : {1,12], Sets position: [0,11}, e.g. 0 will not move 'x', 11 will move it to starting of last(12th) block.
    PDFKitForm.prototype.setBlock = function(options){
        var blocks = options.blocks;
        var position = options.position;
     
        if(blocks && typeof blocks === "number" && blocks <= 12 && blocks > 0) {
            options.width = blocks*(this.page.width - this.page.margins.left - this.page.margins.right)/12;
        }
        
        if(position && typeof position === "number" && position <= 12 && position >0){
            this.x += (position)*(this.page.width - this.page.margins.left - this.page.margins.right)/12;
        }
    };
		
		PDFKitForm.prototype.drawHeader = function(text, options) {
				options = options || {};        
				options.size = options.size || this.fontSizeL;
				options.font = options.font || this.fontBold;
				options.align = options.align || 'left';
				options.border = options.border === false ? false : true;
				this.fontSize(options.size).font(options.font).text(text, {align: options.align});
				
				if(options.border) {
					this.drawRule();
				}
				else {
					this.moveDown(0.5);
				}
				//this.moveTo(this.page.margins.left,this.y).lineTo(this.page.width - this.page.margins.right, this.y).stroke();
		};
		
		PDFKitForm.prototype.drawField = function(label, text, options){
				options = options || {};
				text = text ? text: "";
				
				options.align = options.align || 'left';

				this.setBlock(options);
				var initX = this.x;
				this.fontSize(this.fontSizeP).font(this.fontBold).text(label + '  ',{lineBreak: false, align: options.align});      
				var pX = this.x;
				var pY = this.y;
				var mX = 2;
				var mY = 5;
				var marXL = this.page.margins.left, marXR = this.page.margins.right;      
				var pXstart = pX - mX;
				var width = options.width ? options.width - (pX - initX)  : (this.page.width - pXstart - marXR);  
				this.rect(pXstart, pY - mY, width , this.fontSizeP + 12).fill(this.fieldFillColor);
				this.fillColor(this.fontColor);
				
				this.fontSize(this.fontSizeP).font(this.fontP).text(text,{lineBreak: false});
				this.x += width - ( this.x - pX );
		};

		PDFKitForm.prototype.printSignatureBoxes = function(array, options) {
		        if(!array.length) {
							return;
						}
		        options = options || {};
		        
		        var extraMargin = options.extraMargin || 0;
		        var extraLMargin = options.extraLMargin || extraMargin;
		        var extraRMargin = options.extraRMargin || extraMargin;
		        
		        var boxHeight = options.boxHeight || 150;
		        var _fontSize = options.fontSize || this.fontSizeS;
		        
		        var boxLength = (this.page.width - (this.page.margins.left + this.page.margins.right) - ((extraLMargin + extraRMargin))/array.length);
		        
		        this.lineFeed(this.fontSizeP, true); 
		        
		        // console.log(this.x, this.y, boxLength, boxHeight);
		        var initY = this.y;
		        
						var that = this;
		        array.forEach(function(title, i){
		            var position = that.page.margins.left + extraMargin + i*boxLength;
		            that.fontSize(_fontSize).text(title, position + 5, that.y, {lineBreak: false});
		        });
		        
		        array.forEach(function(title, i){
		            that.y += -5;
		            that.x = that.page.margins.left + extraMargin + i*boxLength;
		            that.rect(that.x, that.y, boxLength, boxHeight).stroke();
		            // that.y -= 15;
		            // that.x = that.page.margins.left + extraMargin + i*boxLength;
		            // that.fontSize(fontSizeS).text(title, {continued: true})
		            that.y = initY;
		        });
		        
		        this.y += boxHeight;
		    };
				
				PDFKitForm.prototype.printColumnText = function(array, options) {
		        if(!array.length) return;
		        
		        options = options || {};
		        var extraMargin = options.extraMargin || 0;
		        var _fontSize = options.fontSize || this.fontSizeS;
		        
		        var boxLength = (this.page.width - (this.page.margins.left + this.page.margins.right) - 2*extraMargin)/array.length;
		        var that = this;
						array.forEach(function(title, i){
		            var position = that.page.margins.left + extraMargin + i*boxLength;
		            that.fontSize(_fontSize).text(title, position + 5, that.y, {lineBreak: false});
		        });
		    };
		return PDFKitForm;
})(PdfKit);

module.exports = PDFKitForm;
