import { o as onDestroy, j as attr_style, h as stringify } from "./vendor.js";
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from "chart.js";
function BarChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    Chart.register(BarController, BarElement, LinearScale, CategoryScale, Title, Tooltip, Legend);
    let { labels, datasets, title, height = 300, horizontal = false } = $$props;
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="chart-container svelte-1m1tdtt"${attr_style(`height: ${stringify(height)}px;`)}><canvas></canvas></div>`);
  });
}
export {
  BarChart as default
};
