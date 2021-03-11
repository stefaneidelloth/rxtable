# in order for this to run, you need to
# * install python and include python and python/Scripts folder in windows environment variable PATH
# * install flask package with pip install flask
# * run the command python server.py

import flask
from flask import Flask
from flask import request
from waitress import serve
import urllib
from urllib.parse import parse_qs
from flask import json
from werkzeug.exceptions import HTTPException
from werkzeug.exceptions import InternalServerError
import os

# noinspection PyUnresolvedReferences
from development import Development

class BackEnd(object):

    def __init__(
        self,
        injected_serve,
        injected_flask,
        front_end_path='../../front'
    ):
        self.__app = self.create_application(front_end_path)
        self.__front_end_path = front_end_path
        self.__serve = injected_serve
        self.__flask = injected_flask
        self.__cache = {}

    def start(self, host='localhost', application_port=5000):
        self.__serve(self.__app, host=host, port=application_port)

    def create_application(self, front_end_path):
        app = Flask(
            __name__,
            static_folder=front_end_path + '/dist',
            template_folder=front_end_path + '/dist'
        )
        app.config['PROPAGATE_EXCEPTIONS'] = True

        @app.route('/')
        def index():
            print('rendering index.html template with path ' + os.getcwd() + '/' + front_end_path + '/dist')
            return self.__flask.render_template('index.html')

        @app.route('/favicon.ico')
        def favicon():
            image_dir = os.path.abspath('../images')
            return self.__flask.send_from_directory(
                os.path.join(image_dir),
                'favicon.ico',
                mimetype='image/vnd.microsoft.icon'
            )

        @app.route('/<path:path>')
        def catch_all(path):
            if 'main.css' in path:
                path = 'main.css'
            if 'index.html' in path:
                path = 'index.html'
            if 'favicon.ico' in path:
                path = 'favicon.ico'
            if 'bundle.js' in path:
                path = 'bundle.js'

            directory_path = os.path.abspath('../../front/dist')
            absolute_path = os.path.join(directory_path, path)
            if path != "" and os.path.exists(absolute_path):
                # This is used for files in dist folder, e.g. bundle.js, main.css, ...
                return self.__flask.send_from_directory(os.path.join(directory_path), path)
            else:
                # Handles the remaining routes by passing routes to front-end router
                # see fontEnd/src/pages/MainPage
                return self.__flask.send_from_directory(os.path.join(directory_path), 'index.html')

        @app.errorhandler(InternalServerError)
        def handle_internal_server_error(error):
            return BackEnd.__handle_internal_server_error(error)

        @app.errorhandler(HTTPException)
        def handle_exception(exception):
            return BackEnd.__handle_exception(exception)

        @app.errorhandler(500)
        def handle_500(error):
            return BackEnd.__handle_500(error)

        return app

    @staticmethod
    def __handle_internal_server_error(error):
        original = getattr(error, 'original_exception', None)

        if original is None:
            # direct 500 error, such as abort(500)
            print('Internal server error')
            return 'Internal server error', 500

        message = 'Internal server error\n' + original
        print(message)
        return message, 500

    @staticmethod
    def __handle_exception(http_exception):
        """Return JSON instead of HTML for HTTP errors."""
        # start with the correct headers and status code from the error
        response = http_exception.get_response()
        # replace the body with JSON
        response.data = json.dumps({
            'code': http_exception.code,
            'name': http_exception.name,
            'description': http_exception.description,
        })
        response.content_type = 'application/json'
        return response

    @staticmethod
    def __handle_500(error):
        message = 'Internal server error 500:'
        print(message, error)
        return message + error

def main():
    host = 'localhost'  # '10.92.39.100'
    port = 5000
    back_end = BackEnd(serve, flask)
    Development.open_browser('http:/' + host + ':' + str(port))
    back_end.start(host=host, application_port=port)


if __name__ == '__main__':
    main()
