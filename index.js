import p5 from 'p5';
import {fft} from "fft-js";

let checkbox;
let offset = 0;
let slider;

let globalMin = 0;
let globalMax = 0

const sketch = (s) => {
	s.setup = () => {
		s.createCanvas(s.windowWidth, s.windowHeight - 100);
		slider = s.createSlider(0.00000000000001, 20, 10, 0.00000000000001);

		s.frameRate(10);

		checkbox = s.createCheckbox('real', false);

		slider.position(10, 10);
		slider.style('width', '400px');
	}

	s.draw = () => {
		offset += 1;

		const size = 1024;

		s.background(0);

		s.stroke('green');

		s.line(200, 200, 200 + size, 200);
		s.line(200 + size / 2, 200 - 100, 200 + size / 2, 200 + 100);

		s.stroke('purple');
		s.strokeWeight(2);

		const points = Array(size).fill(true).map((_, x) => {
			const point = {
				x: x / 2,
				y: Math.sin((x + offset) / slider.value()) * 100
			};

			return point;
		});

		const phasors = fft(points.map(point => point.y));

		points.forEach(point => {
			s.point(point.x * 2 + 200, point.y + 200);
		});

		const graph = phasors.map(p => p[+!document.querySelector("input[type='checkbox']").checked]);

		const min = graph.reduce((prev, cur) => {
			if(prev > cur) {
				return cur;
			}

			return prev;
		}, graph[0]);

		const max = graph.reduce((prev, cur) => {
			if(prev < cur) {
				return cur;
			}

			return prev;
		}, graph[0]);

		if(min < globalMin) {
			globalMin = min;
		}

		if(max < globalMax) {
			globalMax = max;
		}

		const scale = globalMax - globalMin;

		Array(graph.length * 100)
			.fill(true)
			.forEach((_, x) => {
				const fullX = Math.floor(x / 100)
				const diff = (x / 100) - fullX;

				const p = graph[fullX] * diff + ((graph[fullX + 1] || graph[fullX]) * (1 - diff));

				s.point(200 + x * 2 / 200, 400 + ((p - globalMin) / scale) * 200);
			});
	}

	s.windowResized = () => {
		s.resizeCanvas(s.windowWidth, s.windowHeight - 100)
	}
}

const sketchInstance = new p5(sketch);
