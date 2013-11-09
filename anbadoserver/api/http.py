#!/usr/bin/env python
# -*- coding: utf-8 -*-
""":mod:`anbadoserver.api.http` --- Anbado Video RESTful API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
"""
from flask import request, abort, jsonify

from sqlalchemy.exc import SQLAlchemyError
from anbadoserver.models import User, Video
from anbadoserver import app, db, frogspawn, config
from anbadoserver.decorators import crossdomain


@app.route('/user/<int:user_id>', methods=('GET', ))
@crossdomain(origin='*')
def user_get(user_id):
    """Get user information by given user id.

        :param user_id: id of user which you want
        :type user_id: int
        :resheader Content-Type: application/json
        :status 404: when no user found using given user id
        :status 200: when all operations are successful
    """
    user = User.by_user_id(user_id)
    if user is None:
        abort(404)

    return jsonify(user=user.to_json())


@app.route('/user', methods=('POST', ))
@crossdomain(origin='*')
def user_post():
    """Add new user into solution's database.

        :form user_id: optional id of new user
        :form name: name of new user
        :form profile_image: profile image data represented as address or base64-encoded string
        :resheader Content-Type: application/json
        :status 400: when some parameters is missing
        :status 500: when error occurred in database operations
        :status 200: when all operations are successful
    """
    profile_image = request.form.get('profile_image', None)
    if profile_image is None:
        abort(400)

    name = request.form.get('name', None)
    if name is None:
        abort(400)

    user_id = int(request.form.get('user_id', -1))

    user = User(name, profile_image, user_id)
    if not user.save():
        abort(500)

    return jsonify(success=True, user_id=user.user_id)


@app.route('/user/<int:user_id>', methods=('PUT', ))
@crossdomain(origin='*')
def user_put(user_id):
    """Modify user information.

        :form profile_image: new profile image data
        :param user_id: id of user which you want to change
        :type user_id: int
        :resheader Content-Type: application/json
        :status 200: when all operations are successful
        :status 400: when profile_image is missing
        :status 404: when no user found using given user id
        :status 500: when error occurred in database operations
    """
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
    """Get video information by given video id.

        :param video_id: id of video which you want
        :type video_id: int
        :resheader Content-Type: application/json
        :status 200: when all operations are successful
        :status 404: when no video found using given id
    """
    video = Video.by_video_id(video_id)
    if video is None:
        abort(404)

    return jsonify(video=video.to_json())


@app.route('/video', methods=('POST', ))
@crossdomain(origin='*')
def video_post():
    """Add a new video into solution's database.

        :form provider: unique string which represents video provider such as youtube, vimeo, ted, anbado
        :form provider_id: id of video using in video provider
        :form title: title of video
        :form length: length of video in seconds
        :form user_id: id of user who uploads this video
        :form video_id: optional id of video if video id is predefined
        :resheader Content-Type: application/json
        :status 200: when all operations are successful
        :status 400: when some required parameters are missing or given user_id is not valid
        :status 500: when error occurred in database operations
    """
    provider = request.form.get('provider', None)
    provider_vid = request.form.get('provider_vid', None)
    title = request.form.get('title', '')
    length = request.form.get('length', None)
    user_id = request.form.get('user_id', None)
    video_id = int(request.form.get('video_id', -1))

    if (provider is None) or (provider_vid is None) or (length is None) or (user_id is None):
        abort(400)

    user = User.by_user_id(user_id)
    if user is None:
        abort(400)

    video = Video(provider, provider_vid, title, length, user, video_id)
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
    """Modify video information which has a given video id.
        **This procedure needs to same parameters using in** :http:post:`/video`

        :param video_id: id of video which you want to change information
        :type video_id: int
        :resheader Content-Type: application/json
        :status 200: when all opertions are successful
        :status 404: when no video found using given id
        :status 400: when new video id is missing
        :status 500: when error occurred in database operations
    """
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
    """Get list of participants of certain video.
        This procedure doesn't consider about friendship.

        :param video_id: id of video which you want to get list of participants
        :type video_id: int
        :resheader Content-Type: application/json
        :status 200: when all operations are successful
        :status 404: when no video found using given id
    """
    video = Video.by_video_id(video_id)
    if video is None:
        abort(404)

    return jsonify(participants=[x.to_json() for x in video.participants.all()])


@app.route('/friendship/<int:user_id>', methods=('GET', ))
@crossdomain(origin='*')
def friendship_get(user_id):
    """Get list of friends of user found by given id.

        :param user_id: id of user who you want to get list of friends
        :type user_id: int
        :status 200: when all operations are successful
        :status 404: when no user found using given id
    """
    user = User.by_user_id(user_id)
    if user is None:
        abort(404)

    return jsonify(friends=[x.to_json() for x in user._friends.all()])


@app.route('/friendship/<int:userA_id>/<int:userB_id>', methods=('POST', ))
@crossdomain(origin='*')
def friendship_post(userA_id, userB_id):
    """Add friend relationship between user A and user B.

        :param userA_id: id of user A
        :type userA_id: int
        :param userB_id: id of user B
        :type userB_id: int
        :status 200: when all operations are successful
        :status 404: no user found by given user id (a or b)
        :status 500: when error occurred in database operations
    """
    userA = User.by_user_id(userA_id)
    userB = User.by_user_id(userB_id)

    if (userA is None) or (userB is None):
        abort(404)

    userA._friends.append(userB)
    userB._friends.append(userA)

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
    """Delete friend relationship between user A and user B.

        :param userA_id: id of user A
        :type userA_id: int
        :param userB_id: id of user B
        :type userB_id: int
        :status 200: when all operations are successful
        :status 404: no user found by given user id (a or b)
        :status 500: when error occurred in database operations
    """
    userA = User.by_user_id(userA_id)
    userB = User.by_user_id(userB_id)

    if (userA is None) or (userB is None):
        abort(404)

    userA._friends.remove(userB)
    userB._friends.remove(userA)

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
