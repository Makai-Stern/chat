import PIL
from PIL import Image


def resize_img(image, width):
    img = Image.open(image)
    
    current_width, current_height = img.size

    if current_width > width:
        wpercent = width / float(img.size[0])
        hsize = int((float(img.size[1]) * float(wpercent)))
        img = img.resize((width, hsize), PIL.Image.ANTIALIAS)
        img.save(image)
