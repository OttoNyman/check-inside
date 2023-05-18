import { Injectable } from '@angular/core';
import axios from 'axios';



@Injectable()
export class OpenAIService {
  private apiKey = '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';

  constructor() { }

  async getOpenAIResponse(prompt: string, inputText: string): Promise<string> {
    const data = {
      // model: "text-davinci-003",
      model: "gpt-3.5-turbo",
      temperature: 0.6,
      top_p: 1,
      max_tokens: 1000,
      frequency_penalty: 0,
      presence_penalty: 1,
      messages: [
        {
          "role": "system",
          "content": prompt + inputText
        },
      ]
      // prompt: prompt + inputText
      // stop: ["\n", " Human:", " AI:"],
      // input: `${prompt}: ${inputText}`,
    };
    const dataToSend = JSON.stringify(data);

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      const result = response.data.choices[0].message.content;
      console.log(response.data.usage.total_tokens);
      return result;
    } catch (error) {
      console.error('Ошибка при запросе к OpenAI API:', error);
      throw error;
    }
  }
}







