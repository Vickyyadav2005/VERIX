import os
import shutil
import random

BASE_DIR = "/Users/vickyyadav/Desktop/VERIX/dataset"

SOURCE_REAL = os.path.join(BASE_DIR, "images", "real")
SOURCE_FAKE = os.path.join(BASE_DIR, "images", "fake")

SPLITS = {
    "train": 0.70,
    "val": 0.15,
    "test": 0.15
}

random.seed(42)


def split_class(source_folder, class_name):
    files = [
        f for f in os.listdir(source_folder)
        if f.lower().endswith((".jpg", ".jpeg", ".png"))
    ]

    random.shuffle(files)

    total = len(files)

    train_end = int(total * 0.70)
    val_end = train_end + int(total * 0.15)

    split_files = {
        "train": files[:train_end],
        "val": files[train_end:val_end],
        "test": files[val_end:]
    }

    for split_name, split_list in split_files.items():

        destination = os.path.join(
            BASE_DIR,
            split_name,
            class_name
        )

        os.makedirs(destination, exist_ok=True)

        for filename in split_list:
            source = os.path.join(source_folder, filename)
            target = os.path.join(destination, filename)

            shutil.copy2(source, target)

        print(
            f"{class_name.upper()} | "
            f"{split_name.upper()} : "
            f"{len(split_list)} images"
        )


print("=" * 60)
print("       VERIX DATASET SPLITTER")
print("=" * 60)

split_class(SOURCE_REAL, "real")
split_class(SOURCE_FAKE, "fake")

print("=" * 60)
print("DATASET SPLIT COMPLETE")
print("=" * 60)
