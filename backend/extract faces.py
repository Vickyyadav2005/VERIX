import cv2
import os

BASE_DIR = "/Users/vickyyadav/Desktop/VERIX/dataset"

REAL_VIDEOS = os.path.join(BASE_DIR, "original_sequences/youtube/c23/videos")
FAKE_VIDEOS = os.path.join(BASE_DIR, "manipulated_sequences/Deepfakes/c23/videos")

REAL_OUTPUT = os.path.join(BASE_DIR, "images/real")
FAKE_OUTPUT = os.path.join(BASE_DIR, "images/fake")

os.makedirs(REAL_OUTPUT, exist_ok=True)
os.makedirs(FAKE_OUTPUT, exist_ok=True)

CASCADE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "haarcascade_frontalface_default.xml")
face_detector = cv2.CascadeClassifier(CASCADE)

FRAME_STEP = 30
MAX_IMAGES_PER_VIDEO = 5


def extract_from_videos(video_folder, output_folder, label):
    if not os.path.exists(video_folder):
        print("ERROR: Folder not found:")
        print(video_folder)
        return 0

    videos = sorted([
        f for f in os.listdir(video_folder)
        if f.lower().endswith((".mp4", ".avi", ".mov", ".mkv"))
    ])

    print()
    print("=" * 60)
    print(f"PROCESSING {label.upper()} VIDEOS")
    print(f"Videos found: {len(videos)}")
    print("=" * 60)

    total_faces = 0

    for video_index, video_name in enumerate(videos, start=1):
        video_path = os.path.join(video_folder, video_name)
        cap = cv2.VideoCapture(video_path)

        if not cap.isOpened():
            print(f"[{video_index}/{len(videos)}] Could not open: {video_name}")
            continue

        frame_number = 0
        saved_for_video = 0

        while True:
            ret, frame = cap.read()

            if not ret:
                break

            if frame_number % FRAME_STEP == 0:
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                faces = face_detector.detectMultiScale(
                    gray,
                    scaleFactor=1.1,
                    minNeighbors=5,
                    minSize=(80, 80)
                )

                if len(faces) > 0:
                    x, y, w, h = max(
                        faces,
                        key=lambda rect: rect[2] * rect[3]
                    )

                    face_img = frame[y:y+h, x:x+w]

                    if face_img.size > 0:
                        face_img = cv2.resize(face_img, (224, 224))

                        filename = (
                            f"{label.lower()}_{video_index:04d}_"
                            f"{saved_for_video:02d}.jpg"
                        )

                        output_path = os.path.join(
                            output_folder,
                            filename
                        )

                        cv2.imwrite(output_path, face_img)

                        saved_for_video += 1
                        total_faces += 1

                if saved_for_video >= MAX_IMAGES_PER_VIDEO:
                    break

            frame_number += 1

        cap.release()

        print(
            f"[{video_index}/{len(videos)}] "
            f"{video_name} -> {saved_for_video} face images"
        )

    return total_faces


print()
print("=" * 60)
print("        VERIX FACE EXTRACTION ENGINE")
print("=" * 60)

real_count = extract_from_videos(
    REAL_VIDEOS,
    REAL_OUTPUT,
    "REAL"
)

fake_count = extract_from_videos(
    FAKE_VIDEOS,
    FAKE_OUTPUT,
    "FAKE"
)

print()
print("=" * 60)
print("          EXTRACTION COMPLETE")
print("=" * 60)
print(f"REAL face images : {real_count}")
print(f"FAKE face images : {fake_count}")
print(f"TOTAL images     : {real_count + fake_count}")
print("=" * 60)
