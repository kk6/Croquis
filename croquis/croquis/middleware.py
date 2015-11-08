# -*- coding: utf-8 -*-
import tweepy

from django.conf import settings


def get_twitter_api(access_token, access_token_secret):
    auth = tweepy.OAuthHandler(settings.SOCIAL_AUTH_TWITTER_KEY, settings.SOCIAL_AUTH_TWITTER_SECRET)
    auth.set_access_token(access_token, access_token_secret)
    return tweepy.API(auth)


def get_twitter_access_tokens(user):
    social = user.social_auth.get(provider='twitter')
    return {'access_token': social.access_token['oauth_token'],
            'access_token_secret': social.access_token['oauth_token_secret']}


class TwitterMiddleware(object):

    def process_request(self, request):
        if hasattr(request, 'user') and hasattr(request.user, 'social_auth'):
            tokens = get_twitter_access_tokens(request.user)
            request.twitter_api = get_twitter_api(tokens['access_token'], tokens['access_token_secret'])