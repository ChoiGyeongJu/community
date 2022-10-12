from django.http import JsonResponse
from rest_framework.views import APIView
from django.conf                  import settings
from .models import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators      import method_decorator
import jwt, requests, datetime

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):    
    def post(self,request): 
        token    = request.headers["Authorization"] # 프론트엔드에서 HTTP로 들어온 헤더에서 id_token(Authorization)을 변수에 저장
        url      = 'https://oauth2.googleapis.com/tokeninfo?id_token=' # 토큰을 이용해서 회원의 정보를 확인하기 위한 gogle api주소
        response = requests.get(url+token) #구글에 id_token을 보내 디코딩 요청
        user     = response.json() # 유저의 정보 저장

        if User.objects.filter(social_login_id = user['sub']).exists(): 
            user_info           = User.objects.get(social_login_id=user['sub']) 
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

            access_token  = jwt.encode({'id': new_user_info.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            refresh_token = jwt.encode({'id': new_user_info.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, settings.SECRET_KEY, algorithm='HS256')

            JWT = {
                'AccessToken': access_token,
                'RefreshToken': refresh_token
            }
            User.objects.filter(id=new_user_info.id).update(
                refresh_token = refresh_token
            )

            return JsonResponse({'message': 'success', 'JWT': JWT}, status=200)