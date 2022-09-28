import os
import django
import csv
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import *

CSV_PATH_PRODUCTS = 'CSV_User.csv'

with open(CSV_PATH_PRODUCTS, 'rt', encoding='UTF8') as in_file:
    data_reader = csv.reader(in_file)
    next(data_reader, None)
    for row in data_reader:
        User.objects.create(
            nickname           = row[0],
            is_valid           = row[1],
        )
    print("Upload User Finish!")
