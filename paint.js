// Variables
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var layers = [];
var activeLayer = 0;
var isDrawing = false;
var start = {};
var end = {};
var shapes = [];
var currentShape = {};

// Añlgoritmo DDA
function DDA(start, end, color, lineWidth) {
    var dx = end.x - start.x;
    var dy = end.y - start.y;
    var steps = Math.max(Math.abs(dx), Math.abs(dy));
    var xIncrement = dx / steps;
    var yIncrement = dy / steps;
  
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(start.x, start.y);
    var x = start.x;
    var y = start.y;
    for (var i = 0; i < steps; i++) {
      x += xIncrement;
      y += yIncrement;
      ctx.lineTo(Math.round(x), Math.round(y));
    }
    ctx.stroke();
}

// que dibuje los pixel
function drawPixel(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
}

// dibuja la linea referencias en drawHexagon
function drawLine(start, end, color, lineWidth) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

// funcion rectangulos
function drawRectangle(start, end, color, lineWidth) {
    var width = end.x - start.x;
    var height = end.y - start.y;
    var dx = (width > 0) ? 1 : -1;
    var dy = (height > 0) ? 1 : -1;
    var x = start.x;
    var y = start.y;
    // Dibujar la línea superior e inferior del rectángulo
    for (var i = 0; i <= Math.abs(width); i++) {
      drawPixel(x, y, color, lineWidth);
      drawPixel(x, y + height, color, lineWidth);
      x += dx;
    }
    // Dibujar la línea izquierda y derecha del rectángulo
    x = start.x;
    y = start.y;
    for (var i = 0; i <= Math.abs(height); i++) {
      drawPixel(x, y, color, lineWidth);
      drawPixel(x + width, y, color, lineWidth);
      y += dy;
    }
}

// Dibujar circulo
function drawCircle(start, end, color, lineWidth) {
    var radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    var x = radius;
    var y = 0;
    var err = 0;
    // Dibujar el círculo usando el algoritmo DDA
    while (x >= y) {
      drawPixel(start.x + x, start.y + y, color, lineWidth);
      drawPixel(start.x + y, start.y + x, color, lineWidth);
      drawPixel(start.x - y, start.y + x, color, lineWidth);
      drawPixel(start.x - x, start.y + y, color, lineWidth);
      drawPixel(start.x - x, start.y - y, color, lineWidth);
      drawPixel(start.x - y, start.y - x, color, lineWidth);
      drawPixel(start.x + y, start.y - x, color, lineWidth);
      drawPixel(start.x + x, start.y - y, color, lineWidth);
      y += 1;
      err += 1 + 2 * y;
      if (2 * (err - x) + 1 > 0) {
        x -= 1;
        err += 1 - 2 * x;
      }
    }
}

// Funcion Hexagono
function drawHexagon(start, end, color, lineWidth) {
    const radius = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));
    const centerX = start.x + (end.x - start.x) / 2;
    const centerY = start.y + (end.y - start.y) / 2;
    const sides = 6;
    const angle = 2 * Math.PI / sides;
    const points = [];

    for (let i = 0; i < sides; i++) {
      const x = centerX + radius * Math.cos(i * angle);
      const y = centerY + radius * Math.sin(i * angle);
      points.push({ x, y });
    }
  
    for (let i = 0; i < sides; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % sides];
      drawLine(p1, p2, color, lineWidth);
    }
}
// ctx de la capa activa
function activeLayerContext() {
    return layers[activeLayer].getContext("2d");
}

// Función para dibujar la capa activa
function drawActiveLayer() {
    clearCanvas(activeLayerContext);
    for (let shape of shapes) {
      if (shape.layer === activeLayer) {
        switch (shape.type) {
          case "line":
            drawLine(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "rectangle":
            drawRectangle(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "circle":
            drawCircle(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "hexagon":
            drawHexagon(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          default:
            console.error("Unknown shape type:", shape.type);
        }
      }
    }
  }
  

//me vuelves a dibujar la capa activa
function redrawActiveLayer() {
    clearCanvas();
    for (let shape of shapes) {
      if (shape.layer === activeLayer) {
        switch (shape.type) {
          case "line":
            drawLine(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "rectangle":
            drawRectangle(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "circle":
            drawCircle(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
          case "hexagon":
            drawHexagon(shape.start, shape.end, shape.color, shape.lineWidth);
            break;
        }
      }
    }
}
// limpia el canvas obvio chale no me sale se siguen dibujando poligonos de mas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
  
// Función para dibujar una forma
function drawShape(shape) {
  ctx.beginPath();
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = shape.lineWidth;
  switch (shape.type) {
    case "line":
        DDA(shape.start, shape.end, shape.color, shape.lineWidth);
    break;
    case "rectangle":
      ctx.rect(shape.start.x, shape.start.y, shape.end.x - shape.start.x, shape.end.y - shape.start.y);
      break;
    case "circle":
      var radius = Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2));
      ctx.arc(shape.start.x, shape.start.y, radius, 0, 2 * Math.PI);
      break;
    case "hexagon":
      var radius = Math.sqrt(Math.pow(shape.end.x - shape.start.x, 2) + Math.pow(shape.end.y - shape.start.y, 2));
      var angle = Math.PI / 3;
      ctx.moveTo(shape.start.x + radius, shape.start.y);
      for (var i = 1; i < 6; i++) {
        ctx.lineTo(shape.start.x + radius * Math.cos(angle * i), shape.start.y + radius * Math.sin(angle * i));
      }
      break;
  }
  ctx.stroke();
}

// Función para crear una nueva capa
function addLayer() {
  var layer = {
    shapes: [],
  };
  layers.push(layer);
  activeLayer = layers.length - 1;
}

// Función para crear una nueva forma
function addShape(type) {
    currentShape = {
        type: type,
        color: "#000000",
        lineWidth: 1,
        layer: activeLayer,
    };
  shapes.push(currentShape);
}

// Función para actualizar el preview
function updatePreview() {
  drawActiveLayer();
  if (isDrawing) {
    drawShape(currentShape);
  }
}

// Función para detectar el inicio del dibujo
function handleMouseDown(event) {
    isDrawing = true;
    start.x = event.pageX - canvas.offsetLeft;
    start.y = event.pageY - canvas.offsetTop;
    end.x = start.x;
    end.y = start.y;
    addShape(event.target.id);
    updatePreview();
  }

//Funcion para detectar el movimiento del mouse
function handleMouseMove(event) {
    if (isDrawing) {
      end = getCursorPosition(event);
      currentShape.end = end;
      updatePreview();
    }
}

function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  

//Funcion para detectar el mouseup
function handleMouseUp(event) {
    if (isDrawing) {
      end.x = event.pageX - canvas.offsetLeft;
      end.y = event.pageY - canvas.offsetTop;
      currentShape.end = end;
      shapes.push(currentShape);
      currentShape = {};
      isDrawing = false;
    }
    updatePreview();
  }

