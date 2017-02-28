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


function convolve2D(image, matrix, newImg, invert) {

	for (var y = 0; y < image.height; y++) {
		for (var x = 0; x < image.width; x++) {
			var lum_sum = 0;
			var weight_sum = 0;
			for (var v_x = 0; v_x < matrix.length; v_x++) {
				for (var v_y = 0; v_y < matrix[0].length; v_y++) {
					if (x+v_x-matrix.length/2 >= 0 &&
					  y+v_y-matrix[0].length/2 >= 0 &&
					  x+v_x-matrix.length/2 < image.width &&
					  y+v_y-matrix[0].length/2 < image.height) {
						var pixel = image.getPixel(x+v_x-matrix.length/2, y+v_y-matrix[0].length/2);
						var hslPixel = pixel.rgbToHsl();
						lum_sum = lum_sum + matrix[v_x][v_y] * hslPixel.data[2];
						weight_sum = weight_sum + matrix[v_x][v_y];
					}
				}
			}
			var pixel = image.getPixel(x,y);
			var hslPixel = pixel.rgbToHsl();
			var luminance = clamp(lum_sum, 0, 1);
			if (invert) luminance = 1-luminance;
			var intPixel =  new Pixel(hslPixel.data[0], hslPixel.data[1], luminance, hslPixel.a, "hsl");
			var newPixel = intPixel.hslToRgb();
			newImg.setPixel(x, y, newPixel);


		}
	}

	return 1;
}

function tupleComparator(l, pix) {
   if (l[0] < pix[0]) return -1;
   if (l[0] > pix[0]) return 1;
   return 0;
 }
 
 function blend(pixel1, pixel2) {
	 var r = (pixel1.data[0] + pixel2.data[0] ) / 2;
	 var g = (pixel1.data[1] + pixel2.data[1] ) / 2;
	 var b = (pixel1.data[2] + pixel2.data[2] ) / 2;
	 return new Pixel(r, g, b, pixel1.a, pixel1.type);
 }

// ----------- STUDENT CODE END ------------



