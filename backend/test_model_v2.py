import os
import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader

BASE_DIR = "/Users/vickyyadav/Desktop/VERIX/dataset"
TEST_DIR = os.path.join(BASE_DIR, "test")

IMAGE_SIZE = 224
BATCH_SIZE = 32

if torch.backends.mps.is_available():
    DEVICE = torch.device("mps")
else:
    DEVICE = torch.device("cpu")

print("=" * 60)
print("             VERIX MODEL TEST")
print("=" * 60)
print("Device:", DEVICE)

transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

test_dataset = datasets.ImageFolder(
    TEST_DIR,
    transform=transform
)

test_loader = DataLoader(
    test_dataset,
    batch_size=BATCH_SIZE,
    shuffle=False,
    num_workers=0
)

print("Classes:", test_dataset.classes)
print("Test images:", len(test_dataset))

# Load same model architecture
model = models.mobilenet_v3_small(weights=None)

model.classifier[3] = nn.Linear(
    model.classifier[3].in_features,
    2
)

checkpoint = torch.load(
    "verix_model_v2.pth",
    map_location=DEVICE,
    weights_only=False
)

model.load_state_dict(
    checkpoint["model_state_dict"]
)

model = model.to(DEVICE)
model.eval()

correct = 0
total = 0

real_correct = 0
real_total = 0

fake_correct = 0
fake_total = 0

with torch.no_grad():

    for images, labels in test_loader:

        images = images.to(DEVICE)
        labels = labels.to(DEVICE)

        outputs = model(images)

        _, predicted = torch.max(outputs, 1)

        total += labels.size(0)
        correct += (predicted == labels).sum().item()

        for label, prediction in zip(labels, predicted):

            if label.item() == 0:
                real_total += 1
                if prediction.item() == 0:
                    real_correct += 1

            else:
                fake_total += 1
                if prediction.item() == 1:
                    fake_correct += 1

accuracy = 100 * correct / total

real_accuracy = (
    100 * real_correct / real_total
    if real_total > 0 else 0
)

fake_accuracy = (
    100 * fake_correct / fake_total
    if fake_total > 0 else 0
)

print()
print("=" * 60)
print("              TEST RESULTS")
print("=" * 60)
print(f"Overall Accuracy : {accuracy:.2f}%")
print(f"REAL Accuracy    : {real_accuracy:.2f}%")
print(f"FAKE Accuracy    : {fake_accuracy:.2f}%")
print(f"Correct          : {correct}/{total}")
print("=" * 60)
