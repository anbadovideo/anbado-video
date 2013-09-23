#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import (
    request,
    abort,
    jsonify
    )

from sqlalchemy.exc import SQLAlchemyError
from anbadoserver.models import (
    User,
    Video
    )
from anbadoserver import app, db, frogspawn
from anbadoserver.decorators import crossdomain


@app.route('/user/<int:user_id>', methods=('GET', ))
@crossdomain(origin='*')
def user_get(user_id):
    user = User.by_user_id(user_id)
    if user is None:
        abort(404)

    return jsonify(user=user.to_json())


@app.route('/user', methods=('POST', ))
@crossdomain(origin='*')
def user_post():
    profile_image = request.form.get('profile_image', None)
    if profile_image is None:
        abort(400)

    user = User(profile_image)
    if not user.save():
        abort(500)

    return jsonify(success=True, user_id=user.user_id)


@app.route('/user/<int:user_id>', methods=('PUT', ))
@crossdomain(origin='*')
def user_put(user_id):
    profile_image = request.form.get('profile_image', None)
    if profile_image is None:
        abort(400)

    user = User.by_user_id(user_id)
    if user is None:
        abort(404)

    user.profile_image = profile_image
    if not user.save():
        abort(500)

    return jsonify(success=True)


@app.route('/video/<int:video_id>', methods=('GET', ))
@crossdomain(origin='*')
def video_get(video_id):
    video = Video.by_video_id(video_id)
    if video is None:
        abort(404)

    return jsonify(video=video.to_json())


@app.route('/video', methods=('POST', ))
@crossdomain(origin='*')
def video_post():
    provider = request.form.get('provider', None)
    provider_vid = request.form.get('provider_vid', None)
    title = request.form.get('title', '')
    length = request.form.get('length', None)
    user_id = request.form.get('user_id', None)

    if (provider is None) or (provider_vid is None) or (length is None) or (user_id is None):
        abort(400)

    user = User.by_user_id(user_id)
    if user is None:
        abort(400)

    video = Video(provider, provider_vid, title, length, user)
    if not video.save():
        abort(500)

    frogspawn.put({
        'type': 'newVideo',
        'provider': provider,
        'provider_vid': provider_vid,
        'user_id': user_id
    })

    return jsonify(success=True, video_id=video.video_id)


@app.route('/video/<int:video_id>', methods=('PUT', ))
@crossdomain(origin='*')
def video_put(video_id):
    video = Video.by_video_id(video_id)
    if video is None:
        abort(404)

    if 'video_id' in request.form:
        abort(400)

    for key in request.form.keys():
        if key == 'user_id':
            user = User.by_user_id(request.form[key])
            video.user = user

        setattr(video, key, request.form[key])

    if not video.save():
        abort(500)

    return jsonify(success=True)


@app.route('/video/<int:video_id>/participants', methods=('GET', ))
@crossdomain(origin='*')
def participants_get(video_id):
    video = Video.by_video_id(video_id)
    if video is None:
        abort(404)

    return jsonify(participants=[x.to_json() for x in video.participants.all()])


@app.route('/friendship/<int:user_id>', methods=('GET', ))
@crossdomain(origin='*')
def friendship_get(user_id):
    user = User.by_user_id(user_id)
    if user is None:
        abort(404)

    return jsonify(friends=[x.to_json() for x in user.friends.all()])


@app.route('/friendship/<int:userA_id>/<int:userB_id>', methods=('POST', ))
@crossdomain(origin='*')
def friendship_post(userA_id, userB_id):
    userA = User.by_user_id(userA_id)
    userB = User.by_user_id(userB_id)

    if (userA is None) or (userB is None):
        abort(404)

    userA.friends.append(userB)
    userB.friends.append(userA)

    if userA.save(commit=False) and userB.save(commit=False):
        try:
            db.session.commit()

            frogspawn.put({
                'type': 'postFriendship',
                'a_id': userA_id,
                'b_id': userB_id
            })

            return jsonify(success=True)
        except SQLAlchemyError:
            db.session.rollback()
            abort(500)

    abort(500)


@app.route('/friendship/<int:userA_id>/<int:userB_id>', methods=('DELETE', ))
@crossdomain(origin='*')
def friendship_delete(userA_id, userB_id):
    userA = User.by_user_id(userA_id)
    userB = User.by_user_id(userB_id)

    if (userA is None) or (userB is None):
        abort(404)

    userA.friends.remove(userB)
    userB.friends.remove(userA)

    if userA.save(commit=False) and userB.save(commit=False):
        try:
            db.session.commit()

            frogspawn.put({
                'type': 'deleteFriendship',
                'a_id': userA_id,
                'b_id': userB_id
            })

            return jsonify(success=True)
        except SQLAlchemyError:
            db.session.rollback()
            abort(500)

    abort(500)
