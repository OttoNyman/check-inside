import { Chart } from 'chart.js';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
	chartOptions,
	parseOptions,
	// chartExample1,
	// chartExample2,
	creamAnalyseChart
} from "../../variables/charts";
import { OpenAIService } from '../openai.service';

export interface FormData {
	id: number;
	content: string;
}

@Component({
	selector: 'app-check-cosmetics',
	templateUrl: './check-cosmetics.component.html',
	styleUrls: ['./check-cosmetics.component.scss']
})
export class CheckCosmeticsComponent implements OnInit {
	textarea: HTMLTextAreaElement;
	formCount = 1;
	forms: FormData[] = [{ id: 1, content: '' }];
	data: any;
	ordersChart;
	salesChart;
	clicked: boolean = true;
	clicked1: boolean = false;
	valueExplanationArea: HTMLTextAreaElement;
	generalDescriptionArea: HTMLTextAreaElement;
	valueExplanation: string = '';
	// generalDescription: string = '';
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

	constructor(
		public openAIService: OpenAIService,
	) { }

	ngOnInit(): void {
		this.textarea = document.getElementById('generalDescription') as HTMLTextAreaElement;
		const chartOrders = document.getElementById('chart-orders');
		this.valueExplanationArea = document.getElementById('valueExplanation') as HTMLTextAreaElement;
		this.generalDescriptionArea = document.getElementById('generalDescription') as HTMLTextAreaElement;


		parseOptions(Chart, chartOptions());

		this.ordersChart = new Chart(chartOrders, {
			type: 'bar',
			// options: creamAnalyseChart.options,
			// data: creamAnalyseChart.data

		});

		// ordersChart.options.onHover = (event, chartElement) => {

		//   if (chartElement.length > 0) {
		//     console.log(event)
		//     console.log(chartElement)
		//     const index = chartElement[0]._index;
		//     this.valueExplanationArea.value = index.toString();
		//   } else {
		//     this.valueExplanationArea.value = '';
		//   }
		// };
	}

	addForm() {
		const newFormId = this.formCount + 1;
		this.formCount++;
		this.forms.push({ id: newFormId, content: '' });
	}

	removeForm() {
		if (this.forms.length > 0) {
			this.forms.pop();
			this.formCount--;
		}
	}

	updateTextareaRows() {
		this.textarea.style.height = `${this.textarea.scrollHeight}px`;
	}

	updateFormContent(form: FormData, content: string) {
		form.content = content;
	}

	analysisComposition() {
		this.textarea.value = this.riba;
		this.ordersChart.options = { ...creamAnalyseChart.options };
		this.ordersChart.data = { ...creamAnalyseChart.data };
		this.ordersChart.update();
		this.updateTextareaRows();
	}

	realAnalysis() {
		const prompt = `Rate the cosmetic product from 0-10 based on the following parameters: nutrition, moisturizing, wrinkle smoothing, anti-acne, sun protection, cleansing, soothing, exfoliating, brightening, strengthening, renewing. Include brief descriptions for each rating. Give answer which looks like: Nutrition--range--description~~Moisturizing--range--description~~ and so on. Composition:`;
		const input = `Aqua (Water), Ethylhexyl Stearate, Niacinamide, Glycerin, Persea Gratissima (Avocado) Oil, Theobroma Cacao (Cocoa) Seed Butter Butyrospermum Parkii (Shea Butter), Glyceryl Stearate, Cetearyl Alcohol, Mandelic Acid, Lactobionic Acid, Lactic Acid, Pabthenol, Allantoin, Potassium Cetyl Phosphate, Sodium Stearoyl Glutamate, Ammonium Acryloyldimethyltaurate/VP Copolymer, Disodium EDTA, Ethylhexylglycerin, Phenoxyethanol, DMDM Hydantoin, Parfum (Fragrance), Butylphenyl Methylpropional, Hydroxycitronellal, Limonene, Linalool, Citronellol`;
		this.openAIService.getOpenAIResponse(prompt, input).then((result) => {
			console.log(result);
			const resultObj = result.split('\n\n');
			console.log(resultObj);
			this.generalDescriptionArea.value = result;
		});
	}
}
