import os
from PIL import Image
from dotenv import load_dotenv

# Load env
load_dotenv()
input_folder = os.getenv("INPUT_FOLDER")
output_folder = os.getenv("OUTPUT_FOLDER")
image_prefix = os.getenv("IMAGE_PREFIX", "img")
max_width = 1200
max_height = 800

# Safe resampling method (for Pillow >= 10)
try:
    resample = Image.Resampling.LANCZOS
except AttributeError:
    resample = Image.LANCZOS

def get_next_image_number():
    """Find the next available number for the image prefix in the output folder"""
    existing = [
        f for f in os.listdir(output_folder)
        if f.startswith(image_prefix)
    ]
    nums = []
    for f in existing:
        name, _ = os.path.splitext(f)
        num_part = name.replace(image_prefix, '')
        if num_part.isdigit():
            nums.append(int(num_part))
    return max(nums, default=0) + 1

def resize_image(image_path, output_path):
    with Image.open(image_path) as img:
        img.thumbnail((max_width, max_height), resample)
        img.save(output_path, format="JPEG", quality=85, optimize=True)

def process_images():
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    next_img_num = get_next_image_number()

    for filename in os.listdir(input_folder):
        if filename.lower().startswith("copied_"):
            continue  # Skip already processed originals

        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            input_path = os.path.join(input_folder, filename)

            # Generate new name using prefix
            ext = os.path.splitext(filename)[1].lower()
            new_filename = f"{image_prefix}{next_img_num}{ext}"
            output_path = os.path.join(output_folder, new_filename)

            print(f"Processing: {filename} → {new_filename}")
            resize_image(input_path, output_path)

            # Rename original
            copied_name = "copied_" + filename
            os.rename(input_path, os.path.join(input_folder, copied_name))

            next_img_num += 1

if __name__ == "__main__":
    if not input_folder or not output_folder:
        print("Please set INPUT_FOLDER and OUTPUT_FOLDER in the .env file.")
    else:
        process_images()
