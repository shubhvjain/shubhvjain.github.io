import os

# Load from .env
from dotenv import load_dotenv
load_dotenv()

folder_path = os.getenv("INPUT_FOLDER")  # Same folder you use for input

def rename_images_to_imgN(folder):
    if not os.path.exists(folder):
        print(f"Folder does not exist: {folder}")
        return

    image_files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
    image_files.sort()  # Optional: sort alphabetically or by current filename

    for index, filename in enumerate(image_files, start=1):
        ext = os.path.splitext(filename)[1].lower()
        new_name = f"img{index}{ext}"
        src = os.path.join(folder, filename)
        dst = os.path.join(folder, new_name)

        # Avoid overwriting existing files
        if os.path.exists(dst):
            print(f"Skipping (already exists): {new_name}")
            continue

        os.rename(src, dst)
        print(f"Renamed: {filename} → {new_name}")

if __name__ == "__main__":
    rename_images_to_imgN(folder_path)