Filters.samplePixel = function ( image, x, y, mode ) {
  if ( mode == 'bilinear') {
    // ----------- STUDENT CODE BEGIN ------------
    // ----------- Our reference solution uses 19 lines of code.
	var a = Math.ceil(x)-x;
	var b = Math.ceil(y)-y;
	var cx = Math.ceil(x);
	var cy = Math.ceil(y);
	var fx = Math.floor(x);
	var fy = Math.floor(y);
	if(cx >= image.width) cx = image.width-1;
	if(cy >= image.height) cy = image.height-1;
	if(fx < 0) fx = 0;
	if(fy < 0) fy = 0;
	var ccP = image.getPixel(cx, cy);
	var cfP = image.getPixel(cx, fy);
	var fcP = image.getPixel(fx, cy);
	var ffP = image.getPixel(fx, fy);
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
	var sigma = 0.75;
	var winR = Math.max(1, Math.round(sigma*3));

	var red_sum = 0;
	var green_sum = 0;
	var blue_sum = 0;
	var weight_sum = 0;
	for (var v_x = Math.floor(x)-winR; v_x < x+winR; v_x++) {
		for (var v_y = Math.floor(y)-winR; v_y < y+winR; v_y++) {
			if (v_x >= 0 && v_y >= 0 && v_x < image.width && v_y < image.height) {
			    var d2 = (x-v_x)*(x-v_x) + (y-v_y)*(y-v_y);
			    var weight = Math.exp(-d2/(2*sigma*sigma));
			    var pixel = image.getPixel(v_x, v_y);
			    red_sum = red_sum + weight*pixel.data[0];
			    green_sum = green_sum + weight*pixel.data[1];
			    blue_sum = blue_sum + weight*pixel.data[2];
			    weight_sum = weight_sum + weight;
			}
		}
	}
	return new Pixel(red_sum/weight_sum, green_sum/weight_sum, blue_sum/weight_sum, pixel.a, "rgb");
    // ----------- STUDENT CODE END ------------
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
	    pixel.data[0] = clamp((pixel.data[0] - 0.5) * (Math.tan ((ratio + 0.9999) * pi/4) ) + 0.5,0,1);
	    pixel.data[1] = clamp((pixel.data[1] - 0.5) * (Math.tan ((ratio + 0.9999) * pi/4) ) + 0.5,0,1);
	    pixel.data[2] = clamp((pixel.data[2] - 0.5) * (Math.tan ((ratio + 0.9999) * pi/4) ) + 0.5,0,1);
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

  var bins = new Array(256);
  for (var i = 0; i < 256; i+=1) {
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
  for (var i = 1; i < 256; i+=1) {
    if (bins[i] != 0) { minLum = i; break; }
  }

  for (var i = 1; i < 256; i+=1) {
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
  var ourBinsR = new Array(256);
  var ourBinsG = new Array(256);
  var ourBinsB = new Array(256);
  var refBinsR = new Array(256);
  var refBinsG = new Array(256);
  var refBinsB = new Array(256);

  for (var i = 0; i < 256; i+=1) {
    ourBinsR[i] = 0;
    ourBinsG[i] = 0;
    ourBinsB[i] = 0;
    refBinsR[i] = 0;
    refBinsG[i] = 0;
    refBinsB[i] = 0;
  }
  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {
      var pixel = image.getPixel(x, y);
      var red = Math.round(pixel.data[0] * 255);
      var green = Math.round(pixel.data[1] * 255);
      var blue = Math.round(pixel.data[2] * 255);
      ourBinsR[red] = ourBinsR[red] + 1;
      ourBinsG[green] = ourBinsG[green] + 1;
      ourBinsB[blue] = ourBinsB[blue] + 1;
    }
  }
  for (var x = 0; x < refImg.width; x++) {
    for (var y = 0; y < refImg.height; y++) {
      var pixel = refImg.getPixel(x, y);
      var red = Math.round(pixel.data[0] * 255);
      var green = Math.round(pixel.data[1] * 255);
      var blue = Math.round(pixel.data[2] * 255);
      refBinsR[red] = refBinsR[red] + 1;
      refBinsG[green] = refBinsG[green] + 1;
      refBinsB[blue] = refBinsB[blue] + 1;
    }
  }
  for (var i = 1; i < 256; i+=1) {
    ourBinsR[i] = ourBinsR[i] + ourBinsR[i-1];
    ourBinsG[i] = ourBinsG[i] + ourBinsG[i-1];
    ourBinsB[i] = ourBinsB[i] + ourBinsB[i-1];
    refBinsR[i] = refBinsR[i] + refBinsR[i-1];
    refBinsG[i] = refBinsG[i] + refBinsG[i-1];
    refBinsB[i] = refBinsB[i] + refBinsB[i-1];
  }

  var imageSize = image.width * image.height * 1.0;
  var refSize = refImg.width * refImg.height * 1.0;
  for (var i = 0; i < 256; i+=1) {
    ourBinsR[i] = ourBinsR[i] / imageSize;
    ourBinsG[i] = ourBinsG[i] / imageSize;
    ourBinsB[i] = ourBinsB[i] / imageSize;
    refBinsR[i] = refBinsR[i] / refSize;
    refBinsG[i] = refBinsG[i] / refSize;
    refBinsB[i] = refBinsB[i] / refSize;
  }

  for (var x = 0; x < image.width; x += 1) {
    for (var y = 0; y < image.height; y += 1) {
      var pixel = image.getPixel(x, y);
      var red = Math.round(255 * pixel.data[0]);
      var green = Math.round(255 * pixel.data[1]);
      var blue = Math.round(255 * pixel.data[2]);
      var r = ourBinsR[red];
      var g = ourBinsG[green];
      var b = ourBinsB[blue];
      var rRef, gRef, bRef;

      if (r < refBinsR[1]) { rRef = 0; }
      else {
        for (var i = 1; i < 255; i+=1) {
          if (r >= refBinsR[i-1] && r < refBinsR[i+1]) { rRef = i; break; }
          else if (i == 254) { rRef = 255; break; }
        }
      }
      if (g < refBinsG[1]) { gRef = 0; }
      else {
        for (var i = 1; i < 255; i+=1) {
          if (g >= refBinsG[i-1] && g < refBinsG[i+1]) { gRef = i; break; }
          else if (i == 254) { gRef = 255; break; }
        }
      }
      if (b < refBinsB[1]) { bRef = 0; }
      else {
        for (var i = 1; i < 255; i+=1) {
          if (b >= refBinsB[i-1] && b < refBinsB[i+1]) { bRef = i; break; }
          else if (i == 254) { bRef = 255; break; }
        }
      }
      pixel.data[0] = clamp(rRef / 255.0,0,1);
      pixel.data[1] = clamp(gRef / 255.0,0,1);
      pixel.data[2] = clamp(bRef / 255.0,0,1);
  	  image.setPixel(x, y, pixel);
    }
  }

  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('histogramMatchFilter is not implemented yet');
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
  var matrix = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
  convolve2D(image, matrix, newImg, true);
  // ----------- Our reference solution uses 51 lines of code.
  // ----------- STUDENT CODE END ------------
  return newImg;
};

Filters.sharpenFilter = function( image ) {
  // ----------- STUDENT CODE BEGIN ------------
  var newImg = image.createImg(image.width, image.height);
  var matrix = [[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]];
  convolve2D(image, matrix, newImg, false);
  // ----------- Our reference solution uses 29 lines of code.
  // ----------- STUDENT CODE END ------------
  return newImg;
};

Filters.medianFilter = function( image, winR ) {
  // winR: the window will be  [-winR, winR];
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 31 lines of code.
  var newImg = image.createImg(image.width, image.height);
  for (var x = 0; x < image.width; x++) {
	  for (var y = 0; y < image.height; y++) {
		  var ls = [];
		  var i = 0;
		  for (var v_x = x - winR; v_x < x + winR; v_x++) {
			  for (var v_y = y - winR; v_y < y + winR; v_y++) {
				  if (v_x >= 0 && v_y >= 0 && v_x < image.width && v_y < image.height) {
					  var pix = image.getPixel(v_x,v_y).rgbToHsl();
					  ls[i] = [pix.data[2], pix];
					  i = i + 1;
				  }
			  }
		  }
		  ls.sort(tupleComparator);
		  var index = Math.floor(ls.length/2);
		  newImg.setPixel(x, y, ls[index][1].hslToRgb());
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.bilateralFilter = function( image, sigmaR, sigmaS ) {
  // reference: https://en.wikipedia.org/wiki/Bilateral_filter
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 48 lines of code.
  var newImg = image.createImg(image.width, image.height);
  var winR = 3*sigmaR;
  for (var x = 0; x < image.width; x++) {
	  for (var y = 0; y < image.height; y++) {
		    var lum_sum = 0;
			var weight_sum = 0;
			var c_pixel = image.getPixel(x,y);
			var c_hslPixel = c_pixel.rgbToHsl();
			for (var v_x = x-winR; v_x < x+winR; v_x++) {
				for (var v_y = y-winR; v_y < y+winR; v_y++) {
					if (v_x >= 0 && v_y >= 0 &&	v_x < image.width && v_y < image.height) {
						var pixel = image.getPixel(v_x, v_y);
						var dx2 = (x-v_x)*(x-v_x) + (y-v_y)*(y-v_y);
						var w1 = 1/(sigmaR)*Math.exp(-dx2/(2*sigmaR*sigmaR));
						var hslPixel = pixel.rgbToHsl();
						var dl2 = (hslPixel.data[2]-c_hslPixel.data[2])*(hslPixel.data[2]-c_hslPixel.data[2]);
						var w2 = 1/(sigmaS)*Math.exp(-dl2/(2*sigmaS*sigmaS));
						lum_sum = lum_sum + w1 * w2 * hslPixel.data[2];
						weight_sum = weight_sum + w1*w2;
					}
				}
			}
			
			var newPixel = new Pixel(c_hslPixel.data[0], c_hslPixel.data[1], lum_sum/weight_sum, c_hslPixel.a, "hsl").hslToRgb();
			newImg.setPixel(x, y, newPixel);
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
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
  var w = Math.round(image.width*ratio);
  var h = Math.round(image.height*ratio);
  var newImg = image.createImg(w, h);
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
  var w = image.width;
  var h = image.height;
  var newImg = image.createImg(w, h);
  for (var i = 0; i < w; i++) {
	  for (var j = 0; j < h; j++) {
		if (i+x >= 0 && j+y >= 0 && i+x < w && j+y < h)
			newImg.setPixel(i, j, Filters.samplePixel(image, i+x, j+y, sampleMode));
		else
			newImg.setPixel(i, j, new Pixel(0, 0, 0, 0, "rgb"));
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.rotateFilter = function( image, radians, sampleMode ) {
  // Note: set pixels outside the image to RGBA(0,0,0,0)
  // ----------- STUDENT CODE BEGIN ------------
  var w = 2*image.width;
  var h = 2*image.height;
  var newImg = image.createImg(w, h);
  for (var x = 0; x < w; x++) {
	  for (var y = 0; y < h; y++) {
		var u = (x-w/2)*Math.cos(-radians) - (y-h/2)*Math.sin(-radians)+image.width/2;
		var v = (x-w/2)*Math.sin(-radians) + (y-h/2)*Math.cos(-radians)+image.height/2;
		if (u >= 0 && u < image.width && v >= 0 && v < image.height) {
			newImg.setPixel(x, y, Filters.samplePixel(image, u, v, sampleMode));
		} else {
			newImg.setPixel(x,y, new Pixel(0, 0, 0, 0, "rgb"));
		}
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
  return image;
};

Filters.swirlFilter = function( image, radians, sampleMode ) {
  // ----------- STUDENT CODE BEGIN ------------
  // ----------- Our reference solution uses 27 lines of code.
  var w = image.width;
  var h = image.height;
  var newImg = image.createImg(w, h);
  for (var x = 0; x < w; x++) {
	  for (var y = 0; y < h; y++) {
		var d = Math.sqrt((x-w/2)*(x-w/2)+(y-h/2)*(y-h/2))/w;
		var u = (x-w/2)*Math.cos(-radians*d) - (y-h/2)*Math.sin(-radians*d)+image.width/2;
		var v = (x-w/2)*Math.sin(-radians*d) + (y-h/2)*Math.cos(-radians*d)+image.height/2;
		if (u < 0) u = 0;
		if (v < 0) v = 0;
		if (u >= w) u = w-1;
		if (v >= h) v = h-1;
		newImg.setPixel(x, y, Filters.samplePixel(image, u, v, sampleMode));
	  }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
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

  for (var x = 0; x < backgroundImg.width; x++) {
    for (var y = 0; y < backgroundImg.height; y++) {
      var backgroundPixel = backgroundImg.getPixel(x, y);
      var foregroundPixel = foregroundImg.getPixel(x, y);
      var alpha = foregroundPixel.a;
      if (alpha > 0) {
        backgroundPixel.data[0] = alpha * foregroundPixel.data[0] + (1-alpha) * backgroundPixel.data[0];
        backgroundPixel.data[1] = alpha * foregroundPixel.data[1] + (1-alpha) * backgroundPixel.data[1];
        backgroundPixel.data[2] = alpha * foregroundPixel.data[2] + (1-alpha) * backgroundPixel.data[2];
      }

      backgroundImg.setPixel(x, y, backgroundPixel)
    }
  }

  // ----------- Our reference solution uses 14 lines of code.
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('compositeFilter is not implemented yet');
  return backgroundImg;
};

function warpBad(image, lines, isInitial) {
  var newImg = image.createImg(image.width, image.height);

  for (var Xx = 0; Xx < image.width; Xx++) {
    for (var Xy = 0; Xy < image.height; Xy++) {
      var dSumX = 0;
      var dSumY = 0;
      var weightSum = 0;
      var Px_prime, Py_prime, Qx_prime, Qy_prime;
      var Xx_prime, Xy_prime;

      // for each line PiQi
      for (var i = 1; i < 10; i++) {
        var Px, Py, Qx, Qy;
        if (isInitial == 1) {
          Px_prime = lines.final[i].x0;
          Py_prime = lines.final[i].y0;
          Qx_prime = lines.final[i].x1;
          Qy_prime = lines.final[i].y1;
          Px = lines.initial[i].x0;
          Py = lines.initial[i].y0;
          Qx = lines.initial[i].x1;
          Qy = lines.initial[i].y1;
        } else {
          Px_prime = lines.initial[i].x0;
          Py_prime = lines.initial[i].y0;
          Qx_prime = lines.initial[i].x1;
          Qy_prime = lines.initial[i].y1;
          Px = lines.final[i].x0;
          Py = lines.final[i].y0;
          Qx = lines.final[i].x1;
          Qy = lines.final[i].y1;
        }

        // calculate u based on PiQi
        var XP_x = Xx - Px;
        var XP_y = Xy - Py;
        var QP_x = Qx - Px;
        var QP_y = Qy - Py;
        var QP_mag = Math.sqrt( Math.pow(Px - Qx, 2) + Math.pow(Py - Qy, 2) );
        var QP_mag_prime = Math.sqrt( Math.pow(Px_prime - Qx_prime, 2) + Math.pow(Py_prime - Qy_prime, 2) );
        var u = ((XP_x * QP_x) + (XP_y * QP_y)) / Math.pow(QP_mag, 2);

        // calculate v based on PiQi
        var v = ( (XP_x * QP_y * -1) + (XP_y * QP_x) ) / Math.pow(QP_mag, 2);

        // calculate X_prime based on u, v, and Pi_Qi_
        var QP_x_prime = Qx_prime - Px_prime;
        var QP_y_prime = Qy_prime - Py_prime;
        Xx_prime = Px_prime + (u * QP_x_prime) + ((v * QP_y_prime * -1) / Math.pow(QP_mag_prime, 2));
        Xy_prime = Py_prime + (u * QP_y_prime) + ((v * QP_x_prime) / Math.pow(QP_mag_prime, 2));

        // calculate displacement Di = X_prime - X for this lines
        var DiX = Math.abs(Xx_prime - Xx);
        var DiY = Math.abs(Xy_prime - Xy);

        // compute distance, d = shortest distance from X to PiQi
        var d;
        if (u > 0 && u < 1) { d = Math.abs(v); }
        else if (u < 0) { d = Math.sqrt( Math.pow(Px - Xx, 2) + Math.pow(Py - Xy, 2) ); }
        else if (u > 1) { d = Math.sqrt( Math.pow(Qx - Xx, 2) + Math.pow(Qy - Xy, 2) ); }

        // compute weight, w = ( (length^p) / (a+d) )^b
        var p = 0.5;
        var a = 0.01;
        var b = 2;
        var w = Math.pow((Math.pow(QP_mag, p) / (a + d)), b);

        dSumX = dSumX + DiX * w;
        dSumX = dSumX + DiY * w;
        weightSum = weightSum + w;
      }

      Xx_prime = Math.round(Xx + (dSumX / weightSum));
      Xy_prime = Math.round(Xy + (dSumY / weightSum));

      var newPixel = image.getPixel(Xx_prime, Xx_prime);
      newImg.setPixel(Xx, Xy, newPixel);
    }
  }
  return newImg;
}

function warp(image, lines, isInitial) {
  var newImg = image.createImg(image.width, image.height);

  for (var Xx = 0; Xx < image.width; Xx++) {
    for (var Xy = 0; Xy < image.height; Xy++) {
      var dSumX = 0;
      var dSumY = 0;
      var weightSum = 0;
      var Px_prime, Py_prime, Qx_prime, Qy_prime;
      var Xx_prime, Xy_prime;

      // for each line PiQi
      for (var i = 1; i < 10; i++) {
        var Px, Py, Qx, Qy;
        if (isInitial == 1) {
          Px_prime = lines.final[i].x0;
          Py_prime = lines.final[i].y0;
          Qx_prime = lines.final[i].x1;
          Qy_prime = lines.final[i].y1;
          Px = lines.initial[i].x0;
          Py = lines.initial[i].y0;
          Qx = lines.initial[i].x1;
          Qy = lines.initial[i].y1;
        } else {
          Px_prime = lines.initial[i].x0;
          Py_prime = lines.initial[i].y0;
          Qx_prime = lines.initial[i].x1;
          Qy_prime = lines.initial[i].y1;
          Px = lines.final[i].x0;
          Py = lines.final[i].y0;
          Qx = lines.final[i].x1;
          Qy = lines.final[i].y1;
        }

        // calculate u based on PiQi
        var XP_x = Xx - Px;
        var XP_y = Xy - Py;
        var QP_x = Qx - Px;
        var QP_y = Qy - Py;
        var QP_mag = Math.sqrt( Math.pow(Px - Qx, 2) + Math.pow(Py - Qy, 2) );
        var QP_mag_prime = Math.sqrt( Math.pow(Px_prime - Qx_prime, 2) + Math.pow(Py_prime - Qy_prime, 2) );
        var u = ((XP_x * QP_x) + (XP_y * QP_y)) / Math.pow(QP_mag, 2);

        // calculate v based on PiQi
        var v = ( (XP_x * QP_y * -1) + (XP_y * QP_x) ) / Math.pow(QP_mag, 2);

        // calculate X_prime based on u, v, and Pi_Qi_
        var QP_x_prime = Qx_prime - Px_prime;
        var QP_y_prime = Qy_prime - Py_prime;
        Xx_prime = Px_prime + (u * QP_x_prime) + ((v * QP_y_prime * -1) / Math.pow(QP_mag_prime, 2));
        Xy_prime = Py_prime + (u * QP_y_prime) + ((v * QP_x_prime) / Math.pow(QP_mag_prime, 2));

        // calculate displacement Di = X_prime - X for this lines
        var DiX = Math.abs(Xx_prime - Xx);
        var DiY = Math.abs(Xy_prime - Xy);

        // compute distance, d = shortest distance from X to PiQi
        var d;
        if (u > 0 && u < 1) { d = Math.abs(v); }
        else if (u < 0) { d = Math.sqrt( Math.pow(Px - Xx, 2) + Math.pow(Py - Xy, 2) ); }
        else if (u > 1) { d = Math.sqrt( Math.pow(Qx - Xx, 2) + Math.pow(Qy - Xy, 2) ); }

        // compute weight, w = ( (length^p) / (a+d) )^b
        var p = 0.5;
        var a = 0.01;
        var b = 2;
        var w = Math.pow((Math.pow(QP_mag, p) / (a + d)), b);

        dSumX = dSumX + DiX * w;
        dSumX = dSumX + DiY * w;
        weightSum = weightSum + w;
      }

      Xx_prime = Math.round(Xx + (dSumX / weightSum));
      Xy_prime = Math.round(Xy + (dSumY / weightSum));

      var newPixel = image.getPixel(Xx_prime, Xx_prime);
      newImg.setPixel(Xx, Xy, newPixel);
    }
  }

  return newImg;
}

Filters.morphFilter = function( initialImg, finalImg, alpha, sampleMode, linesFile ) {
  var lines = Parser.parseJson( "images/" + linesFile );
  // ----------- STUDENT CODE BEGIN ------------
  var image = finalImg.createImg(finalImg.width, finalImg.height);
  var initialImg2 = warp(initialImg, lines, 1);
  var finalImg2 = warp(finalImg, lines, 0);

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {

      var initialPixel = initialImg2.getPixel(x, y);
      var finalPixel = finalImg2.getPixel(x, y);

      var r = alpha * finalPixel.data[0] + (1-alpha) * initialPixel.data[0];
      var g = alpha * finalPixel.data[1] + (1-alpha) * initialPixel.data[1];
      var b = alpha * finalPixel.data[2] + (1-alpha) * initialPixel.data[2];
      var newPixel = new Pixel(r, g, b, finalImg.a, "rgb");

      image.setPixel(x, y, newPixel);
    }
  }

  // ----------- Our reference solution uses 83 lines of code.
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('morphFilter is not implemented yet');
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
  var newImg = image.createImg(image.width, image.height);
  var edges = Filters.gaussianFilter(Filters.edgeFilter(image), 3);
  
  var painted = [];
  for (var x = 0; x < image.width; x++) {
     painted[x] = [];
	 for (var y = 0; y < image.height; y++) {
		 painted[x][y] = false;
	 }
  }
  
  var iterations = image.width * image.height / 6;
  for (var i = 0; i < iterations; i++) {
	  
		//center of circle to draw
		var xC = Math.floor(image.width * Math.random());
		var yC = Math.floor(image.height * Math.random());
		
		//smaller circle if near an edge
		var edgePixel = edges.getPixel(xC, yC);
		if (edgePixel.data[2] > 0.5) {
			var r = Math.max(1, Math.floor(3 * Math.random()));
		} else {
			var r = Math.max(1, Math.floor(50 * value * Math.random()));
		}
		//draw the circle
		for (var x = xC - r; x < xC + r; x++) {
			for (var y = yC - r; y < yC + r; y++) {
				if (x >= 0 && y >= 0 && x < image.width && y < image.height) {
					if ((x - xC) * (x - xC) + (y - yC) * (y - yC) < r * r) {
						if (painted[x][y]) {
							newImg.setPixel(x, y, blend(image.getPixel(xC, yC), newImg.getPixel(x, y)));
						} else
							newImg.setPixel(x, y, blend(image.getPixel(xC, yC), image.getPixel(x, y)));
						painted[x][y] = true;
					}
				}
			}
		}
    }
	
	//fill in empty spaces
	for (var xC = 0; xC < image.width; xC++) {
	 for (var yC = 0; yC < image.height; yC++) {
		 if (!painted[xC][yC]) {
			var r = Math.max(1, Math.floor(5 * Math.random()));
			for (var x = xC - r; x < xC + r; x++) {
				for (var y = yC - r; y < yC + r; y++) {
					if (x >= 0 && y >= 0 && x < image.width && y < image.height) {
						if ((x - xC) * (x - xC) + (y - yC) * (y - yC) < r * r) {
							if (painted[x][y]) {
								newImg.setPixel(x, y, blend(image.getPixel(xC, yC), newImg.getPixel(x, y)));
							} else
								newImg.setPixel(x, y, blend(image.getPixel(x,y) ,image.getPixel(xC, yC)));
							painted[x][y] = true;
						}
					}
				}
			}
		 }
	 }
  }
  image = newImg;
  // ----------- STUDENT CODE END ------------
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

function warpBad(image, lines, isInitial) {
  var newImg = image.createImg(image.width, image.height);

  for (var Xx = 0; Xx < image.width; Xx++) {
    for (var Xy = 0; Xy < image.height; Xy++) {
      var dSumX = 0;
      var dSumY = 0;
      var weightSum = 0;
      var Px_prime, Py_prime, Qx_prime, Qy_prime;
      var Xx_prime, Xy_prime;

      // for each line PiQi
      for (var i = 1; i < 10; i++) {
        var Px, Py, Qx, Qy;
        if (isInitial == 1) {
          Px_prime = lines.final[i].x0;
          Py_prime = lines.final[i].y0;
          Qx_prime = lines.final[i].x1;
          Qy_prime = lines.final[i].y1;
          Px = lines.initial[i].x0;
          Py = lines.initial[i].y0;
          Qx = lines.initial[i].x1;
          Qy = lines.initial[i].y1;
        } else {
          Px_prime = lines.initial[i].x0;
          Py_prime = lines.initial[i].y0;
          Qx_prime = lines.initial[i].x1;
          Qy_prime = lines.initial[i].y1;
          Px = lines.final[i].x0;
          Py = lines.final[i].y0;
          Qx = lines.final[i].x1;
          Qy = lines.final[i].y1;
        }

        // calculate u based on PiQi
        var XP_x = Xx - Px;
        var XP_y = Xy - Py;
        var QP_x = Qx - Px;
        var QP_y = Qy - Py;
        var QP_mag = Math.sqrt( Math.pow(Px - Qx, 2) + Math.pow(Py - Qy, 2) );
        var QP_mag_prime = Math.sqrt( Math.pow(Px_prime - Qx_prime, 2) + Math.pow(Py_prime - Qy_prime, 2) );
        var u = ((XP_x * QP_x) + (XP_y * QP_y)) / Math.pow(QP_mag, 2);

        // calculate v based on PiQi
        var v = ( (XP_x * QP_y * -1) + (XP_y * QP_x) ) / Math.pow(QP_mag, 2);

        // calculate X_prime based on u, v, and Pi_Qi_
        var QP_x_prime = Qx_prime - Px_prime;
        var QP_y_prime = Qy_prime - Py_prime;
        Xx_prime = Px_prime + (u * QP_x_prime) + ((v * QP_y_prime * -1) / Math.pow(QP_mag_prime, 2));
        Xy_prime = Py_prime + (u * QP_y_prime) + ((v * QP_x_prime) / Math.pow(QP_mag_prime, 2));

        // calculate displacement Di = X_prime - X for this lines
        var DiX = Math.abs(Xx_prime - Xx);
        var DiY = Math.abs(Xy_prime - Xy);

        // compute distance, d = shortest distance from X to PiQi
        var d;
        if (u > 0 && u < 1) { d = Math.abs(v); }
        else if (u < 0) { d = Math.sqrt( Math.pow(Px - Xx, 2) + Math.pow(Py - Xy, 2) ); }
        else if (u > 1) { d = Math.sqrt( Math.pow(Qx - Xx, 2) + Math.pow(Qy - Xy, 2) ); }

        // compute weight, w = ( (length^p) / (a+d) )^b
        var p = 0.5;
        var a = 0.01;
        var b = 2;
        var w = Math.pow((Math.pow(QP_mag, p) / (a + d)), b);

        dSumX = dSumX + DiX * w;
        dSumX = dSumX + DiY * w;
        weightSum = weightSum + w;
      }

      Xx_prime = Math.round(Xx + (dSumX / weightSum));
      Xy_prime = Math.round(Xy + (dSumY / weightSum));

      var newPixel = image.getPixel(Xx_prime, Xx_prime);
      newImg.setPixel(Xx, Xy, newPixel);
    }
  }

  return newImg;
}

Filters.morphFilterBad = function( initialImg, finalImg, alpha, sampleMode, linesFile ) {
  var lines = Parser.parseJson( "images/" + linesFile );
  // ----------- STUDENT CODE BEGIN ------------
  var image = finalImg.createImg(finalImg.width, finalImg.height);
  var initialImg2 = warp(initialImg, lines, 1);
  var finalImg2 = warp(finalImg, lines, 0);

  for (var x = 0; x < image.width; x++) {
    for (var y = 0; y < image.height; y++) {

      var initialPixel = initialImg2.getPixel(x, y);
      var finalPixel = finalImg2.getPixel(x, y);

      var r = alpha * finalPixel.data[0] + (1-alpha) * initialPixel.data[0];
      var g = alpha * finalPixel.data[1] + (1-alpha) * initialPixel.data[1];
      var b = alpha * finalPixel.data[2] + (1-alpha) * initialPixel.data[2];
      var newPixel = new Pixel(r, g, b, finalImg.a, "rgb");

      image.setPixel(x, y, newPixel);
    }
  }

  // ----------- Our reference solution uses 83 lines of code.
  // ----------- STUDENT CODE END ------------
  //Gui.alertOnce ('morphFilter is not implemented yet');
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
