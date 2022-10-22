from django.http                  import JsonResponse
from rest_framework.views         import APIView
from board.models                 import Board

from board.models                 import Review
from .models                      import *
from django.db                    import transaction
from django.db.models             import Q
import datetime
from user.utils import login_decorator
from user.models import User
from datetime import datetime
from pytz import timezone

class CreateReview(APIView):
    @login_decorator
    def post(self, request):
        try:
            data = request.data
            user = request.user
            # user = User.objects.get(id=1)
            board = data['board']
            content = data['content']
            parent_review = data.get('parent_review', None)
            if parent_review:
                parent_review = Review.objects.get(id=parent_review)
            else:
                parent_review = None

            review = Review.objects.create(
                user          = user,
                board         = Board.objects.get(id=board),
                content       = content,
                parent_review = parent_review,
                created_at = str(datetime.now(timezone('Asia/Seoul'))),
            )

            return JsonResponse({'message': 'success'}, status=200)
        
        except:
            return JsonResponse({'message': 'upload fail'}, status=404)


class ReviewList(APIView):
    def get(self, request, id):
        try:
            reviews = Review.objects.filter(board_id=id).order_by('-created_at')
            review_info = []

            for review in reviews:
                if review.parent_review:
                    parent_review = review.parent_review.id
                else:
                    parent_review = None
                review_info.append({
                    'id'            : review.id,
                    'content'       : review.content,
                    'parent_review' : parent_review,
                    'user'          : review.user.nickname,
                    'user_id'       : review.user.id,
                    'date'          : str(review.created_at)[:16],
                })
                print(review.user.id)

            return JsonResponse({'message': 'success', 'review_info': review_info}, status=200)
        
        except:
            return JsonResponse({'message': 'error'}, status=404)


class DeleteReview(APIView):
    @login_decorator
    def delete(self, request, id):
        try:
            review = Review.objects.get(id=id)
            review.delete()

            return JsonResponse({'message': 'success'}, status=200)
        
        except:
            return JsonResponse({'message': 'error'}, status=404)
