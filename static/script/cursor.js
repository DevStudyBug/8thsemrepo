const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");

const colors = [
  "#F5FAFF", // Very Pale Blue  
  "#F0F8FF", // Alice Blue  
  "#E8F2FF", // Soft Ice Blue  
  "#E0ECFF", // Light Mist Blue  
  "#D6E6FF", // Cloud Blue  
  "#CCE0FF", // Pale Sky Blue  
  "#BFD9FF", // Soft Pastel Blue  
  "#B0D1FF", // Light Blue Tint  
  "#A0CFFF", // Gentle Blue  
  "#98B8FF", // Light Sky Blue  
  "#7FA9FF", // Soft Blue  
  "#669BFF", // Sky Blue  
  "#4F8DFF", // Medium Sky Blue  
  "#3380FF", // Vivid Blue  
  "#2563EB", // Vibrant Medium Blue  
  "#1E54D2", // Royal Blue  
  "#1846B9", // Deep Royal Blue  
  "#1539A1", // Darker Blue  
  "#102D89", // Rich Dark Blue  
  "#0B206F", // Very Deep Blue  
  "#061556", // Midnight Blue  
  "#001646"  // Dark Navy Blue  
];

circles.forEach(function (circle, index) {
  circle.x = 0;
  circle.y = 0;
  circle.style.backgroundColor = colors[index % colors.length];
});

window.addEventListener("mousemove", function(e){
  coords.x = e.clientX;
  coords.y = e.clientY;
  
});

function animateCircles() {
  
  let x = coords.x;
  let y = coords.y;
  
  circles.forEach(function (circle, index) {
    circle.style.left = x - 12 + "px";
    circle.style.top = y - 12 + "px";
    
    circle.style.scale = (circles.length - index) / circles.length;
    
    circle.x = x;
    circle.y = y;

    const nextCircle = circles[index + 1] || circles[0];
    x += (nextCircle.x - x) * 0.3;
    y += (nextCircle.y - y) * 0.3;
  });
 
  requestAnimationFrame(animateCircles);
}

animateCircles();
