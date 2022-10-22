import os
import django
import csv
import sys

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from user.models import *
from board.models import *

CSV_PATH_PRODUCTS = 'CSV_Review.csv'

with open(CSV_PATH_PRODUCTS, 'rt', encoding='UTF8') as in_file:
    data_reader = csv.reader(in_file)
    next(data_reader, None)
    for row in data_reader:
        user = User.objects.get(id=row[0])
        board = Board.objects.get(id=row[1])
        if row[3]:
            parent_review = Review.objects.get(id=row[3])
        else:
            parent_review = None
        Review.objects.create(
            user          = user,
            board         = board,
            content       = row[2],
            parent_review = parent_review,
            created_at    = row[4] 
        )
    print("Upload Review Finish!")
