import base64
import uuid
from datetime import datetime
from pytz import timezone

from django.core.files.base  import ContentFile
from django.http import JsonResponse
from django.db.models        import Q
from rest_framework.views import APIView

from board.models import Category, Board
from user.models import User

from core.s3_uploader import s3_client


class CategoryView(APIView):
    # 게시판 종류를 반환하는 api
    def get(self, request):
        try:
            categories = Category.objects.filter(is_valid=True)

            categories_info = [{
                'id'   : category.id,
                'name' : category.name,
            }for category in categories]

            return JsonResponse({'message': 'success', 'categories_info': categories_info}, status=200)

        except Category.DoesNotExist:
            return JsonResponse({'message': 'Category Not Found'}, status=401)


class BoardView(APIView):
    # 특정 게시글을 반환하는 api
    def get(self, request, id):
        try:
            board = Board.objects.get(id=id)
            if board.category.name == '자유게시판':
                category = '자유게시판'
            else:
                category = str(board.category.name) + ' 게시판'
            board_info = {
                'title'      : board.title,
                'user_id'    : board.user_id,
                'nickname'   : board.user.nickname,
                'content'    : board.content,
                'category'   : category,
                'views'      : board.views,
                'date'       : str(board.created_at)[:10],
                'time'       : str(board.created_at)[11:16],
            }

            return JsonResponse({'message': 'success', 'board_info': board_info}, status=200)

        except Board.DoesNotExist:
            return JsonResponse({'message': 'Board Not Found'}, statue=401)


class BoardListView(APIView):
    # 특정 게시판의 게시글들을 반환하는 api
    def get(self, request, id):
        try:
            boards = Board.objects.filter(category_id=id).order_by('-created_at')
            board_list = [{
                'index'      : len(boards) - i,
                'id'         : board.id,
                'title'      : board.title,
                'user_id'    : board.user_id,
                'nickname'   : board.user.nickname,
                'content'    : board.content,
                'views'      : board.views,
                'date'       : str(board.created_at)[:10],
                'time'       : str(board.created_at)[11:16],
            }for i, board in enumerate(boards)]

            return JsonResponse({'message': 'success', 'board_list': board_list}, status=200)

        except Board.DoesNotExist:
            return JsonResponse({'message': 'Board Not Found'}, statue=401)


class BoardByCategory(APIView):
    # 게시판 기준으로 게시글 리스트를 반환하는 api
    def get(self, request):
        try:
            categories = Category.objects.filter(is_valid=True)

            board_info = []
            for category in categories:
                board_list = [{
                    'id'         : board.id,
                    'title'      : board.title,
                    'user_id'    : board.user_id,
                    'nickname'   : board.user.nickname,
                    'content'    : board.content,
                    'views'      : board.views,
                    'date'       : str(board.created_at)[:10],
                    'time'       : str(board.created_at)[11:16],
                }for board in Board.objects.filter(category_id=category.id).order_by('-created_at')]

                board_info.append(board_list)

            return JsonResponse({'message': 'success', 'board_info': board_info}, status=200)

        except Board.DoesNotExist:
            return JsonResponse({'message': 'Board Not Found'}, statue=401)


class BoardUploadView(APIView):
    def post(self, request):
        # 게시글 등록하는 api
        try:
            data     = request.data
            # user     = request.user
            user     = User.objects.get(pk=1)
            title    = data['title']
            content  = data['content']
            category = int(data['category'])

            if "<img" in content:
                total_content    = ''
                tmp              = content.replace('data:image/png;base64', 'data:image/jpeg;base64')
                replaced_content = tmp.replace('style=""', '')
                content_str      = replaced_content.split('data:image/jpeg;base64,')

                total_content += content_str[0]

                for i in range(len(content_str) - 1):
                    encoded_str   = content_str[i + 1].split('"')
                    decoded_image = base64.urlsafe_b64decode(str(encoded_str[0]))
                    fileName      = 'community/' + uuid.uuid4().hex[:10] + '.png'
                    image_url     = s3_client.upload(ContentFile(decoded_image, fileName))
                    replaced_content = replaced_content.replace(encoded_str[0], image_url)
                    print(replaced_content)
                    
                    content = replaced_content.replace('data:image/jpeg;base64,', '')
            
            Board.objects.create(
                title      = title,
                content    = content,
                user       = user,
                category   = Category.objects.get(pk=category),
                views      = 0,
                created_at = str(datetime.now(timezone('Asia/Seoul'))),
            )

            return JsonResponse({'message': 'success'}, status=201)

        except:
            return JsonResponse({'message': 'upload fail'}, status=404)

    
class BoardDeleteView(APIView):
    def delete(self, request, id):
        # 게시글을 삭제하는 api
        user = request.user
        Board.objects.filter(Q(pk=id) & Q(user_id=user.pk)).delete()

        return JsonResponse({'message': 'success'}, status=201)