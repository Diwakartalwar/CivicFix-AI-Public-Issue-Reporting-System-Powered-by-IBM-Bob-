"""
Google Gemini Integration Service
Handles all AI model interactions for classification, generation, and improvement
"""

import os
import json
import logging
import google.generativeai as genai
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """
    Service class for interacting with Google Gemini API
    """
    
    def __init__(self):
        """Initialize the Gemini client"""
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY must be set in environment variables")
        
        # Configure Gemini
        try:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
            logger.info(f"Successfully initialized Gemini with model: {self.model_name}")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {str(e)}")
            raise
    
    def generate_text(self, prompt, max_tokens=500, temperature=0.7):
        """
        Generate text using Gemini
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature (0-2)
            
        Returns:
            str: Generated text
        """
        try:
            generation_config = genai.types.GenerationConfig(
                max_output_tokens=max_tokens,
                temperature=temperature,
            )
            
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config
            )
            
            generated_text = response.text.strip()
            logger.info("Successfully generated text from Gemini")
            return generated_text
            
        except Exception as e:
            logger.error(f"Error generating text: {str(e)}")
            raise Exception(f"AI service error: {str(e)}")
    
    def classify_issue(self, prompt):
        """
        Classify a civic issue and return structured JSON
        
        Args:
            prompt (str): Classification prompt
            
        Returns:
            dict: Classification results
        """
        try:
            response_text = self.generate_text(prompt, max_tokens=500, temperature=0.3)
            logger.info(f"Raw classification response: {response_text[:200]}")
            
            # Try to extract JSON from response
            # Remove markdown code blocks if present
            response_text = response_text.replace('```json', '').replace('```', '').strip()
            
            # Find JSON object
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_text = response_text[json_start:json_end]
                classification = json.loads(json_text)
                
                # Validate and normalize required fields
                required_fields = ['category', 'severity', 'urgency', 'reasoning']
                if all(field in classification for field in required_fields):
                    # Normalize values
                    classification['severity'] = classification['severity'].lower()
                    classification['urgency'] = classification['urgency'].lower()
                    return classification
                else:
                    logger.warning(f"Classification response missing required fields. Got: {classification.keys()}")
                    return self._get_default_classification()
            else:
                logger.warning(f"No valid JSON found in classification response: {response_text[:200]}")
                return self._get_default_classification()
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse classification JSON: {str(e)}. Response: {response_text[:200]}")
            return self._get_default_classification()
        except Exception as e:
            logger.error(f"Error in classify_issue: {str(e)}")
            # Return default instead of raising to keep app working
            return self._get_default_classification()
    
    def generate_complaint(self, prompt):
        """
        Generate a formal complaint document
        
        Args:
            prompt (str): Generation prompt
            
        Returns:
            str: Formatted complaint text
        """
        try:
            complaint = self.generate_text(prompt, max_tokens=800, temperature=0.7)
            return complaint
        except Exception as e:
            logger.error(f"Error in generate_complaint: {str(e)}")
            raise
    
    def improve_complaint(self, prompt):
        """
        Improve an existing complaint
        
        Args:
            prompt (str): Improvement prompt
            
        Returns:
            str: Improved complaint text
        """
        try:
            improved_complaint = self.generate_text(prompt, max_tokens=1000, temperature=0.7)
            return improved_complaint
        except Exception as e:
            logger.error(f"Error in improve_complaint: {str(e)}")
            raise
    
    def _get_default_classification(self):
        """
        Return a default classification when AI fails
        """
        return {
            "category": "Other",
            "severity": "medium",
            "urgency": "medium",
            "reasoning": "Unable to automatically classify. Please review manually."
        }


# Singleton instance
_ai_service = None

def get_ai_service():
    """
    Get or create the AI service singleton instance
    """
    global _ai_service
    if _ai_service is None:
        _ai_service = GeminiService()
    return _ai_service

# Made with Bob
