import os
import torch
from torchvision import models, transforms
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "verix_model.pth")

DEVICE = torch.device("mps" if torch.backends.mps.is_available() else "cpu")

classes = ["fake", "real"]

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# Create the same model architecture used during training
model = models.mobilenet_v3_small(weights=None)

model.classifier[3] = torch.nn.Linear(
    model.classifier[3].in_features,
    2
)

# Load checkpoint
checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

# Extract the actual model weights
model.load_state_dict(checkpoint["model_state_dict"])

model = model.to(DEVICE)
model.eval()


def predict_image(image: Image.Image):

    image = image.convert("RGB")

    tensor = transform(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        output = model(tensor)
        probabilities = torch.softmax(output, dim=1)[0]

    fake_probability = probabilities[0].item()
    real_probability = probabilities[1].item()

    predicted_index = torch.argmax(probabilities).item()

    prediction = classes[predicted_index]

    confidence = probabilities[predicted_index].item() * 100

    return {
        "prediction": prediction.upper(),
        "confidence": round(confidence, 2),
        "probabilities": {
            "fake": round(fake_probability * 100, 2),
            "real": round(real_probability * 100, 2)
        }
    }


print("VERIX AI MODEL LOADED")
print("Device:", DEVICE)
print("Classes:", classes)
