#!/usr/bin/env python
# -*- coding: utf-8 -*-

from anbadoserver.models import User, Video, Event
from anbadoserver import init_db

init_db()


#anbado
user1 = User('anbado user1','/static/examples/img/profile1.jpg')
user1.save()

user2 = User('anbado user2','/static/examples/img/profile2.jpg')
user2.save()


# Chiwan - Yonghui Friend connection
user1._friends.append(user1)
user2._friends.append(user1)

user1.save()
user2.save()

# sample video


video = Video('anbado', 'http://web1.anbado.com/data/introAnbadoVideo.mp4', u'sample', 400, user1)
video.save()

video2 = Video('youtube', 'http://www.youtube.com/watch?v=Ks-_Mh1QhMc', u'youtubeSample', 400, user1)
video2.save()

video3 = Video('vimeo', 'http://vimeo.com/78788086', u'vimeoSample', 400, user1)
video3.save()

# sample event 1
event1 = Event(user2, video, 2, 6, u'hello', 'text', (112, 400))
event1.save()

event2 = Event(user1, video, 2, 6, u'hello', 'text', (312, 400))
event2.save()

event3 = Event(user2, video, 2, 6, u'hello', 'text', (212, 400))
event3.save()