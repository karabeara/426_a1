"use strict";

var Filters = Filters || {};



// space for general utility functions, if you want
var pi = 3.14159265359;

function clamp(val, min, max) {
  return val < min ? min : (val > max ? max : val);
}

// ----------- STUDENT CODE BEGIN ------------
// ----------- Our reference solution uses 77 lines of code.

function convolve1D(image, vec, newImg) {
	  var interImg = image.createImg(image.width, image.height);

	for (var y = 0; y < image.height; y++) {
		for (var x = 0; x < image.width; x++) {
			var red_sum = 0;
			var green_sum = 0;
			var blue_sum = 0;
			var weight_sum = 0;
			for (var v_x = 0; v_x < vec.length; v_x++) {
				if (x+v_x-vec.length/2 >= 0 && x+v_x-vec.length/2 < image.width) {
					var pixel = image.getPixel(x+v_x-vec.length/2,y);
					red_sum = red_sum + vec[v_x]*pixel.data[0];
					green_sum = green_sum + vec[v_x]*pixel.data[1];
					blue_sum = blue_sum + vec[v_x]*pixel.data[2];
					weight_sum = weight_sum + vec[v_x];
				}
			}
			var pixel = image.getPixel(x,y);
			var newPixel =  new Pixel(red_sum/weight_sum, green_sum/weight_sum, blue_sum/weight_sum, pixel.a, "rgb");
			interImg.setPixel(x, y, newPixel);
		}
	}
	for (var x = 0; x < image.width; x++) {
		for (var y = 0; y < image.height; y++) {
			var red_sum = 0;
			var green_sum = 0;
			var blue_sum = 0;
			var weight_sum = 0;
			for (var v_y = 0; v_y < vec.length; v_y++) {
				if (y+v_y-vec.length/2 >= 0 && y+v_y-vec.length/2 < image.height) {
					var pixel = interImg.getPixel(x,y+v_y-vec.length/2);
					red_sum = red_sum + vec[v_y]*pixel.data[0];
					green_sum = green_sum + vec[v_y]*pixel.data[1];
					blue_sum = blue_sum + vec[v_y]*pixel.data[2];
					weight_sum = weight_sum + vec[v_y];
				}
			}
			var pixel = interImg.getPixel(x,y);
			var newPixel =  new Pixel(red_sum/weight_sum, green_sum/weight_sum, blue_sum/weight_sum, pixel.a, "rgb");
			newImg.setPixel(x, y, newPixel);
		}
	}

	return 1;
}


function convolve2D(image, matrix, newImg) {

	for (var y = 0; y < image.height; y++) {
		for (var x = 0; x < image.width; x++) {
			var red_sum = 0;
			var green_sum = 0;
			var blue_sum = 0;
			var weight_sum = 0;
			for (var v_x = 0; v_x < matrix.length; v_x++) {
        for (var v_y = 0; v_y < matrix[0].length; v_y++) {

				  if (x+v_x-matrix.length/2 >= 0 &&
              y+v_y-matrix[0].length/2 >= 0 &&
              x+v_x-matrix.length/2 < image.width &&
              y+v_y-matrix[0].length/2 < image.height) {
					   var pixel = image.getPixel(x+v_x-matrix.length/2, y+v_y-matrix[0].length/2);
					   red_sum = red_sum + matrix[v_x][v_y]*pixel.data[0];
					   green_sum = green_sum + matrix[v_x][v_y]*pixel.data[1];
					   blue_sum = blue_sum + matrix[v_x][v_y]*pixel.data[2];
					   weight_sum = weight_sum + matrix[v_x][v_y];
				  }
        }
			}
			var pixel = image.getPixel(x,y);
			var newPixel =  new Pixel(red_sum/weight_sum, green_sum/weight_sum, blue_sum/weight_sum, pixel.a, "rgb");
			newImg.setPixel(x, y, newPixel);
		}
	}

	return 1;
}


