from PIL import Image

# Load the sprite sheet
sprite_sheet = Image.open("SpriteSheet.png")

# Define the frame size (16x16 as per your description)
frame_width, frame_height = 16, 16

# Calculate number of columns and rows in the sprite sheet
columns = sprite_sheet.width // frame_width
rows = sprite_sheet.height // frame_height

# Create a new blank image to store the rearranged sprites
reordered_sprite_sheet = Image.new("RGBA", (sprite_sheet.width, sprite_sheet.height))

# Extract the sprites from the sprite sheet
frames = [sprite_sheet.crop((x * frame_width, y * frame_height, (x + 1) * frame_width, (y + 1) * frame_height))
          for y in range(rows) for x in range(columns)]

# Define the new order (up, down, left, right)
# Current order is down (0), left (1), up (2), right (3)
# The new order is up (2), down (0), left (1), right (3)
new_order = [0, 2, 1, 3]

# Rearrange the frames into rows according to the new order
for y in range(rows):
    for x in range(columns):
        reordered_sprite_sheet.paste(frames[new_order[x] * rows + y], (x * frame_width, y * frame_height))

# Save the reordered sprite sheet
reordered_sprite_sheet.save("ReorderedSpriteSheet.png")
