# VERIX

VERIX is a project that uses AI to check whether a face in an image is real or fake.

I built this project to understand how deep learning and computer vision can be used for detecting AI-generated or manipulated faces. The project has a web interface where a user can upload an image and get a prediction. It also has a live camera option.

## What VERIX can do

- Upload an image and check the face
- Detect whether a face is real or fake
- Show the prediction confidence
- Detect a face using the live camera
- Show a message when no face is found
- Run the trained model through a FastAPI backend
- Use a React frontend for the user interface

## Technologies Used

### Frontend
- React
- Vite
- React Router
- CSS

### Backend
- Python
- FastAPI
- Uvicorn
- OpenCV
- Pillow
- PyTorch
- Torchvision

### Model
The model used in VERIX is MobileNetV3-Small.

The input image is resized to:

`224 × 224`

The model has two classes:

- Real
- Fake

## Model Result

I tested the final model using a video-level split of the dataset.

The test accuracy was:

**75.33%**

The model correctly classified:

**113 out of 150 images**

The confusion matrix was:

```text
[[69,  6],
 [31, 44]]
```

## Dataset

For this project, I used the FaceForensics++ dataset.

During development, I extracted:

- 500 real face images
- 500 fake face images
- 1000 images in total

The dataset is not uploaded to this repository because it takes a lot of space. The extracted dataset is kept locally for training and testing.

## Project Structure

```text
VERIX/
│
├── backend/
│   ├── main.py
│   ├── predict.py
│   ├── train_model.py
│   ├── split_dataset.py
│   ├── create_video_split.py
│   ├── test_model.py
│   ├── verix_model.pth
│   └── haarcascade_frontalface_default.xml
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## How to Run

### Backend

Open the terminal and go to the backend folder:

```bash
cd backend
```

Create and activate the virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the required packages:

```bash
pip install fastapi uvicorn torch torchvision pillow opencv-python python-multipart
```

Start the backend:

```bash
uvicorn main:app --reload
```

The backend will run on:

`http://127.0.0.1:8000`

The API documentation can be opened at:

`http://127.0.0.1:8000/docs`

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will show the local address in the terminal. Open that address in the browser.

## How the System Works

The basic working of VERIX is:

```text
Image / Camera
      ↓
Face Detection
      ↓
Face Crop
      ↓
Resize to 224 × 224
      ↓
MobileNetV3-Small
      ↓
Real or Fake
      ↓
Confidence
      ↓
Result
```

For live detection, the camera frame is first checked for a face. If a face is found, the detected face is sent to the model for prediction.

## Model File

The trained model used by the application is:

```text
backend/verix_model.pth
```

The other model versions that were created during experimentation are not included in the repository.

## Future Work

Some things I would like to improve later are:

- Train the model with more data
- Improve the detection accuracy
- Add video-level deepfake detection
- Improve live camera performance
- Add more types of manipulated faces
- Deploy the project online

## Project Status

This project is currently a working academic project. The image analysis and live camera detection features are implemented and the trained model is connected to the FastAPI backend.