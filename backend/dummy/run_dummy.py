import sys, os

sys.path.append(os.path.abspath('..'))

exec(open('upload_socialplatform.py').read())
exec(open('upload_user.py').read())
exec(open('upload_category.py').read())
exec(open('upload_board.py').read())