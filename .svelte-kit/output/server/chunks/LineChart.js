import { o as onDestroy, j as attr_style, h as stringify } from "./vendor.js";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler } from "chart.js";
function LineChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);
    let { labels, datasets, title, height = 300 } = $$props;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="chart-container svelte-dtmdr8"${attr_style(`height: ${stringify(height)}px;`)}><canvas></canvas></div>`);
  });
}
export {
  LineChart as default
};
