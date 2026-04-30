# 👁️ Deepfake Image Detector

A full-stack AI web application that classifies images as **REAL** or **FAKE** using a custom-trained PyTorch **ResNet-50** model.

The project combines a lightweight **FastAPI backend** for model inference with a modern **React + TypeScript frontend** for image upload and prediction display. It was built as an academic proof-of-concept to demonstrate deep learning, model deployment, API design, and full-stack AI integration.

---

## Live Demo

- **Frontend:** https://deepfake-image-classifier.vercel.app
- **Backend API:** https://cifakekingsley-cifake-deepfake.hf.space/


---

## Project Overview

This application allows a user to upload an image through a web interface. The image is sent to a FastAPI backend, where it is preprocessed and passed through a trained ResNet-50 model. The API then returns a prediction showing whether the image is likely to be **REAL** or **FAKE**, along with a confidence score.

```text
User uploads image
        ↓
React frontend sends image to FastAPI
        ↓
FastAPI preprocesses the image
        ↓
PyTorch ResNet-50 model performs inference
        ↓
Prediction is returned to the frontend
```

---

## Disclaimer and Dataset Limitations

This project is an **academic proof-of-concept** and should not be treated as a production-grade deepfake detection system.

The model was trained using the **CIFAKE dataset**, which contains:

- 60,000 real images from CIFAR-10
- 60,000 AI-generated synthetic images
- 32x32 pixel image resolution

Because the model was trained on low-resolution CIFAKE images, it is mainly learning patterns linked to that dataset  and the pre-trained Imagenet features and its generation process. It may not generalise well to modern high-resolution AI images from tools such as Midjourney, DALL·E, Stable Diffusion, or other newer generative models.

This means the system is useful for demonstrating deep learning and deployment, but it should not be used as a reliable generalized tool.

---

### Backend

The backend is responsible for loading the trained PyTorch model and handling image classification requests.

**Technologies used:**

- Python
- FastAPI
- PyTorch
- Torchvision
- Pillow
- Uvicorn
- Docker
- Hugging Face Spaces

**Main responsibilities:**

- Accept uploaded image files
- Validate image input
- Resize and normalise images
- Run model inference
- Return prediction and confidence score as JSON

---

### Frontend

The frontend provides the user interface for uploading images and viewing predictions.

**Technologies used:**

- React
- TypeScript
- Vite
- CSS
- Vercel

**Main responsibilities:**

- Allow users to upload an image
- Send the image to the backend API
- Display loading, success, and error states
- Show the predicted class and confidence score

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Model Training | PyTorch, Torchvision |
| Model Architecture | ResNet-50 |
| Backend API | FastAPI |
| Backend Server | Uvicorn |
| Image Processing | Pillow |
| Frontend | React, TypeScript, Vite |
| Backend Hosting | Hugging Face Spaces |
| Frontend Hosting | Vercel |
| Deployment | Docker, GitHub |

---

##  Model Details

The model is based on **ResNet-50**, a convolutional neural network commonly used for image classification tasks.

### Model design

- Base architecture: ResNet-50
- Pretrained weights: ImageNet
- Final classification layer replaced for binary classification
- Output classes: `REAL` and `FAKE`
- Dropout added to reduce overfitting

Example final layer:

```python
model.fc = nn.Sequential(
    nn.Dropout(p=0.4),
    nn.Linear(num_features, 2)
)
```

### Image preprocessing

Before prediction, each uploaded image is:

1. Converted to RGB
2. Resized to 32x32 pixels
3. Converted into a tensor
4. Normalised using ImageNet statistics

```python
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
```

This keeps the inference preprocessing consistent with the training pipeline.

---

##  API Documentation

### `GET /`

Health check endpoint.

**Response:**

```json
{
  "message": "Deepfake Image Detector API is running"
}
```

---

### `POST /predict`

Classifies an uploaded image as `REAL` or `FAKE`.

**Request type:**

```text
multipart/form-data
```

**Form field:**

```text
file
```

**Accepted formats:**

```text
.jpg, .jpeg, .png
```

**Example response:**

