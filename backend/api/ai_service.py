"""
OpenAI Integration Service
Handles all AI model interactions for classification, generation, and improvement
"""

import os
import json
import logging
from openai import OpenAI
from django.conf import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """
    Service class for interacting with OpenAI API
    """
    
    def __init__(self):
        """Initialize the OpenAI client"""
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY must be set in environment variables")
        
        # Initialize OpenAI client
        try:
            self.client = OpenAI(api_key=self.api_key)
            logger.info(f"Successfully initialized OpenAI with model: {self.model}")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI: {str(e)}")
            raise
    
    def generate_text(self, prompt, max_tokens=500, temperature=0.7):
        """
        Generate text using OpenAI
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature (0-2)
            
        Returns:
            str: Generated text
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant for civic issue management."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=temperature
            )
            
            generated_text = response.choices[0].message.content.strip()
            logger.info("Successfully generated text from OpenAI")
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
            response_text = self.generate_text(prompt, max_tokens=300, temperature=0.3)
            
            # Try to extract JSON from response
            # Sometimes the model includes extra text, so we need to find the JSON part
            json_start = response_text.find('{')
            json_end = response_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_text = response_text[json_start:json_end]
                classification = json.loads(json_text)
                
                # Validate required fields
                required_fields = ['category', 'severity', 'urgency', 'reasoning']
                if all(field in classification for field in required_fields):
                    return classification
                else:
                    logger.warning("Classification response missing required fields")
                    return self._get_default_classification()
            else:
                logger.warning("No valid JSON found in classification response")
                return self._get_default_classification()
                
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse classification JSON: {str(e)}")
            return self._get_default_classification()
        except Exception as e:
            logger.error(f"Error in classify_issue: {str(e)}")
            raise
    
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
        _ai_service = OpenAIService()
    return _ai_service

# Made with Bob
