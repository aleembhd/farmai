import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Crop recommendation endpoint
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
    const aiResponse = await result.response;
    
    try {
      const recommendations = JSON.parse(aiResponse.text());
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

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
