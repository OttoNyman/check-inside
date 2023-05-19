import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class OpenAIService {

	async getOpenAIResponse(prompt: string, inputText: string): Promise<string> {

		const dataToSend = JSON.stringify({
			prompt: prompt,
			inputText: inputText
		});

		try {
			const response = await axios.post('http://localhost:3000/api/openai-response', dataToSend,
				{ headers: { 'Content-Type': 'application/json', } }
			);
			// console.log(response);
			const result = response?.data?.result?.choices[0]?.message?.content;
			return result;
		} catch (error) {
			console.error('Ошибка при запросе к бекенду:', error);
			throw error;
		}
	}
}