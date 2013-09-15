#!/usr/bin/env python
# -*- coding: utf-8 -*-

from anbadoserver.models import User, Video, Event
from anbadoserver import init_db

init_db()

# Chiwan Park
user1 = User('https://fbcdn-sphotos-d-a.akamaihd.net/hphotos-ak-prn1/923489_362344557205219_1673883221_n.jpg')
user1.save()

# Han Jin-Soo
user2 = User('https://fbcdn-sphotos-e-a.akamaihd.net/hphotos-ak-ash3/1234286_538935572839948_1338494818_n.jpg')
user2.save()

# Yonghui In
user3 = User('https://fbcdn-sphotos-f-a.akamaihd.net/hphotos-ak-ash3/581713_579108125453172_81646908_n.jpg')
user3.save()

# Chiwan - Yonghui Friend connection
user1.friends.append(user3)
user3.friends.append(user1)

# Jin-Soo - Yonghui Friend connection
user2.friends.append(user3)
user3.friends.append(user2)

user1.save()
user2.save()
user3.save()

# sample video
video = Video('youtube', 'AVXW6ImzXtc', u'아이유 (IU) 라이브로 짧게 커버한 곡들', 684, user1)
video.save()

# sample event 1
event1 = Event(user1, video, 20, 25, u'아이유짱!', 'text', (20, 40))
event1.save()

event2 = Event(user2, video, 0, 0, u'역시 아이유가 짱이지 ㅇㅇ', 'text', (20, 40), parent=event1)
event2.save()

event3 = Event(user1, video, 50, 155, u'jin-soo stupid!', 'text', (150, 250), permission='protected')
event3.save()

