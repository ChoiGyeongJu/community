import os
import django
import csv
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import *
from board.models import *

CSV_PATH_PRODUCTS = 'CSV_Category.csv'

with open(CSV_PATH_PRODUCTS, 'rt', encoding='UTF8') as in_file:
    data_reader = csv.reader(in_file)
    next(data_reader, None)
    for row in data_reader:
        Category.objects.create(
            name      = row[0],
            is_valid  = row[1],
        )
    print("Upload Category Finish!")
