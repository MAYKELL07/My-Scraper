import express from 'express';
const app = express();
const PORT = 3000;
app.use(express.json());
app.post('/AI/webSearch', async (req, res) => {
    
    console.log(req.body);
    console.log(req.body.input);
    const inputs = req.body.input; // Extract input from the request body

    if (!inputs) {
        return res.status(400).json({ error: 'Input not provided.' });
    }

    try {
        const scrapedText = await scrapeYouChatText(inputs);
        res.json({ message: scrapedText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to scrape the website.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
