import os
import django
import csv
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import *
from board.models import *

CSV_PATH_PRODUCTS = 'CSV_SocialPlatform.csv'

with open(CSV_PATH_PRODUCTS, 'rt', encoding='UTF8') as in_file:
    data_reader = csv.reader(in_file)
    next(data_reader, None)
    for row in data_reader:
        SocialPlatform.objects.create(
            platform = row[0]
        )
    print("Upload SocialPlatform Finish!")
