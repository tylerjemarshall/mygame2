from PIL import Image

def resize_image(input_path, output_path, new_width, new_height):
    # Open the input image
    img = Image.open(input_path)
    
    # Resize the image using the nearest neighbor algorithm
    resized_img = img.resize((new_width, new_height), Image.NEAREST)
    
    # Save the resized image
    resized_img.save(output_path)
    print(f"Image saved to {output_path}")

# Example usage
input_image_path = 'tileGrass2.png'
output_image_path = 'tileGrass4.png'
new_width = 576*2
new_height = 576*2

resize_image(input_image_path, output_image_path, new_width, new_height)
