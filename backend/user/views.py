from django.http                  import JsonResponse
from rest_framework.views         import APIView
from django.conf                  import settings
from .models                      import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators      import method_decorator
import jwt, requests, datetime
import urllib.request

@method_decorator(csrf_exempt, name='dispatch')
class GoogleLoginView(APIView):    
    def post(self,request): 
        token    = request.headers["Authorization"] # 프론트엔드에서 HTTP로 들어온 헤더에서 id_token(Authorization)을 변수에 저장
        url      = 'https://oauth2.googleapis.com/tokeninfo?id_token=' # 토큰을 이용해서 회원의 정보를 확인하기 위한 gogle api주소
        response = requests.get(url+token) #구글에 id_token을 보내 디코딩 요청
        user     = response.json() # 유저의 정보 저장
        print(user)

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
        print(user)

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
    def post(self, request):
        data = request.data
        token  = data['token']
        header = "Bearer " + token # Bearer 다음에 공백 추가
        url = "https://openapi.naver.com/v1/nid/me"
        request = urllib.request.Request(url)
        request.add_header("Authorization", header)
        response = urllib.request.urlopen(request)
        rescode = response.getcode()

        if(rescode==200):
            response_body = response.read()
            print(response_body.decode('utf-8'))
            print(type(response_body.decode('utf-8')))

        else:
            print("Error Code:" + rescode)

        res_str = response_body.decode('utf-8')
        naver_id   = (res_str.split('"id":"')[1]).split('"')[0]
        user_name  = (res_str.split('"name":"')[1]).split('"')[0]
        user_email = (res_str.split('"email":"')[1]).split('"')[0]

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


class DeleteUser(APIView):
    def delete(self, request, id):
        user = User.objects.get(id=id)
        user.delete()

        return JsonResponse({'message': 'delete success'}, status=200)