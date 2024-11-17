import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fileUpload from 'express-fileupload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Verify API key is present
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
}));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/crop-recommendation', async (req, res) => {
  try {
    const formData = req.body;
    
    const prompt = `Based on these farming conditions, analyze and recommend the TOP 4 MOST SUITABLE crops 
considering soil compatibility, water requirements, and seasonal conditions. Prioritize crops with:
1. Highest yield potential in given conditions
2. Best match for the specified soil type
3. Optimal water requirement match
4. Historical success in the region

Using these farming conditions:
{
  "location": {
    "state": "${formData.state}",
    "district": "${formData.district}",
    "season": "${formData.season}"
  },
  "conditions": {
    "water": "${formData.waterAvailability}",
    "soil": "${formData.soilType}",
    "rainfall": "${formData.rainfall}",
    "temperature": "${formData.temperature}",
    "previousCrop": "${formData.previousCrop}"
  }
}

Return a JSON response with the TOP 4 MOST SUITABLE crop names in English followed by exact Telugu translation in parentheses. 
For example: "Sunflower (పొద్దుతిరుగుడు)". Format as:
{
  "recommendations": [
    {"crop": "CropName (తెలుగు అనువాదం)"},
    {"crop": "CropName (తెలుగు అనువాదం)"},
    {"crop": "CropName (తెలుగు అనువాదం)"},
    {"crop": "CropName (తెలుగు అనువాదం)"}
  ]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    try {
      const recommendations = JSON.parse(response.text());
      return res.json(recommendations);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return res.status(500).json({
        recommendations: [
          { crop: "Error: Unable to parse AI response" },
          { crop: "Please try again with different inputs" },
          { crop: "AI model response was invalid" },
          { crop: "Contact support if issue persists" }
        ]
      });
    }

  } catch (error) {
    console.error('Error in crop recommendation:', error);
    res.status(500).json({
      recommendations: [
        { crop: "Error: AI service unavailable" },
        { crop: "Please try again later" },
        { crop: "System is experiencing issues" },
        { crop: "Try again in a few moments" }
      ]
    });
  }
});

app.post('/api/disease-prediction', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const imageFile = req.files.image;
    const imageData = imageFile.data.toString('base64');

    const prompt = `Analyze this plant image and identify if there are any diseases present. 
    If a disease is detected, provide the disease name. If the plant appears healthy or if 
    you cannot identify any disease, please indicate that. Only identify the crop name and 
    its condition. Format the response as JSON:
    {
      "cropName": "Crop name and its condition"
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: imageData
        }
      }
    ]);

    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    return res.json(jsonResponse);

  } catch (error) {
    console.error('Error in disease prediction:', error);
    res.status(500).json({ 
      error: 'Unable to identify the plant at this time. Please try again.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key present: ${!!process.env.GEMINI_API_KEY}`);
});
