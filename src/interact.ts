class Slider {
  $screen: Element;
  position: { x: number; y: number } = { x: 0, y: 0 };
  mouseDownPosition: { x: number; y: number } = { x: 0, y: 0 };
  constructor($el: Element) {
    this.$screen = $el;
    window.addEventListener("mousedown", (event) => {
      this.position = {
        x: event.clientX,
        y: event.clientY,
      };
      this.mouseDownPosition = {
        x: this.$screen.scrollLeft,
        y: this.$screen.scrollTop,
      };
    });
  }
  slide(event: MouseEvent) {
    event.preventDefault();
    const x = this.position.x + (this.mouseDownPosition.x - event.clientX);
    const y = this.position.y + (this.mouseDownPosition.y - event.clientY);
    this.$screen.scrollLeft = x;
    this.$screen.scrollTop = y;
  }
}

export function attatchSliderToElement($el: Element) {
  const slider = new Slider($el);
  const controler = (event: MouseEvent) => slider.slide(event);
  window.addEventListener("mousedown", () => {
    window.addEventListener("mousemove", controler);
  });
  window.addEventListener("mouseup", () => {
    window.removeEventListener("mousemove", controler);
  });
}
