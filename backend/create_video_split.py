import os
import shutil
import random
from collections import defaultdict

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, "..", "dataset")

SOURCE_DIR = os.path.join(DATASET_DIR, "images")

SPLIT_DIRS = {
    "train": os.path.join(DATASET_DIR, "video_split", "train"),
    "val": os.path.join(DATASET_DIR, "video_split", "val"),
    "test": os.path.join(DATASET_DIR, "video_split", "test"),
}

random.seed(42)


def get_video_id(filename):
    """
    Example:
    real_0053_04.jpg -> real_0053
    fake_0050_00.jpg -> fake_0050
    """

    name = os.path.splitext(filename)[0]
    parts = name.split("_")

    return "_".join(parts[:2])


def collect_images(class_name):
    folder = os.path.join(SOURCE_DIR, class_name)

    videos = defaultdict(list)

    for filename in os.listdir(folder):

        if not filename.lower().endswith((".jpg", ".jpeg", ".png")):
            continue

        video_id = get_video_id(filename)

        videos[video_id].append(
            os.path.join(folder, filename)
        )

    return videos


def split_video_ids(video_ids):
    video_ids = list(video_ids)

    random.shuffle(video_ids)

    total = len(video_ids)

    train_count = int(total * 0.70)
    val_count = int(total * 0.15)

    train_ids = video_ids[:train_count]

    val_ids = video_ids[
        train_count:train_count + val_count
    ]

    test_ids = video_ids[
        train_count + val_count:
    ]

    return {
        "train": train_ids,
        "val": val_ids,
        "test": test_ids
    }


def copy_files(videos, splits, class_name):

    for split_name, video_ids in splits.items():

        destination = os.path.join(
            SPLIT_DIRS[split_name],
            class_name
        )

        os.makedirs(destination, exist_ok=True)

        for video_id in video_ids:

            for source_file in videos[video_id]:

                filename = os.path.basename(source_file)

                destination_file = os.path.join(
                    destination,
                    filename
                )

                shutil.copy2(
                    source_file,
                    destination_file
                )


def main():

    print("\n==============================")
    print("VERIX VIDEO-LEVEL DATA SPLIT")
    print("==============================\n")

    for class_name in ["real", "fake"]:

        videos = collect_images(class_name)

        print(
            f"{class_name.upper()} videos found: "
            f"{len(videos)}"
        )

        splits = split_video_ids(videos.keys())

        print(
            f"  Train videos: {len(splits['train'])}"
        )

        print(
            f"  Validation videos: {len(splits['val'])}"
        )

        print(
            f"  Test videos: {len(splits['test'])}"
        )

        copy_files(
            videos,
            splits,
            class_name
        )

        print()


if __name__ == "__main__":
    main()