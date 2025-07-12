import os
from PIL import Image
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

input_folder = os.getenv("INPUT_FOLDER")
output_folder = os.getenv("OUTPUT_FOLDER")
max_width = 1200
max_height = 800

def resize_image(image_path, output_path):
    with Image.open(image_path) as img:
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        img.save(output_path, format="JPEG", quality=85, optimize=True)

def process_images():
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    for filename in os.listdir(input_folder):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            input_path = os.path.join(input_folder, filename)
            output_path = os.path.join(output_folder, filename)

            if not os.path.exists(output_path):
                print(f"Processing: {filename}")
                resize_image(input_path, output_path)
            else:
                print(f"Already exists: {filename}")

if __name__ == "__main__":
    if not input_folder or not output_folder:
        print("Please set INPUT_FOLDER and OUTPUT_FOLDER in the .env file.")
    else:
        process_images()
