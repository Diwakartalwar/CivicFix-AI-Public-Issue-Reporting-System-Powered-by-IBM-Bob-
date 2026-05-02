"""
IBM watsonx.ai Integration Service
Handles all AI model interactions for classification, generation, and improvement
"""

import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class WatsonxService:
    """
    Service class for interacting with IBM watsonx.ai
    """
    
    def __init__(self):
        """Initialize the watsonx.ai model client"""
        self.api_key = settings.WATSONX_API_KEY
        self.project_id = settings.WATSONX_PROJECT_ID
        self.space_id = settings.WATSONX_SPACE_ID
        self.url = settings.WATSONX_URL
        self.model_id = settings.WATSONX_MODEL_ID
        
        if not self.api_key:
            raise ValueError("WATSONX_API_KEY must be set in environment variables")
        if not self.project_id and not self.space_id:
            raise ValueError("WATSONX_PROJECT_ID or WATSONX_SPACE_ID must be set in environment variables")
        
        # Import lazily so Django checks can still run before dependencies are installed.
        try:
            from ibm_watsonx_ai import Credentials
            from ibm_watsonx_ai.foundation_models import ModelInference
            from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams

            self._gen_params = GenParams
            credentials = Credentials(api_key=self.api_key, url=self.url)
            model_kwargs = {
                "model_id": self.model_id,
                "credentials": credentials,
            }

            if self.project_id:
                model_kwargs["project_id"] = self.project_id
            else:
                model_kwargs["space_id"] = self.space_id

            self.model = ModelInference(**model_kwargs)
            logger.info(f"Successfully initialized watsonx.ai with model: {self.model_id}")
        except Exception as e:
            logger.error(f"Failed to initialize watsonx.ai: {str(e)}")
            raise
    
    def generate_text(self, prompt, max_tokens=500, temperature=0.7):
        """
        Generate text using IBM watsonx.ai
        
        Args:
            prompt (str): The input prompt
            max_tokens (int): Maximum number of tokens to generate
            temperature (float): Sampling temperature (0-2)
            
        Returns:
            str: Generated text
        """
        try:
            params = {
                self._gen_params.MAX_NEW_TOKENS: max_tokens,
                self._gen_params.TEMPERATURE: temperature,
            }

            generated_text = self.model.generate_text(
                prompt=prompt,
                params=params
            ).strip()
            logger.info("Successfully generated text from watsonx.ai")
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
        _ai_service = WatsonxService()
    return _ai_service

# Made with Bob
