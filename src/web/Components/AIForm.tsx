import { useState } from 'react';

const AiForm: React.FC = () => {
  const [aiName, setAiName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [latency, setLatency] = useState(0);

  const handleSubmit = async (e) => {
    console.log("p");
    e.preventDefault();
    console.log("p");
    
    const startTime = Date.now();

    // Placeholder for the API call
    const res = await fetch('/scraper/AI', { // Replace '/api/endpoint' with your actual endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aiName, prompt }),
    });
    console.log("p");
    const data = await res.json();
    setResponse(data.result);

    const endTime = Date.now();
    setLatency(endTime - startTime);
    console.log("p");
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="aiName" className="block text-sm font-medium text-gray-700">AI Name</label>
          <input
            type="text"
            id="aiName"
            value={aiName}
            onChange={(e) => setAiName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Submit</button>
        </div>
      </form>
      {response && (
        <div className="mt-4">
          <p>Response: {response}</p>
          <p>Latency: {latency}ms</p>
        </div>
      )}
    </div>
  );
};

export default AiForm;
