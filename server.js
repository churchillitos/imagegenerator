const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/generate-image', async (req, res) => {
    const { prompt, style } = req.body;

    if (!prompt || !style) {
        console.log('Missing prompt or style');
        return res.json({ error: 'Missing prompt or style' });
    }

    try {
        const response = await axios.get(`https://joshweb.click/sdxl`, {
            params: {
                q: prompt,
                style: style
            },
            responseType: 'arraybuffer'
        });

        const imagePath = path.join(__dirname, 'public', 'sdxl_image.png');
        fs.writeFileSync(imagePath, response.data);

        res.json({ imageUrl: '/sdxl_image.png' });
    } catch (error) {
        console.error('Error generating image:', error);
        res.json({ error: 'An error occurred while generating the image' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
