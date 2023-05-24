import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class OpenAIService {

	async getOpenAIResponse(promptType: string, inputText: string): Promise<string> {
		const startTime = new Date();
		const dataToSend = JSON.stringify({ promptType, inputText });

		try {
			const response = await axios.post('http://localhost:3000/api/openai-response', dataToSend,
				{ headers: { 'Content-Type': 'application/json', } }
			);
			const endTime = new Date();
			const timeDifference = (endTime.getTime() - startTime.getTime()) / 1000;
			const tokensQuantity = response?.data?.result?.usage?.total_tokens;
			console.log('time: ' + timeDifference);
			console.log('tokens: ' + tokensQuantity);
			// console.log(response);
			const result = response?.data?.result?.choices[0]?.message?.content;
			return result;
		} catch (error) {
			console.error('Ошибка при запросе к бекенду:', error);
			throw error;
		}
	}
}