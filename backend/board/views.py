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


class BoardListView(APIView):
    # 특정 게시판의 게시글을 반환하는 api
    def get(self, request, id):
        try:
            board_list = [{
                'title'      : board.title,
                'user_id'    : board.user_id,
                'nickname'   : board.user.nickname,
                'content'    : board.content,
                'views'      : board.views,
                'date'       : str(board.created_at)[:10],
                'time'       : str(board.created_at)[11:16],
            }for board in Board.objects.filter(category_id=id)]

            return JsonResponse({'message': 'success', 'board_list': board_list}, status=200)


        except Board.DoesNotExist:
            return JsonResponse({'message': 'Board Not Found'}, statue=401)


class BoardUploadView(APIView):
    def post(self, request):
        # 게시글 등록하는 api
        try:
            data     = request.data
            user     = request.user
            title    = data['title']
            content  = data['content']
            category = data['category']

            if "<img" in content:
                total_content    = ''
                replaced_content = content.replace('data:image/png;base64', 'data:image/jpeg;base64')
                content_str      = replaced_content.split('data:image/jpeg;base64,')

                total_content += content_str[0]

                for i in range(len(content_str) - 1):
                    encoded_str   = content_str[i + 1].split('"')
                    decoded_image = base64.urlsafe_b64decode(str(encoded_str[0]))
                    fileName      = 'community/' + uuid.uuid4().hex[:10] + '.png'
                    image_url     = s3_client.upload(ContentFile(decoded_image, fileName))

                    if i > 0:
                        total_content += '"' + image_url + '"' + encoded_str[1]
                    else:
                        total_content += image_url + '"' + encoded_str[1]
                    
                    content = total_content
            
            Board.objects.create(
                title      = title,
                content    = content,
                user       = user,
                category   = category,
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