// ----------- STUDENT CODE END ------------



Filters.samplePixel = function ( image, x, y, mode ) {
  if ( mode == 'bilinear') {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 19 lines of code.
	var a = Math.ceil(x)-x;
	var b = Math.ceil(y)-y;
	var ccP = image.getPixel(Math.ceil(x), Math.ceil(y));
	var cfP = image.getPixel(Math.ceil(x), Math.floor(y));
	var fcP = image.getPixel(Math.floor(x), Math.ceil(y));
	var ffP = image.getPixel(Math.floor(x), Math.floor(y));
	return new Pixel(
		(1-a)*(1-b)*ccP.data[0]+(1-a)*b*cfP.data[0]+a*(1-b)*fcP.data[0]+a*b*ffP.data[0],
		(1-a)*(1-b)*ccP.data[1]+(1-a)*b*cfP.data[1]+a*(1-b)*fcP.data[1]+a*b*ffP.data[1],
		(1-a)*(1-b)*ccP.data[2]+(1-a)*b*cfP.data[2]+a*(1-b)*fcP.data[2]+a*b*ffP.data[2],
		(1-a)*(1-b)*ccP.a+(1-a)*b*cfP.a+a*(1-b)*fcP.a+a*b*ffP.a,
		ccP.colorSpace);
    // ----------- STUDENT CODE END ------------

  } else if ( mode == 'gaussian' ) {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 37 lines of code.
    // ----------- STUDENT CODE END ------------
    Gui.alertOnce ('gaussian sampling is not implemented yet');

  } else { // point sampling

    y = Math.max( 0, Math.min(Math.round(y), image.height- 1) );
    x = Math.max( 0, Math.min(Math.round(x), image.width - 1) );
    return image.getPixel(x, y);
  }
}

Filters.fillFilter = function( image, color ) {
  image.fill(color);

  return image;
};

Filters.brightnessFilter = function( image, ratio ) {
  var alpha, dirLuminance;
  if (ratio < 0.0) {
    alpha = 1 + ratio;
    dirLuminance = 0;   // blend with black
  } else {
    alpha = 1 - ratio;
    dirLuminance = 1; // blend with white
  }

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);

      pixel.data[0] = alpha * pixel.data[0] + (1-alpha) * dirLuminance;
      pixel.data[1] = alpha * pixel.data[1] + (1-alpha) * dirLuminance;
      pixel.data[2] = alpha * pixel.data[2] + (1-alpha) * dirLuminance;

      image.setPixel(x, y, pixel)
    }
  }

  return image;
};

Filters.contrastFilter = function( image, ratio ) {
  // Reference: https://en.wikipedia.org/wiki/Image_editing#Contrast_change_and_brightening
  // ----------- STUDENT CODE BEGIN ------------

    for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
	     pixel.data[0] = (pixel.data[0] - 0.5) * (Math.tan ((ratio + 1) * 3.14159/4) ) + 0.5;
	     pixel.data[1] = (pixel.data[1] - 0.5) * (Math.tan ((ratio + 1) * 3.14159/4) ) + 0.5;
	     pixel.data[2] = (pixel.data[2] - 0.5) * (Math.tan ((ratio + 1) * 3.14159/4) ) + 0.5;
       image.setPixel(x, y, pixel);
    }
  }
  // ----------- STUDENT CODE END ------------
  return image;

};

Filters.gammaFilter = function( image, logOfGamma ) {
  var gamma = Math.exp(logOfGamma);
  // ----------- STUDENT CODE BEGIN ------------
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
	     pixel.data[0] = Math.pow(pixel.data[0], gamma);
	     pixel.data[1] = Math.pow(pixel.data[1], gamma);
	     pixel.data[2] = Math.pow(pixel.data[2], gamma);
       image.setPixel(x, y, pixel);
    }
  }
  // ----------- STUDENT CODE END ------------
  return image;

};

