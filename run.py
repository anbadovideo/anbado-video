#!/usr/bin/env python

import sys

from socketio.server import SocketIOServer

import anbadoserver.config as Config


def main(argv):
    if len(argv) < 1:
        raise RuntimeError

    if argv[1] == 'sample':
        import anbadoserver.sample as Module
        SocketIOServer(
            ('0.0.0.0', Config.SOCKET_PORT),
            Module.Application(),
            policy_server=True,
            policy_listener=('0.0.0.0', 10843)
        ).serve_forever()


if __name__ == '__main__':
    main(sys.argv)
