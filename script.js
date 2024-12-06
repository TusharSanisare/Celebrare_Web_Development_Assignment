const prevImageBtn = document.getElementById("prevImageBtn");
const nextImageBtn = document.getElementById("nextImageBtn");
const addTextBtn = document.getElementById("addTextBtn");
const fontSizeInput = document.getElementById("fontSize");
const textColorInput = document.getElementById("textColor");
const fontStyleInput = document.getElementById("fontStyle");
const textAlignmentInput = document.getElementById("textAlignment");
const deleteTextBtn = document.getElementById("deleteTextBtn");
const imageWrappers = document.querySelectorAll(".image-wrapper");

let currentImageIndex = 0;
let activeTextBox = null;

// Update active image jo visible image he os point pe
const updateActiveImage = () => {
    imageWrappers.forEach((wrapper, index) => {
        wrapper.classList.toggle("active", index === currentImageIndex);
    });
};

prevImageBtn.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + imageWrappers.length - 1) % imageWrappers.length;
    updateActiveImage();
});

nextImageBtn.addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % imageWrappers.length;
    updateActiveImage();
});

// Add new text ke leye  
addTextBtn.addEventListener("click", () => {
    const activeTextLayer = imageWrappers[currentImageIndex].querySelector(".text-layer");

    const textBox = document.createElement("div");
    textBox.className = "text-box";
    textBox.contentEditable = true;
    textBox.innerText = "Edit me!";
    textBox.style.fontSize = fontSizeInput.value + "px";
    textBox.style.color = textColorInput.value;
    textBox.style.left = "50px";
    textBox.style.top = "50px";

    textBox.addEventListener("mousedown", startDrag);
    textBox.addEventListener("click", () => (activeTextBox = textBox));
    activeTextLayer.appendChild(textBox);
});

// Delete selected text
deleteTextBtn.addEventListener("click", () => {
    if (activeTextBox) {
        activeTextBox.remove();
        activeTextBox = null;
    }
});

// Update text properties
fontSizeInput.addEventListener("input", () => {
    if (activeTextBox) activeTextBox.style.fontSize = fontSizeInput.value + "px";
});

textColorInput.addEventListener("input", () => {
    if (activeTextBox) activeTextBox.style.color = textColorInput.value;
});

fontStyleInput.addEventListener("change", () => {
    if (!activeTextBox) return;
    activeTextBox.style.fontWeight = fontStyleInput.value === "bold" ? "bold" : "normal";
    activeTextBox.style.fontStyle = fontStyleInput.value === "italic" ? "italic" : "normal";
    activeTextBox.style.textDecoration = fontStyleInput.value === "underline" ? "underline" : "none";
});

textAlignmentInput.addEventListener("change", () => {
    if (activeTextBox) activeTextBox.style.textAlign = textAlignmentInput.value;
});

// Drag functionality
let offsetX = 0, offsetY = 0;

function startDrag(e) {
    activeTextBox = e.target;
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
}

function drag(e) {
    if (!activeTextBox) return;

    const rect = activeTextBox.parentElement.getBoundingClientRect();
    activeTextBox.style.left = Math.min(Math.max(e.pageX - rect.left - offsetX, 0), rect.width - activeTextBox.offsetWidth) + "px";
    activeTextBox.style.top = Math.min(Math.max(e.pageY - rect.top - offsetY, 0), rect.height - activeTextBox.offsetHeight) + "px";
}

function stopDrag() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);
}


// Constrain text dragging joo image boundaries ke ander oske liye
document.addEventListener('DOMContentLoaded', () => {
  const textBoxes = document.querySelectorAll('.text-box');

  textBoxes.forEach(textBox => {
      textBox.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const textLayer = e.target.closest('.text-layer');
          const bounds = textLayer.getBoundingClientRect();

          let offsetX = e.clientX - textBox.getBoundingClientRect().left;
          let offsetY = e.clientY - textBox.getBoundingClientRect().top;

          const onMouseMove = (moveEvent) => {
              let x = moveEvent.clientX - bounds.left - offsetX;
              let y = moveEvent.clientY - bounds.top - offsetY;

              // Prevent dragging outside boundaries
              x = Math.max(0, Math.min(x, bounds.width - textBox.offsetWidth));
              y = Math.max(0, Math.min(y, bounds.height - textBox.offsetHeight));

              textBox.style.left = `${x}px`;
              textBox.style.top = `${y}px`;
          };

          const onMouseUp = () => {
              document.removeEventListener('mousemove', onMouseMove);
              document.removeEventListener('mouseup', onMouseUp);
          };

          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
      });
  });
});


const fontFamilyInput = document.getElementById("fontFamily");

// Update font family   wala for selected text box ke leye
fontFamilyInput.addEventListener("change", () => {
    if (activeTextBox) {
        activeTextBox.style.fontFamily = fontFamilyInput.value;
    }
});