Filters.vignetteFilter = function( image, innerR, outerR ) {
  innerR = clamp(innerR, 0, outerR-0.1); // innerR should be at least 0.1 smaller than outerR
  // ----------- STUDENT CODE BEGIN ------------
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
		var x_ = (image.width/2-x)/image.width;
		var y_ = (image.height/2-y)/image.height;
		var d = Math.sqrt(x_*x_+y_*y_);
		var alpha;

		if (d > outerR)
			alpha = 0;
		else if (d < innerR)
			alpha = 1;
		else
			alpha = 1-(d-innerR)/(outerR-innerR);

		var pixel = image.getPixel(x, y);

		pixel.data[0] = alpha * pixel.data[0];
		pixel.data[1] = alpha * pixel.data[1];
		pixel.data[2] = alpha * pixel.data[2];
		image.setPixel(x, y, pixel)
    }
  }
  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.histogramEqualizationFilter = function( image ) {
  // ----------- STUDENT CODE BEGIN ------------
  // NEED TO FIX PROBLEM WITH BRIGHT WHITES
  var bins = new Array(256);
  for (var i = 0; i < 255; i+=1) {
    bins[i] = 0;
  }
  var minLum, imageSize;
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
      var hslPixel = pixel.rgbToHsl();
      var luminance = Math.round(hslPixel.data[2] * 255);
      pixel = hslPixel.hslToRgb();
      bins[luminance] = bins[luminance] + 1;
    }
  }

  minLum = 0;
  for (var i = 1; i < 255; i+=1) {
    if (bins[i] != 0) { minLum = i; break; }
  }

  for (var i = 1; i < 255; i+=1) {
    bins[i] = bins[i] + bins [i-1];
  }

  imageSize = image.width * image.height;
  for (var x = 0; x < image.width; x += 1) {
    for (var y = 0; y < image.height; y += 1) {
      var hslPixel = image.getPixel(x, y).rgbToHsl();
      var lum = Math.round(255 * hslPixel.data[2]);
      hslPixel.data[2] = (bins[lum] - bins[minLum]) / (imageSize - 1);
      pixel = hslPixel.hslToRgb();
  		image.setPixel(x, y, pixel);
    }
  }

  // ----------- Our reference solution uses 31 lines of code.
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('histogramEqualizationFilter is not implemented yet');
  return image;
};

Filters.grayscaleFilter = function( image ) {
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
      var luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];
      pixel.data[0] = luminance;
      pixel.data[1] = luminance;
      pixel.data[2] = luminance;

      image.setPixel(x, y, pixel);
    }
  }

  return image;
};

Filters.saturationFilter = function( image, ratio ) {
  // ----------- STUDENT CODE BEGIN ------------
  var alpha = ratio + 1;

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
      var luminance = 0.2126 * pixel.data[0] + 0.7152 * pixel.data[1] + 0.0722 * pixel.data[2];

      pixel.data[0] = alpha * pixel.data[0] + (1-alpha) * luminance;
      pixel.data[1] = alpha * pixel.data[1] + (1-alpha) * luminance;
      pixel.data[2] = alpha * pixel.data[2] + (1-alpha) * luminance;

      image.setPixel(x, y, pixel);
    }
  }
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('saturationFilter is not implemented yet');
  return image;
};

Filters.whiteBalanceFilter = function( image, white ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 23 lines of code.

  var lmsWhite = white.rgbToXyz().xyzToLms();

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
	  var lmsPixel = pixel.rgbToXyz().xyzToLms();

	  lmsPixel.data[0] = lmsPixel.data[0]/lmsWhite.data[0];
	  lmsPixel.data[1] = lmsPixel.data[1]/lmsWhite.data[1];
	  lmsPixel.data[2] = lmsPixel.data[2]/lmsWhite.data[2];

	  var rgbPixel = lmsPixel.lmsToXyz().xyzToRgb();

      pixel.data[0] = rgbPixel.data[0];
      pixel.data[1] = rgbPixel.data[1];
      pixel.data[2] = rgbPixel.data[2];

      image.setPixel(x, y, pixel);
    }
  }

  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.histogramMatchFilter = function( image, refImg, value ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 0 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('histogramMatchFilter is not implemented yet');
  return image;
};

