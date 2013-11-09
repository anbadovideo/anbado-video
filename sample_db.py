#!/usr/bin/env python
# -*- coding: utf-8 -*-

from anbadoserver.models import User, Video, Event
from anbadoserver import init_db

init_db()


#anbado
user1 = User('anbado user1','http://static.modac.tv/fbdata/https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc1/371656_1671247943_1005892833_n.jpg')
user1.save()

user2 = User('anbado user2','http://static.modac.tv/fbdata/https://fbcdn-profile-a.akamaihd.net/hprofile-ak-frc1/371656_1671247943_1005892833_n.jpg')
user2.save()


# Chiwan - Yonghui Friend connection
user1._friends.append(user1)
user2._friends.append(user1)

user1.save()
user2.save()

# sample video


video = Video('anbado', 'http://web1.anbado.com/data/introAnbadoVideo.mp4', u'sample', 400, user1)
video.save()


# sample event 1
event1 = Event(user2, video, 2, 6, u'hello', 'text', (112, 400))
event1.save()