```json
{
  "filename": "sample_image.jpg",
  "prediction": "FAKE",
  "confidence": "98.45%"
}
```

---

##  Local Installation

To run the project locally, you need two terminal windows:

1. One for the FastAPI backend
2. One for the React frontend

---

## 1. Run the Backend

Navigate to the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
```

On macOS/Linux:

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000
```

The backend will run at:

```text
http://127.0.0.1:8000
```

You can also open the automatic FastAPI documentation at:

```text
http://127.0.0.1:8000/docs
```

---

## 2. Run the Frontend

Open a second terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install the Node dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## 🔗 Connecting Frontend to Backend

During local development, the frontend should point to:

```text
http://127.0.0.1:8000
```

In production, replace the local backend URL with your Hugging Face Spaces backend URL.

Example:

```ts
const API_URL = "https://your-username-cifake-api.hf.space";
```

---

##  Deployment

### Backend Deployment: Hugging Face Spaces

The backend is deployed using a Docker-based Hugging Face Space.

The Dockerfile starts from a lightweight Python image, installs the required dependencies, copies the backend files, and runs the FastAPI app using Uvicorn on port `7860`.

Example command used inside the Docker container:

```bash
uvicorn app:app --host 0.0.0.0 --port 7860
```

Hugging Face Spaces is suitable for this project because it provides enough free CPU memory to load and run the model for lightweight inference.

---

### Frontend Deployment: Vercel

The React frontend is deployed on Vercel.

Deployment flow:

```text
Push frontend code to GitHub
        ↓
Import repository into Vercel
        ↓
Set production API URL
        ↓
Deploy frontend
```

Vercel automatically builds the React application and provides a public URL for users to access the interface.

---

##  CORS Configuration

Because the frontend and backend are hosted on different platforms, the FastAPI backend needs CORS middleware.

Example:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-vercel-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For development, you can temporarily allow all origins:

```python
allow_origins=["*"]
```

For the final deployed version, it is better to restrict access to your actual Vercel frontend URL.

---

##  Example `requirements.txt`

```txt
fastapi
uvicorn
python-multipart
pillow
numpy<2.0.0
torch
torchvision
```

The `numpy<2.0.0` constraint is included to avoid compatibility issues with some PyTorch and tensor conversion setups.

---

##  Example Prediction Flow

1. User uploads an image
2. Frontend sends the image as form data
3. Backend receives the file
4. Image is converted to RGB
5. Image is resized and normalised
6. Model predicts `REAL` or `FAKE`
7. API returns the result
8. Frontend displays the prediction and confidence score

---

## ⚙️ Key Features

- Full-stack AI application
- Custom-trained ResNet-50 model
- Real-time image classification
- FastAPI inference backend
- React and TypeScript frontend
- Dockerized backend deployment
- Public frontend and backend hosting
- Academic explanation of dataset limitations
- Clean separation between frontend and backend

---

## Known Limitations

- The model is trained on 32x32 CIFAKE images
- It may not perform well on high-resolution modern AI/Synthetic images
- Free hosting may introduce cold-start delays
- CPU inference is slower than GPU inference

---


---

## Dataset

The model was trained using the [CIFAKE: Real and AI-Generated Synthetic Images dataset](https://www.kaggle.com/datasets/birdy654/cifake-real-and-ai-generated-synthetic-images), which contains 120,000 images: 60,000 real images collected from CIFAR-10 and 60,000 AI-generated synthetic images.

---

## 📄 Academic Note

This project was developed as part of an academic deep learning and deployment exercise. The main aim was to demonstrate the complete machine learning workflow:

```text
Dataset preparation
        ↓
Model training
        ↓
Model evaluation
        ↓
API development
        ↓
Frontend integration
        ↓
Cloud deployment
```

It is intended for learning, experimentation, and portfolio demonstration.

---

## Final Status

- Model trained
- Backend API implemented
- Frontend interface implemented
- Local testing completed
- Backend deployment prepared for Hugging Face Spaces
- Frontend deployment prepared for Vercel

```

Built as a full-stack AI project for deepfake image classification.
```