Filters.gaussianFilter = function( image, sigma ) {
  // note: this function needs to work in a new copy of the image
  //       to avoid overwriting original pixels values needed later
  // create a new image with the same size as the input image
  var newImg = image.createImg(image.width, image.height);
  // the filter window will be [-winR, winR];
  var winR = Math.round(sigma*3);
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 54 lines of code.
  var vec = [];

  for (var i = 0; i < 2*winR; i++) {
    vec[i] = (1/(sigma*Math.sqrt(2*pi))) * Math.exp(-(Math.pow(i-winR, 2))/(2*sigma*sigma));
  }

  convolve1D(image, vec, newImg);

  // ----------- STUDENT CODE END ------------
  return newImg;
};

Filters.edgeFilter = function( image ) {
  // ----------- STUDENT CODE BEGIN ------------
  var newImg = image.createImg(image.width, image.height);
  var matrix = [[-1, -1, 0], [-1, 0, 1], [0, 1, 1]];
  convolve2D(image, matrix, newImg);
  // ----------- Our reference solution uses 51 lines of code.
  // ----------- STUDENT CODE END ------------
  return newImg;
};

Filters.sharpenFilter = function( image ) {
  // ----------- STUDENT CODE BEGIN ------------
  var newImg = image.createImg(image.width, image.height);
  var vec = [-1, 4, -1];
  convolve1D(image, vec, newImg);
  // ----------- Our reference solution uses 29 lines of code.
  // ----------- STUDENT CODE END ------------
  return newImg;
};

Filters.medianFilter = function( image, winR ) {
  // winR: the window will be  [-winR, winR];
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 31 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('medianFilter is not implemented yet');
  return image;
};

Filters.bilateralFilter = function( image, sigmaR, sigmaS ) {
  // reference: https://en.wikipedia.org/wiki/Bilateral_filter
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 48 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('bilateralFilter is not implemented yet');
  return image;
};

Filters.quantizeFilter = function( image, bitsPerChannel ) {
  var valuesPerChannel = Math.pow(2, bitsPerChannel)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 12 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('quantizeFilter is not implemented yet');
  return image;
};

Filters.randomFilter = function( image, bitsPerChannel ) {
  var valuesPerChannel = Math.pow(2, bitsPerChannel)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 12 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('randomFilter is not implemented yet');
  return image;

};

Filters.orderedFilter = function( image, bitsPerChannel ) {
  var valuesPerChannel = Math.pow(2, bitsPerChannel)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 31 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('orderedFilter is not implemented yet');
  return image;

};

Filters.floydFilter = function( image, bitsPerChannel ) {
  var valuesPerChannel = Math.pow(2, bitsPerChannel)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 23 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('floydFilter is not implemented yet');
  return image;
};

