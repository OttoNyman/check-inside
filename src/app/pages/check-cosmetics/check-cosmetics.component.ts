import { Chart } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import {
	chartOptions,
	parseOptions,
	creamAnalyseChart,
	fakeCreamAnalyseChart
} from "../../variables/charts";
import { OpenAIService } from '../openai.service';

interface FormData {
	id: number;
	content: string;
}

type feature = 'nutrition' | 'moisturizing' | 'wrinkle smoothing' | 'anti-acne' | 'sun protection' | 'cleansing' | 'soothing' | 'exfoliating' | 'brightening' | 'strengthening' | 'renewing';

interface productDescription {
	feature: feature;
	rate: number;
	explanation: string;
}

@Component({
	selector: 'app-check-cosmetics',
	templateUrl: './check-cosmetics.component.html',
	styleUrls: ['./check-cosmetics.component.scss']
})
export class CheckCosmeticsComponent implements OnInit {
	someComposition = 'Aqua (Water), Ethylhexyl Stearate, Niacinamide, Glycerin, Persea Gratissima (Avocado) Oil, Theobroma Cacao (Cocoa) Seed Butter Butyrospermum Parkii (Shea Butter), Glyceryl Stearate, Cetearyl Alcohol, Mandelic Acid, Lactobionic Acid, Lactic Acid, Pabthenol, Allantoin, Potassium Cetyl Phosphate, Sodium Stearoyl Glutamate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Disodium EDTA, Ethylhexylglycerin, Phenoxyethanol, DMDM Hydantoin, Parfum (Fragrance), Butylphenyl Methylpropional, Hydroxycitronellal, Limonene, Linalool, Citronellol';
	riba = `Overall, this cosmetic product is best suited for those looking for a hydrating and nourishing cream that also has some exfoliating and soothing properties. However, those with specific concerns such as anti-aging or sun protection should look for additional products to supplement this one. Additionally, some of the fragrance ingredients may cause irritation for those with sensitive skin, so patch testing is recommended. Overall, this product has a good balance of effective ingredients and can be a great addition to a skincare routine.`

	resultTextarea: HTMLTextAreaElement;
	formCount = 1;
	data: any;
	compositionChart;
	compositionForms: FormData[] = [{ id: 1, content: this.someComposition }];
	// valueExplanation: string = '';

	constructor(
		public openAIService: OpenAIService,
	) { }

	ngOnInit(): void {
		this.resultTextarea = document.getElementById('resultTextarea') as HTMLTextAreaElement;
		const chart = document.getElementById('chart');
		parseOptions(Chart, chartOptions());
		this.compositionChart = new Chart(chart, {
			type: 'horizontalBar',
			// options: creamAnalyseChart.options,
			// data: creamAnalyseChart.data
		});
	}

	addForm() {
		const newFormId = this.formCount + 1;
		this.formCount++;
		this.compositionForms.push({ id: newFormId, content: '' });
	}

	removeForm() {
		if (this.compositionForms.length > 1) {
			this.compositionForms.pop();
			this.formCount--;
		}
	}

	updateTextareaRows() {
		this.resultTextarea.style.height = `${this.resultTextarea.scrollHeight}px`;
	}

	updateFormContent(form: FormData, content: string) {
		// form.content = content;
	}

	fakeCompositionAnalysis() {
		this.resultTextarea.value = this.riba;
		this.compositionChart.options = { ...fakeCreamAnalyseChart.options };
		this.compositionChart.data = { ...fakeCreamAnalyseChart.data };
		this.compositionChart.update();
		this.updateTextareaRows();
	}

	realCompositionAnalysis(promptType: string) {
		const input = this.compositionForms[0].content;
		this.openAIService.getOpenAIResponse(promptType, input).then((resp) => {
			const respArray = resp.split(/\n|~~/).filter(item => item.trim() !== '');
			const chartLabels: feature[] = [];
			const chartRates: number[] = [];
			const chartExplanations: string[] = [];
			const generalDescription = respArray[respArray.length - 1];
			// const resultArray: productDescription[] = [];
			for (let i = 0; i < respArray.length - 1; i++) {
				const productCharacteristic = respArray[i];
				// console.log(productCharacteristic);
				const [feature, rate, explanation] = productCharacteristic.split("--");
				chartLabels.push(feature.trim() as feature);
				chartRates.push(+rate);
				chartExplanations.push(explanation.trim());
				// const productCharacteristicObject = {
				// 	feature: feature.trim() as feature,
				// 	rate: +rate,
				// 	explanation: explanation.trim()
				// };
				// resultArray.push(productCharacteristicObject);
			}

			this.resultTextarea.value = generalDescription;
			this.updateTextareaRows();

			const chartData = {
				labels: chartLabels,
				datasets: [
					{
						label: "Some cool cream",
						data: chartRates,
						backgroundColor: "#5e72e4",
						// indexAxis: "y",
						maxBarThickness: 5
					},
				]
			};
			this.compositionChart.data = chartData;
			this.compositionChart.options = { ...creamAnalyseChart.options };
			this.compositionChart.options.tooltips.callbacks = {
				label: function (tooltipItem, data) {
					// const label = chartLabels[tooltipItem.index];
					const label = data.datasets[tooltipItem.datasetIndex].label || '';
					const rate = chartRates[tooltipItem.index];
					const description = chartExplanations[tooltipItem.index];
					const tooltipLines = [`${label}: ${rate}/10`];
					tooltipLines.push(...description.split('\n'));
					return tooltipLines;
				}
			};
			this.compositionChart.update();
		});
	}

	clearResult() {
		this.resultTextarea.value = '';
		// this.updateTextareaRows();
		this.resultTextarea.style.height = '157px';
		this.compositionChart.clear();
	}
};
