let slidePostion = 0;
const slides = document.querySelectorAll('carousel_item')
const totalSlides = slides.length;

document.querySelector('carousel_button--next').addEventListener("click", function());
{
    updateSlidePostion(moveToNextSlide());
}

document.querySelector('carousel_button--prev').addEventListener("click", function());
{
    updateSlidePostion(moveToPrevSlide());
}

function updateSlidePostion() {
    for (let slide of slides) {
        slide.classList.remove('carousel_item--visible');
        slide.classList.add('carousel_item--hidden');
    }

    slides[slidePostion].classList.add('carousel_item--visible');
}

function moveToNextSlide() {
    if(slidePostion == totalSlides -1) {
        slidePostion=0;
    }
    else {
        slidePostion++;
    }

    updateSlidePostion();
}

function moveToPrevSlide() {
    if(slidePostion == 0) {
        slidePostion = totalSlides - 1;
    }
    else {
        slidePostion--;
    }

    updateSlidePostion();
}