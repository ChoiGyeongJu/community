from django.http                  import JsonResponse
from rest_framework.views         import APIView
from django.conf                  import settings

from user.utils                   import login_decorator
from .models                      import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators      import method_decorator
from django.db                    import transaction
from django.db.models             import Q
import jwt, requests, datetime
import urllib.request
from board.models import *

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):    
    def post(self,request): 
        token    = request.headers["Authorization"] # 프론트엔드에서 HTTP로 들어온 헤더에서 id_token(Authorization)을 변수에 저장
        url      = 'https://oauth2.googleapis.com/tokeninfo?id_token=' # 토큰을 이용해서 회원의 정보를 확인하기 위한 gogle api주소
        response = requests.get(url+token) #구글에 id_token을 보내 디코딩 요청
        user     = response.json() # 유저의 정보 저장
        # print(user)

        if User.objects.filter(social_login_id = user['sub']).exists(): 
            user_info      = User.objects.get(social_login_id=user['sub']) 
            access_token   = jwt.encode({'id': user["sub"], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token  = jwt.encode({'id': user["sub"], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

            JWT = {
                'AccessToken' : access_token,
                'RefreshToken': refresh_token
            }
            User.objects.filter(id=user_info.id).update(
                refresh_token = refresh_token
            )

            return JsonResponse({"message": "success", "JWT": JWT}, status=200)

        else:
            new_user_info = User.objects.create( # 처음으로 구글 로그인 했을때
                social_login_id = user['sub'],
                nickname        = user['name'],
                social          = SocialPlatform.objects.get(platform ="google"),
                email           = user.get('email', None)
            )

            access_token  = jwt.encode({'id': user['sub'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode({'id': user['sub'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

            JWT = {
                'AccessToken': access_token,
                'RefreshToken': refresh_token
            }
            User.objects.filter(id=new_user_info.id).update(
                refresh_token = refresh_token
            )

            return JsonResponse({'message': 'success', 'JWT': JWT}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class KakaoLoginView(APIView):
    def post(self, request):
        access_token = request.headers["Authorization"]
        headers      =({'Authorization' : f"Bearer {access_token}"})
        url          = "https://kapi.kakao.com/v2/user/me" # Authorization을 이용해서 회원의 정보를 확인하기 위한 카카오 API 주소
        response     = requests.request("POST", url, headers=headers)
        user         = response.json()
        # print(user)

        if User.objects.filter(social_login_id = user['id']).exists():
            user_info      = User.objects.get(social_login_id=user['id'])
            access_token   = jwt.encode({'id': user["id"], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token  = jwt.encode({'id': user["id"], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

            JWT = {
                'AccessToken' : access_token,
                'RefreshToken': refresh_token
            }
            User.objects.filter(id=user_info.id).update(
                refresh_token = refresh_token
            )

            return JsonResponse({"message": "success", "JWT": JWT}, status=200)

        else:
            new_user_info = User.objects.create(
                social_login_id = user['id'],
                nickname        = user['properties']['nickname'],
                social          = SocialPlatform.objects.get(platform ="kakao"),
                email           = user['properties'].get('email', None)
            )

            access_token  = jwt.encode({'id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode({'id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

            JWT = {
                'AccessToken': access_token,
                'RefreshToken': refresh_token
            }
            User.objects.filter(id=new_user_info.id).update(
                refresh_token = refresh_token
            )

            return JsonResponse({'message': 'success', 'JWT': JWT}, status=200)


@method_decorator(csrf_exempt, name='dispatch')
class NaverLoginView(APIView):
    @transaction.atomic
    def post(self, request):
        try:
            data       = request.data
            user_name  = data['name']
            user_email = data['email']
            naver_id   = data['id']

            if User.objects.filter(social_login_id = naver_id).exists():
                user_info      = User.objects.get(social_login_id=naver_id)
                access_token   = jwt.encode({'id': naver_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
                refresh_token  = jwt.encode({'id': naver_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

                JWT = {
                    'AccessToken' : access_token,
                    'RefreshToken': refresh_token
                }
                User.objects.filter(id=user_info.id).update(
                    refresh_token = refresh_token
                )

                return JsonResponse({"message": "success", "JWT": JWT}, status=200)

            else:
                new_user_info = User.objects.create(
                    social_login_id = naver_id,
                    nickname        = user_name,
                    social          = SocialPlatform.objects.get(platform ="naver"),
                    email           = user_email,
                )

                access_token  = jwt.encode({'id': naver_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
                refresh_token = jwt.encode({'id': naver_id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

                JWT = {
                    'AccessToken': access_token,
                    'RefreshToken': refresh_token
                }
                User.objects.filter(id=new_user_info.id).update(
                    refresh_token = refresh_token
                )

                return JsonResponse({'message': 'success', 'JWT': JWT}, status=200)

        except:
            return JsonResponse({'message': 'error'}, status=401)



class DeleteUser(APIView):
    def delete(self, request, id):
        user = User.objects.get(id=id)
        user.delete()

        return JsonResponse({'message': 'delete success'}, status=200)


class UserInfoView(APIView):
    @login_decorator
    def get(self, request):
        try:
            user = request.user
            user_info = {
                'id'       : user.id,
                'nickname' : user.nickname,
            }

            return JsonResponse({'message': 'success', 'user_info': user_info}, status=200)
        
        except User.DoesNotExist:
            return JsonResponse({'message': 'Not Found'}, status=401)


class UpdateNickname(APIView):
    @login_decorator
    def patch(self, request):
        try:
            user = request.user
            data = request.data
            nickname = data['nickname']

            if User.objects.filter(nickname=nickname).exists():
                return JsonResponse({'message': 'Nickname Already Exist'}, status=401)
            else:
                User.objects.filter(id=user.id).update(
                    nickname = nickname,
                )
                return JsonResponse({'message': 'success'}, status=200)
        
        except:
            return JsonResponse({'message': 'error'}, status=401)


class MyPageView(APIView):
    @login_decorator
    def get(self, request):
        try:
            user = request.user
            user_info = {
                'id'       : user.id,
                'nickname' : user.nickname,
            }

            board_list = [{
                'id'    : board.id,
                'title' : board.title,
                'date'  : str(board.created_at)[:10],
            }for board in Board.objects.filter(user=user).order_by('-created_at')]

            review_list = [{
                'board_id'    : review.board.id,
                'board_title' : review.board.title,
                'id'          : review.id,
                'content'     : review.content,
                'date'        : str(review.created_at)[:10],
            }for review in Review.objects.filter(user=user).order_by('-created_at')]

            return JsonResponse({'message': 'success', 'user_info': user_info   
                                 ,'review_list': review_list, 'board_list': board_list}, status=200)
        
        except User.DoesNotExist:
            return JsonResponse({'message': 'Not Found'}, status=401)
