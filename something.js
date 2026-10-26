document.addEventListener("DOMContentLoaded", function () {

    let defaultColor = "#808080";
    let selectedColor = "";
    let drawMode = "draw"; // Keep this consistent

    let modeElement = document.querySelector('.mode');
    let isClicking = false;

    let editorContainer = document.getElementById("container");
    let editorBtn = document.getElementById("editorBtn");
    let header = document.getElementById('header');
    let home = document.getElementById('home');
    let homeBtn = document.getElementById("homeBtn");

    editorBtn.addEventListener("click", function(e){
        editorContainer.style.display = "block";
        home.style.display = "none";
        header.style.display = "none";
    });

    homeBtn.addEventListener("click", function(e){
        editorContainer.style.display = "none";
        home.style.display = "block";
        header.style.display = "flex";
    });

    document.addEventListener("mousedown", function(event){
        isClicking = true;
    });

    document.addEventListener("mouseup", function(event){
        isClicking = false;
    });

    let colorSelector = document.querySelector(".color");
    colorSelector.addEventListener("change", function(e){
        selectedColor = colorSelector.value;
        drawMode = "draw"; // Reset mode back to draw
        console.log(colorSelector.value);
        modeElement.innerHTML = 'Mode: Draw';
    });

    colorSelector.addEventListener("click", function(e){
        drawMode = "draw"; // Reset mode back to draw
        modeElement.innerHTML = 'Mode: Draw';
    });

    let eraserSelector = document.querySelector(".eraser");
    eraserSelector.addEventListener("click", function(e){
        drawMode = "eraser"; // FIXED: Changed modeDrawing to drawMode
        selectedColor = defaultColor;
        console.log(drawMode);
        console.log(selectedColor);
        modeElement.innerHTML = 'Mode: Erase';
    });

    if (!selectedColor){
        selectedColor = defaultColor;
    }

    let grids = document.querySelector("#grids");
    for (let i = 0; i < 512; i++) {
        let grid = document.createElement("div");
        grid.classList.add("grid");
        grid.setAttribute("id", `grid${i}`);
        grids.appendChild(grid);
    }

    let kumpulanGrid = document.querySelectorAll(".grid");
    for (let grid of kumpulanGrid){
        grid.addEventListener("click", function(e){
            if (drawMode === "draw"){
                grid.style.backgroundColor = selectedColor;
            } else {
                grid.style.backgroundColor = defaultColor;
            }
        });
        grid.addEventListener("mouseover", (event) => {
            if (isClicking){
                if (drawMode === "draw"){
                    grid.style.backgroundColor = selectedColor;
                } else {
                    grid.style.backgroundColor = defaultColor;
                }
            }
        });
    }

    setInterval(function(e){
        let result = "";
        for (let grid of kumpulanGrid){
            if (grid.style.backgroundColor === ""){
                grid.style.backgroundColor = defaultColor;
            }
            result += `${grid.id}:${grid.style.backgroundColor.toString()}+`;
        }
        localStorage.setItem("myData", result);
    }, 2000);

    // FIXED: Checking if data exists first to prevent crashes on a fresh load
    let savedData = localStorage.getItem("myData");
    if (savedData) {
        let dataGrids = savedData.split("+");
        for (let data of dataGrids){ // FIXED: Added 'let' to loop variable
            let [grid_id, color] = data.split(":");
            // FIXED: Added missing curly braces to resolve the lexical declaration error
            if (grid_id !== "") {
                let grid_data = document.getElementById(grid_id);
                if (grid_data) {
                    grid_data.style.backgroundColor = color;
                }
            }
        }
    }

    // FIXED: Removed duplicate 'save' declaration
    let save = document.getElementById("save");

    save.addEventListener("click", function(e){
        let node = document.getElementById('container');

        domtoimage.toJpeg(node, { quality: 1 })
            .then(function (dataUrl) {
                let link = document.createElement("a");
                link.download = "result.jpg";
                link.href = dataUrl;
                
                // Appending to body secures async downloads on strict browsers
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
    });
});
