// Manejadores de eventos para los botones de la interfaz
document.getElementById("line").addEventListener("click", function () {
    currentShape.type = "line";
});
document.getElementById("rectangle").addEventListener("click", function () {
    currentShape.type = "rectangle";
});
document.getElementById("circle").addEventListener("click", function () {
    currentShape.type = "circle";
});
document.getElementById("hexagon").addEventListener("click", function () {
    currentShape.type = "hexagon";
});
document.getElementById("color-picker").addEventListener("change", function () {
    currentShape.color = this.value;
});
document.getElementById("line-width").addEventListener("change", function () {
    currentShape.lineWidth = this.value;
});
document.getElementById("clear").addEventListener("click", function () {
    shapes = [];
    drawActiveLayer();
});

// Manejadores de eventos para el canvas
canvas.addEventListener("mousedown", function (e) {
    isDrawing = true;
    start.x = e.offsetX;
    start.y = e.offsetY;
    end.x = e.offsetX;
    end.y = e.offsetY;
});

canvas.addEventListener("mousemove", function (e) {
    //clearCanvas(); // LIMPIA ESA CAPA!!!!
    if (isDrawing) {
        end.x = e.offsetX;
        end.y = e.offsetY;
        drawActiveLayer();
        switch (currentShape.type) {
            case "line":
                DDA(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "rectangle":
                drawRectangle(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "circle":
                drawCircle(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "hexagon":
                drawHexagon(start, end, currentShape.color, currentShape.lineWidth);
                break;
        }
    }
});

canvas.addEventListener("mouseup", function (e) {
    if (isDrawing) {
        isDrawing = false;
        end.x = e.offsetX;
        end.y = e.offsetY;
        switch (currentShape.type) {
            case "line":
                shapes.push({ type: "line", start: start, end: end, color: currentShape.color, lineWidth: currentShape.lineWidth, layer: activeLayer });
                drawLine(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "rectangle":
                shapes.push({ type: "rectangle", start: start, end: end, color: currentShape.color, lineWidth: currentShape.lineWidth, layer: activeLayer });
                drawRectangle(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "circle":
                shapes.push({ type: "circle", start: start, end: end, color: currentShape.color, lineWidth: currentShape.lineWidth, layer: activeLayer });
                drawCircle(start, end, currentShape.color, currentShape.lineWidth);
                break;
            case "hexagon":
                shapes.push({ type: "hexagon", start: start, end: end, color: currentShape.color, lineWidth: currentShape.lineWidth, layer: activeLayer });
                drawHexagon(start, end, currentShape.color, currentShape.lineWidth);
                break;
        }
        redrawActiveLayer();
    }
});

