import * as functions from 'firebase-functions';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cors from 'cors';
import * as fileParser from 'express-fileupload';

const corsHandler = cors({ origin: true });

// Initialize Gemini AI with environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper middleware for file uploads
const fileMiddleware = fileParser({
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
});

export const cropRecommendation = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    try {
      const formData = request.body;
      
      // Using the exact same prompt from server.js
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
        return response.json(recommendations);
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        return response.status(500).json({
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
      response.status(500).json({
        recommendations: [
          { crop: "Error: AI service unavailable" },
          { crop: "Please try again later" },
          { crop: "System is experiencing issues" },
          { crop: "Try again in a few moments" }
        ]
      });
    }
  });
});

