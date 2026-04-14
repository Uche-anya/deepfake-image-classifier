from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io

app = FastAPI(title="CIFAKE Deepfake Detector API")

#  CORS Middleware: Allows the React frontend to communicate with this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DeepfakeDetectorResNet(nn.Module):
    def __init__(self):
        super(DeepfakeDetectorResNet, self).__init__()
        # Load the base model without pretrained weights (we will load your custom weights)
        self.base_model = models.resnet50(weights=None)
        
        # Recreate the exact custom fully connected layer with Dropout
        num_ftrs = self.base_model.fc.in_features
        self.base_model.fc = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(num_ftrs, 2)
        )

    def forward(self, x):
        return self.base_model(x)

device = torch.device("cpu") # Force CPU for lightweight inference
model = DeepfakeDetectorResNet().to(device)

# 2. Load Your Custom Trained Weights
try:
    model.load_state_dict(torch.load('best_resnet_image_classifier.pth', map_location=device))
    model.eval() # CRITICAL: Sets Dropout layers to evaluation mode
    print(" PyTorch Model loaded successfully!")
except Exception as e:
    print(f"Failed to load model weights: {e}")

# 3. Production Transforms (Strictly Standardizing, NO Random Flips)
transform = transforms.Compose([
    transforms.Resize((32, 32)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

@app.get("/")
def home():
    return {"message": "CIFAKE API is running!"}

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    # Security check: Ensure the uploaded file is actually an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        # Read the image bytes into a PIL Image
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Apply the exact evaluation transforms from your notebook
        input_tensor = transform(image).unsqueeze(0).to(device)

        # Run inference without tracking gradients (saves memory & time)
        with torch.no_grad():
            outputs = model(input_tensor)
            
            # Apply Softmax to convert raw logits into percentages
            probabilities = torch.nn.functional.softmax(outputs, dim=1)
            confidence, predicted_class = torch.max(probabilities, 1)

        # Map the tensor index to your string labels
        class_names = ["FAKE", "REAL"]
        prediction_label = class_names[predicted_class.item()]
        
        # Format the confidence as a clean percentage string
        confidence_pct = f"{confidence.item() * 100:.2f}%"

        return {
            "filename": file.filename,
            "prediction": prediction_label,
            "confidence": confidence_pct
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    # Start the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)