import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({
    AIName: '',
    prompt: '',
    inputText: '',
    userUID: '',
    response: '',
    alodokterResponse: '',
    genshinResponse: {},
    latency: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    const startTime = Date.now();

    try {
      const { data } = await axios.post(endpoint, formData);
      const endTime = Date.now();
      const latency = endTime - startTime;

      switch (endpoint) {
        case '/scraper/AI':
          setFormData(prevState => ({ ...prevState, response: data, latency }));
          break;
        case '/scraper/alodokter':
          setFormData(prevState => ({ ...prevState, alodokterResponse: data }));
          break;
        case '/scraper/genshin-stats':
          setFormData(prevState => ({ ...prevState, genshinResponse: data }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

          {/* AI Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">AI Form</h2>
            <form onSubmit={(e) => handleSubmit(e, '/scraper/AI')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">AiName:</label>
                <input name="AIName" value={formData.AIName} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium">Prompt:</label>
                <input name="prompt" value={formData.prompt} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
            </form>
            <div className="mt-4">
              <strong>Response:</strong> {formData.response}
            </div>
            <div>
              <strong>Latency:</strong> {formData.latency}ms
            </div>
          </div>

          {/* Alodokter Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Alodokter Form</h2>
            <form onSubmit={(e) => handleSubmit(e, '/scraper/alodokter')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Search Alodokter:</label>
                <input name="inputText" value={formData.inputText} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Search</button>
            </form>
            <div className="mt-4">
              <strong>Alodokter Response:</strong> {formData.alodokterResponse}
            </div>
          </div>

          {/* Genshin Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Genshin Form</h2>
            <form onSubmit={(e) => handleSubmit(e, '/scraper/genshin-stats')} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">User UID:</label>
                <input name="userUID" value={formData.userUID} onChange={handleChange} className="mt-1 p-2 w-full border rounded-md" />
              </div>
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Get Stats</button>
            </form>
            <div className="mt-4">
              <strong>Genshin Stats:</strong>
              <pre className="bg-gray-200 p-2 rounded-md">{JSON.stringify(formData.genshinResponse, null, 2)}</pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
