import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [AIName, setAiName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [latency, setLatency] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startTime = Date.now();

    try {
      const { data } = await axios.post(
        '/scraper/AI',
        { prompt, AIName },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const endTime = Date.now();
      setLatency(endTime - startTime);
      setResponse( data || 'No result returned from API');

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        setResponse(error.message);
      } else {
        console.error('Unexpected error:', error);
        setResponse('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>AiName:</label>
          <input
            type="text"
            value={AIName}
            onChange={(e) => setAiName(e.target.value)}
          />
        </div>
        <div>
          <label>Prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <div>
        <strong>Response:</strong> {response}
      </div>
      <div>
        <strong>Latency:</strong> {latency}ms
      </div>
    </div>
  );
};

export default Home;