Filters.scaleFilter = function( image, ratio, sampleMode ) {
  // ----------- STUDENT CODE BEGIN ------------
  var w = image.width*ratio;
  var h = image.height*ratio;
  var newImg = image.createImg(image.width*ratio, image.height*ratio);
  for (var x = 0; x < w; x++) {
	  for (var y = 0; y < h; y++) {
		  newImg.setPixel(x, y, Filters.samplePixel(image, x/ratio, y/ratio, sampleMode));
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.translateFilter = function( image, x, y, sampleMode ) {
  // Note: set pixels outside the image to RGBA(0,0,0,0)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 21 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('translateFilter is not implemented yet');
  return image;
};

Filters.rotateFilter = function( image, radians, sampleMode ) {
  // Note: set pixels outside the image to RGBA(0,0,0,0)
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 30 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('rotateFilter is not implemented yet');
  return image;
};

Filters.swirlFilter = function( image, radians, sampleMode ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 27 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('swirlFilter is not implemented yet');
  return image;
};

Filters.getAlphaFilter = function( backgroundImg, foregroundImg) {
  for (var i = 0; i < backgroundImg.height; i++) {
    for (var j = 0; j < backgroundImg.width; j++) {
      var pixelBg = backgroundImg.getPixel(j, i);
      var pixelFg = foregroundImg.getPixel(j, i);
      var luminance = 0.2126 * pixelFg.data[0] + 0.7152 * pixelFg.data[1] + 0.0722 * pixelFg.data[2];
      pixelBg.a = luminance;
      backgroundImg.setPixel(j, i, pixelBg);
    }
  }

  return backgroundImg;
};

Filters.compositeFilter = function( backgroundImg, foregroundImg ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 14 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('compositeFilter is not implemented yet');
  return backgroundImg;
};

Filters.morphFilter = function( initialImg, finalImg, alpha, sampleMode, linesFile ) {
  var lines = Parser.parseJson( "images/" + linesFile );

  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 83 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('morphFilter is not implemented yet');
  return image;
};

Filters.brushFilter = function( image, radius, color, vertsString ) {
  // extract vertex coordinates from the URL string.
  var centers = [];
  var coordStrings = vertsString.split("x");
  var coordsSoFar = 0;
  for (var i = 0; i < coordStrings.length; i++) {
    var coords = coordStrings[i].split("y");
    var x = parseInt(coords[0]);
    var y = parseInt(coords[1]);
    if (!isNaN(x) && !isNaN(y)) {
      centers.push({
        x: x,
        y: y,
      })
    }
  }

  // draw a filled circle centered at every location in centers[].
  // radius and color are specified in function arguments.
  // ----------- STUDENT CODE BEGIN ------------
  for (var i = 0; i < centers.length; i++) {
	  var xStart, yStart, xEnd, yEnd;
	  if (centers[i].x-radius < 0)
		  xStart = 0;
	  else
		  xStart = centers[i].x-radius;

	  if (centers[i].y-radius < 0)
		  yStart = 0;
	  else
		  yStart = centers[i].y-radius;

	  if (centers[i].x+radius+1 > image.width)
		  xEnd = image.width;
	  else
		  xEnd = centers[i].x+radius+1;

	  if (centers[i].y+radius+1 > image.height)
		  yEnd = image.height;
	  else
		  yEnd = centers[i].y+radius+1;

	  for (var x = xStart; x < xEnd; x++) {
		for (var y = yStart; y < yEnd; y++) {
			var x_ = x-centers[i].x;
			var y_ = y-centers[i].y;
			var d = Math.sqrt(x_*x_+y_*y_);
			if (d <= radius)
				image.setPixel(x, y, color);
		}
	}
  }
  // ----------- STUDENT CODE END ------------

  return image;
};


Filters.paletteFilter = function( image, colorNum ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 83 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('paletteFilter is not implemented yet');
  return image;
};

Filters.paintFilter = function( image, value ) {
  // http://mrl.nyu.edu/publications/painterly98/hertzmann-siggraph98.pdf
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 52 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('paintFilter is not implemented yet');
  return image;
};

Filters.xDoGFilter = function( image, value ) {
  // value could be an array
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 60 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('xDoGFilter is not implemented yet');
  return image;
};

Filters.customFilter = function( image, value ) {
  // You can use this filter to do whatever you want, for example
  // trying out some new idea or implementing something for the
  // art contest.
  // Currently the 'value' argument will be 1 or whatever else you set
  // it to in the URL. You could use this value to switch between
  // a bunch of different versions of your code if you want to
  // code up a bunch of different things for the art contest.
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 0 lines of code.
  // ----------- STUDENT CODE END ------------
  Gui.alertOnce ('customFilter is not implemented yet');
  return image;
};
