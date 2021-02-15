const slider = document.querySelector('.slide-container'),
  slides = Array.from(document.querySelectorAll('.slide'))

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0

const getPositionX = e => {
  return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX
}

const setSliderPosition = () => {
  slider.style.transform = `translateX(${currentTranslate}px)`
}

const animation = () => {
  setSliderPosition()
  if (isDragging) requestAnimationFrame(animation)
}

const setPositionByIndex = () => {
  currentTranslate = currentIndex * -window.innerWidth
  prevTranslate = currentTranslate
  setSliderPosition()
}

const touchStart = (index) => {
  return function (e) {
    currentIndex = index
    startPos = getPositionX(e)
    isDragging = true

    animationID = requestAnimationFrame(animation)
    slider.classList.add('grabbing')
  }
}

const touchEnd = () => {
  isDragging = false
  cancelAnimationFrame(animationID)

  const movedBy = currentTranslate - prevTranslate

  if (movedBy < -100 && currentIndex < slides.length - 1) currentIndex++

  if (movedBy > 100 && currentIndex > 0) currentIndex--

  setPositionByIndex()

  slider.classList.remove('grabbing')
}

const touchMove = (e) => {
  if (isDragging) {
    const currentPosition = getPositionX(e)
    currentTranslate = prevTranslate + currentPosition - startPos
  }
}

slides.forEach((slide, idx) => {
  const slideImage = slide.querySelector('img')
  slideImage.addEventListener('dragstart', (e) => e.preventDefault())

  // Touch events
  slide.addEventListener('touchstart', touchStart(idx))
  slide.addEventListener('touchend', touchEnd)
  slide.addEventListener('touchmove', touchMove)

  // Mouse events
  slide.addEventListener('mousedown', touchStart(idx))
  slide.addEventListener('mouseup', touchEnd)
  slide.addEventListener('mouseleave', touchEnd)
  slide.addEventListener('mousemove', touchMove)
})

// Disable context menu
window.oncontextmenu = (e) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}