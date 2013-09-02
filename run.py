#!/usr/bin/env python

import sys
from socketio.server import SocketIOServer
import anbadoserver.config as config
from anbadoserver import app


def main(argv):
    SocketIOServer(
        ('0.0.0.0', config.SOCKET_PORT),
        app,
        policy_server=True,
        policy_listener=('0.0.0.0', 10843)
    ).serve_forever()


if __name__ == '__main__':
    main(sys.argv)
