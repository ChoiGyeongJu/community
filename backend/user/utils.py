import jwt, datetime

from django.db.models import Q
from django.http      import JsonResponse
from django.conf      import settings

from user.models import User

def login_decorator(func):
    def wrapper(self, request, *args, **kwargs):
        new_access_token = None

        try:
            access_token  = request.headers['AccessToken']
            refresh_token = request.headers['RefreshToken']

            access_token_payload  = jwt.decode(access_token, settings.SECRET_KEY, settings.ALGORITHM)
            print(access_token_payload)
            user                  = User.objects.filter(Q(social_login_id=access_token_payload['id']))
            # print(user)
            request.user          = user[0]

        except jwt.exceptions.DecodeError:
            return JsonResponse({'message': 'INVALID_TOKEN' }, status=400)
        
        except User.DoesNotExist:
            return JsonResponse({'message': 'INVALID_USER'}, status=400)
        
        except jwt.ExpiredSignatureError:
            refresh_token_payload = jwt.decode(refresh_token, settings.SECRET_KEY, settings.ALGORITHM)
            user                  = User.objects.filter(Q(id=refresh_token_payload['id']))
            request.user          = user[0]
            today                 = datetime.datetime.utcnow() + datetime.timedelta(hours=9)

            new_access_token = jwt.encode({'id': request.user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6)}, settings.SECRET_KEY, algorithm='HS256')
            # print(new_access_token)
            return JsonResponse({"message": "Create AccessToken Success", "AccessToken" : new_access_token})

        except:
            return JsonResponse({"message": "KEY ERROR"}, status=400)
            
        return func(self, request, *args, **kwargs)
    
    return wrapper