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
	resultTextarea: HTMLTextAreaElement;
	formCount = 1;
	data: any;
	compositionChart;
	// valueExplanation: string = '';
	someComposition = 'Aqua (Water), Ethylhexyl Stearate, Niacinamide, Glycerin, Persea Gratissima (Avocado) Oil, Theobroma Cacao (Cocoa) Seed Butter Butyrospermum Parkii (Shea Butter), Glyceryl Stearate, Cetearyl Alcohol, Mandelic Acid, Lactobionic Acid, Lactic Acid, Pabthenol, Allantoin, Potassium Cetyl Phosphate, Sodium Stearoyl Glutamate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Disodium EDTA, Ethylhexylglycerin, Phenoxyethanol, DMDM Hydantoin, Parfum (Fragrance), Butylphenyl Methylpropional, Hydroxycitronellal, Limonene, Linalool, Citronellol';
	riba = `Для состава А6 я бы расставила оценки следующим образом:
	Питание - 3 (в составе нет особо питательных ингредиентов, таких как масла или богатые витаминами компоненты);
	Увлажнение - 7 (глицерин находится на 2-ом месте в списке ингредиентов, что говорит о его высоком содержании, и присутствует несколько других увлажняющих компонентов);
	Борьба с морщинами - 4 (в составе есть ингредиенты, такие как пантенол и витамин С, которые могут помочь в борьбе с морщинами, но они находятся далеко в списке ингредиентов, что может указывать на их низкую концентрацию);
	Противодействие акне - 8 (в составе есть несколько активных компонентов, таких как экстракт чая, масло чайного дерева и азелоилдиглицинат, которые могут помочь в борьбе с акне);
		Защита от солнца - 1 (в составе нет ингредиентов, обеспечивающих защиту от ультрафиолетовых лучей);
		Очищение - 8 (в составе есть несколько очищающих ингредиентов, таких как натрия лауретсульфат, кокамидопропилбетаин и сульфат натрия кокоамфоацетат);
		Успокоение - 5 (масло чайного дерева и экстракт зеленого чая могут помочь успокоить раздраженную кожу, но они находятся далеко в списке ингредиентов);
		Отшелушивание - 3 (несмотря на присутствие некоторых кислот, таких как аскорбиновая кислота и лактобионовая кислота, они находятся далеко в списке ингредиентов, что указывает на низкую концентрацию);
		Разглаживание - 5 (в составе есть несколько ингредиентов, таких как пантенол и глицерин, которые могут помочь разгладить кожу, но они находятся далеко в списке ингредиентов);
		Осветление - 4 (в составе есть витамин С, который может помочь осветлить пигментацию, но он находится далеко в списке ингредиентов, что указывает на низкую концентрацию);`;

	compositionForms: FormData[] = [{ id: 1, content: this.someComposition }];
	constructor(
		public openAIService: OpenAIService,
	) { }

	ngOnInit(): void {
		this.resultTextarea = document.getElementById('resultTextarea') as HTMLTextAreaElement;
		const chart = document.getElementById('chart');
		parseOptions(Chart, chartOptions());
		this.compositionChart = new Chart(chart, {
			type: 'bar',
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
					const label = data.datasets[tooltipItem.datasetIndex].label || '';
					const tooltipLines = [label + ':'];
					const description = chartExplanations[tooltipItem.index];
					tooltipLines.push(...description.split('\n'));
					return tooltipLines;
				}
				// label: function (tooltipItem, data) {
				// 	const label = data.datasets[tooltipItem.datasetIndex].label || '';
				// 	const description = resultArray[tooltipItem.index].explanation;
				// 	const lines = [label + ':'];
				// 	lines.push.apply(lines, description.split('\n'));
				// 	return lines;
				// }
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
