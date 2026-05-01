"""
IBM watsonx.ai Integration Service
Handles all AI model interactions for classification, generation, and improvement
"""

import os
import json
import logging
from ibm_watsonx_ai.foundation_models import Model
from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
from django.conf import settings

logger = logging.getLogger(__name__)


class WatsonXAIService:
    """
    Service class for interacting with IBM watsonx.ai
    """
    
    def __init__(self):
        """Initialize the watsonx.ai model"""
        self.api_key = settings.WATSONX_API_KEY
        self.project_id = settings.WATSONX_PROJECT_ID
        self.url = settings.WATSONX_URL
        self.model_id = settings.WATSONX_MODEL_ID
        
        if not self.api_key or not self.project_id:
            raise ValueError("WATSONX_API_KEY and WATSONX_PROJECT_ID must be set in environment variables")
        
        # Model parameters for text generation
        self.parameters = {
            GenParams.DECODING_METHOD: "greedy",
            GenParams.MAX_NEW_TOKENS: 500,
            GenParams.MIN_NEW_TOKENS: 50,
            GenParams.TEMPERATURE: 0.7,
            GenParams.TOP_K: 50,
            GenParams.TOP_P: 1
        }
        
        # Initialize the model
        try:
            self.model = Model(
                model_id=self.model_id,
                params=self.parameters,
                credentials={
                    "apikey": self.api_key,
                    "url": self.url
                },
                project_id=self.project_id
            )
            logger.info(f"Successfully initialized watsonx.ai model: {self.model_id}")
        except Exception as e:
            logger.error(f"Failed to initialize watsonx.ai model: {str(e)}")
            raise
    
    def generate_text(self, prompt, max_tokens=500):
        """
        Generate text using the watsonx.ai model
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            
        Returns:
            str: Generated text
        """
        try:
            # Update max tokens if different from default
            if max_tokens != 500:
                params = self.parameters.copy()
                params[GenParams.MAX_NEW_TOKENS] = max_tokens
                
                # Create temporary model with updated params
                temp_model = Model(
                    model_id=self.model_id,
                    params=params,
                    credentials={
                        "apikey": self.api_key,
                        "url": self.url
                    },
                    project_id=self.project_id
                )
                response = temp_model.generate_text(prompt=prompt)
            else:
                response = self.model.generate_text(prompt=prompt)
            
            logger.info("Successfully generated text from watsonx.ai")
            return response.strip()
            
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
            response_text = self.generate_text(prompt, max_tokens=300)
            
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
            complaint = self.generate_text(prompt, max_tokens=600)
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
            improved_complaint = self.generate_text(prompt, max_tokens=700)
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
        _ai_service = WatsonXAIService()
    return _ai_service

# Made with Bob
