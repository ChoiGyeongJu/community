import os
import django
import csv
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import *
from board.models import *

CSV_PATH_PRODUCTS = 'CSV_Board.csv'

with open(CSV_PATH_PRODUCTS, 'rt', encoding='UTF8') as in_file:
    data_reader = csv.reader(in_file)
    next(data_reader, None)
    for row in data_reader:
        category = Category.objects.get(id=row[3])
        user     = User.objects.get(id=row[1])
        Board.objects.create(
            title      = row[0],
            content    = row[2],
            views      = row[4],
            category   = category,
            user       = user,
            created_at = row[5],
        )
    print("Upload Board Finish!")
