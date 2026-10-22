from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import os

import cv2
import numpy as np

from predict import predict_image




app = FastAPI(
    title="VERIX API",
    description="Visual Authenticity Detection Engine",
    version="1.0.0"
)




app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CASCADE_PATH = os.path.join(
    BASE_DIR,
    "haarcascade_frontalface_default.xml"
)

face_detector = cv2.CascadeClassifier(CASCADE_PATH)

if face_detector.empty():
    print("WARNING: Haar Cascade could not be loaded.")
else:
    print("VERIX FACE DETECTOR LOADED")




@app.get("/")
def home():

    return {
        "project": "VERIX",
        "status": "online",
        "message": "VERIX AI engine is ready"
    }




@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }




@app.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...)
):



    image_data = await file.read()

    if not image_data:

        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty."
        )




    try:

        image = Image.open(
            io.BytesIO(image_data)
        ).convert("RGB")

    except Exception:

        raise HTTPException(
            status_code=400,
            detail="Invalid image file."
        )




    original_width, original_height = image.size


   

    result = predict_image(image)


   
    return {

        "filename": file.filename,

        "image_type": file.content_type,


        "width": int(original_width),

        "height": int(original_height),

        "original_width": int(original_width),

        "original_height": int(original_height),


        "model_input_width": 224,

        "model_input_height": 224,

        "model_input_resolution": "224 × 224",


        "prediction": result["prediction"],

        "confidence": result["confidence"],

        "probabilities": result["probabilities"],

        "status": "success",

        "message":
            "Image successfully analyzed by VERIX AI"

    }




@app.post("/analyze-live")
async def analyze_live_camera(
    file: UploadFile = File(...)
):



    image_data = await file.read()

    if not image_data:

        raise HTTPException(
            status_code=400,
            detail="Camera frame is empty."
        )



    image_array = np.frombuffer(
        image_data,
        dtype=np.uint8
    )

    frame = cv2.imdecode(
        image_array,
        cv2.IMREAD_COLOR
    )

    if frame is None:

        raise HTTPException(
            status_code=400,
            detail="Unable to read camera frame."
        )


    
    frame_height, frame_width = frame.shape[:2]




    gray = cv2.cvtColor(
        frame,
        cv2.COLOR_BGR2GRAY
    )

    faces = face_detector.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(80, 80)
    )




    if len(faces) == 0:

        return {

            "status": "no_face",

            "face_detected": False,

            "prediction": None,

            "confidence": 0,

            "probabilities": {
                "fake": 0,
                "real": 0
            },

            "width": int(frame_width),

            "height": int(frame_height),

            "model_input_width": 224,

            "model_input_height": 224,

            "message":
                "No face detected. Please position your face inside the frame."
        }




    largest_face = max(
        faces,
        key=lambda face: face[2] * face[3]
    )

    x, y, w, h = largest_face




    margin = 0.25

    x1 = max(
        0,
        int(x - w * margin)
    )

    y1 = max(
        0,
        int(y - h * margin)
    )

    x2 = min(
        frame_width,
        int(x + w * (1 + margin))
    )

    y2 = min(
        frame_height,
        int(y + h * (1 + margin))
    )




    face_crop = frame[
        y1:y2,
        x1:x2
    ]

    if face_crop.size == 0:

        raise HTTPException(
            status_code=400,
            detail="Face crop failed."
        )




    face_rgb = cv2.cvtColor(
        face_crop,
        cv2.COLOR_BGR2RGB
    )

    face_image = Image.fromarray(
        face_rgb
    ).convert("RGB")


    

    result = predict_image(
        face_image
    )


   


    return {

        "status": "success",

        "face_detected": True,

        "prediction":
            result["prediction"],

        "confidence":
            result["confidence"],

        "probabilities":
            result["probabilities"],

        "face_box": {

            "x": int(x1),

            "y": int(y1),

            "width": int(x2 - x1),

            "height": int(y2 - y1)

        },


        "width": int(frame_width),

        "height": int(frame_height),


        "model_input_width": 224,

        "model_input_height": 224,

        "model_input_resolution": "224 × 224",

        "message":
            "Face detected and analyzed by VERIX AI"
    }