import { Injectable } from '@nestjs/common';
import { renderToString } from 'react-dom/server';
import AiForm from './Components/AIForm';

@Injectable()
export class WebService {
  getWebInterface(): string {
    // Render the React component to a static HTML string
    const html = renderToString(<AiForm />);
    return html;
  }
}