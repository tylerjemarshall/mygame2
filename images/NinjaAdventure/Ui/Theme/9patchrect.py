from PIL import Image

def create_9patch_image(src_path, dst_path, width, height):
    # Load the source image
    src_image = Image.open(src_path)
    src_width, src_height = src_image.size

    # Define the sizes of the 9 sections
    corner_size = 47  # Adjust this to match the size of the corners in your 9-patch image

    # Calculate coordinates of each section
    sections = {
        'top_left': (0, 0, corner_size, corner_size),
        'top_edge': (corner_size, 0, src_width - corner_size, corner_size),
        'top_right': (src_width - corner_size, 0, src_width, corner_size),
        'left_edge': (0, corner_size, corner_size, src_height - corner_size),
        'center': (corner_size, corner_size, src_width - corner_size, src_height - corner_size),
        'right_edge': (src_width - corner_size, corner_size, src_width, src_height - corner_size),
        'bottom_left': (0, src_height - corner_size, corner_size, src_height),
        'bottom_edge': (corner_size, src_height - corner_size, src_width - corner_size, src_height),
        'bottom_right': (src_width - corner_size, src_height - corner_size, src_width, src_height)
    }

    # Create a new image with the desired size
    dst_image = Image.new('RGBA', (width, height))

    # Paste the corners
    dst_image.paste(src_image.crop(sections['top_left']), (0, 0))
    dst_image.paste(src_image.crop(sections['top_right']), (width - corner_size, 0))
    dst_image.paste(src_image.crop(sections['bottom_left']), (0, height - corner_size))
    dst_image.paste(src_image.crop(sections['bottom_right']), (width - corner_size, height - corner_size))

    # Paste the edges
    top_edge = src_image.crop(sections['top_edge']).resize((width - 2 * corner_size, corner_size))
    dst_image.paste(top_edge, (corner_size, 0))

    bottom_edge = src_image.crop(sections['bottom_edge']).resize((width - 2 * corner_size, corner_size))
    dst_image.paste(bottom_edge, (corner_size, height - corner_size))

    left_edge = src_image.crop(sections['left_edge']).resize((corner_size, height - 2 * corner_size))
    dst_image.paste(left_edge, (0, corner_size))

    right_edge = src_image.crop(sections['right_edge']).resize((corner_size, height - 2 * corner_size))
    dst_image.paste(right_edge, (width - corner_size, corner_size))

    # Paste the center
    center = src_image.crop(sections['center']).resize((width - 2 * corner_size, height - 2 * corner_size))
    dst_image.paste(center, (corner_size, corner_size))

    # Save the result
    dst_image.save(dst_path)

# Example usage
create_9patch_image('Theme1/pause_menu.png', 'Theme1/pause_menu4.png', 200, 800)
