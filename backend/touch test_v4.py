import os
import torch
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
from sklearn.metrics import classification_report, confusion_matrix


# ==========================================
# PATHS
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TEST_DIR = os.path.join(
    BASE_DIR,
    "..",
    "dataset",
    "video_split",
    "test"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "verix_model_v4.pth"
)


# ==========================================
# DEVICE
# ==========================================

DEVICE = torch.device(
    "mps" if torch.backends.mps.is_available() else "cpu"
)

print("Device:", DEVICE)


# ==========================================
# IMAGE TRANSFORMATION
# ==========================================

transform = transforms.Compose([
    transforms.Resize((224, 224)),

    transforms.ToTensor(),

    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==========================================
# TEST DATASET
# ==========================================

test_dataset = datasets.ImageFolder(
    TEST_DIR,
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=32,
    shuffle=False,
    num_workers=0
)

print("Classes:", test_dataset.classes)
print("Test images:", len(test_dataset))


# ==========================================
# LOAD MOBILENET V3
# ==========================================

model = models.mobilenet_v3_small(
    weights=None
)

model.classifier[3] = torch.nn.Linear(
    model.classifier[3].in_features,
    2
)


# ==========================================
# LOAD V4 MODEL
# ==========================================

checkpoint = torch.load(
    MODEL_PATH,
    map_location=DEVICE,
    weights_only=False
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)

model.eval()


# ==========================================
# TEST MODEL
# ==========================================

all_predictions = []
all_labels = []

correct = 0
total = 0


with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        outputs = model(images)

        _, predicted = torch.max(
            outputs,
            1
        )

        total += labels.size(0)

        correct += (
            predicted == labels
        ).sum().item()

        all_predictions.extend(
            predicted.cpu().numpy()
        )

        all_labels.extend(
            labels.cpu().numpy()
        )


# ==========================================
# ACCURACY
# ==========================================

accuracy = 100 * correct / total


# ==========================================
# RESULTS
# ==========================================

print("\n==============================")
print("VERIX V4 TEST RESULTS")
print("==============================")

print(
    f"Overall Accuracy : {accuracy:.2f}%"
)

print(
    f"Correct          : {correct}/{total}"
)


# ==========================================
# CLASSIFICATION REPORT
# ==========================================

print("\nCLASSIFICATION REPORT")

print(
    classification_report(
        all_labels,
        all_predictions,
        target_names=test_dataset.classes,
        digits=4
    )
)


# ==========================================
# CONFUSION MATRIX
# ==========================================

print("CONFUSION MATRIX")

print(
    confusion_matrix(
        all_labels,
        all_predictions
    )
)


# ==========================================
# FINAL MESSAGE
# ==========================================

print("\n==============================")
print("V4 TEST COMPLETE")
print("==============================")

print(
    f"Final Test Accuracy: {accuracy:.2f}%"
)

print(
    f"Correct Predictions: {correct}/{total}"
)