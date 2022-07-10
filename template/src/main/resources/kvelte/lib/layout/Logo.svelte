<div class="svgSample1">
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <text dy="0.4em" id="outTextx">K</text>
    </defs>
    <use x="50%" y="50%" xlink:href="#outTextx"></use>
    <use x="50%" y="50%" xlink:href="#outTextx"></use>
  </svg>
</div>

<style>
  .svgSample1 text {
    font-weight: bold;
    font-size: 24px;
    font-family: Meiryo UI;
    stroke: #ff3e00;
    fill: #ffffff;
    letter-spacing: 5px;
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .svgSample1 > svg > use:nth-of-type(1) {
    stroke-width: 11px;
    paint-order: stroke;
    stroke-linejoin: round;
  }
  .svgSample1 > svg > use:nth-of-type(2) {
    stroke-width: 0;
  }
</style>
