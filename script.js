
const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  };

async function idle() {
    const hero = document.getElementById('hero')

    while (true) {
        hero.style.transform = `translate(0px, 10px)`;
        await delay(100);
        hero.style.transform = `translate(0px, -10px)`;
    }
    
}


function onload() {
    
    const parallaxImage = document.getElementById('hero')
    const container = document.getElementById('main')

    // let moveX = 0;
    // let moveY = 0;

    document.addEventListener('mousemove',e => {
        let mouseY = e.layerX;
        let mouseX = e.layerY;

        const height = window.innerHeight;
        const width = window.innerWidth;
        

        
        // amountX = (moveX - mouseX)/10
        // amountY = (moveY - mouseY)/10

        const percentX = (mouseX / width - 0.5) * 2; // -1 to 1 range
        const percentY = (mouseY / height - 0.5) * 2; // -1 to 1 range

        const moveAmount = 10; // Maximum amount to move the image
        const translateX = percentX * moveAmount;
        const translateY = percentY * moveAmount;

        
        parallaxImage.style.transform = `translate(${translateX}px, ${translateY}px)`;

        // console.log(moveX - mouseX,moveY - mouseY);
        // moveX = mouseX;
        // moveY = mouseY;
    })    
}