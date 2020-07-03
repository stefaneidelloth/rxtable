import pytest
import mock
from mock import patch, MagicMock, call

# noinspection PyUnresolvedReferences
from isi_visualization_back_end import IsiVisualizationBackEnd

# noinspection PyUnresolvedReferences
from isi_visualization_back_end import main
from flask import json
import flask

from werkzeug.exceptions import HTTPException

sut = None
app = None
client = None
mocked_serve_args = None


def mocked_serve(app, host, port):
    global mocked_serve_args
    mocked_serve_args = {
        'app': app,
        'host': host,
        'port': port
    }


class FlaskMock:

    def __init__(self):
        self.template_path = None
        self.directory = None
        self.file_name = None
        self.mime_type = None

    def render_template(self, template_path):
        self.template_path = template_path
        return ''

    def send_from_directory(self, directory, file_name, mimetype=None):
        self.directory = directory
        self.file_name = file_name
        self.mimetype = mimetype
        return ''


mocked_flask = FlaskMock()


def assert_blueprint_table_query(back_end, identifier):
    response = client.get('/api/' + identifier, query_string={'query_parameter': 'value'})
    assert response.status_code == 200
    # noinspection PyProtectedMember
    args = back_end._IsiVisualizationBackEnd__get_blueprint_table.mock_calls[0].args
    passed_identifier = args[0]
    assert passed_identifier == identifier

    request = args[1]
    assert request.query_string == b'query_parameter=value'


def assert_table_query(back_end, identifier):
    response = client.get('/api/' + identifier, query_string={'query_parameter': 'value'})
    assert response.status_code == 200
    # noinspection PyProtectedMember
    args = back_end._IsiVisualizationBackEnd__get_table.mock_calls[0].args
    passed_identifier = args[0]
    assert passed_identifier == '_' + identifier

    request = args[1]
    assert request.query_string == b'query_parameter=value'


def describe_public_api():
    @pytest.fixture(autouse=True)
    def before_each():
        global sut, app, app_request_context, client
        sut = IsiVisualizationBackEnd(mocked_serve, mocked_flask, 'front_end_path_mock', 'database_path_mock')
        sut._IsiVisualizationBackEnd__get_blueprint_table = MagicMock(return_value='result')
        sut._IsiVisualizationBackEnd__get_table = MagicMock(return_value='result')
        app = sut.create_application('../../frontEndPathMock')
        with app.app_context():
            with app.test_request_context():
                with app.test_client() as client:
                    yield

    @patch('isi_visualization_back_end.IsiVisualizationBackEnd')
    @patch('development.Development.open_browser')
    def it_main(mocked_open_browser, mocked_isi_visualization_back_end):
        main()

        assert mocked_open_browser.mock_calls == [call('http:/localhost:5000')]

        back_end_call = mocked_isi_visualization_back_end.mock_calls[0]
        assert back_end_call.args[1] == flask

    def it_construction():
        # noinspection PyProtectedMember
        assert sut._IsiVisualizationBackEnd__front_end_path == 'front_end_path_mock'

    def it_start():
        sut.start()
        assert mocked_serve_args['port'] == 5000

    def describe_create_application():
        def it_config():
            assert app.config['PROPAGATE_EXCEPTIONS'] == True

        @patch('builtins.print')
        def it_index(mocked_print):
            response = client.get('/')
            assert response.status_code == 200
            passed_message = mocked_print.mock_calls[0].args[0]
            assert passed_message[:20] == 'rendering index.html'
            assert mocked_flask.template_path == 'index.html'

        @patch('isi_visualization_back_end.IsiVisualizationBackEnd._IsiVisualizationBackEnd__request_to_table_string',
               MagicMock(return_value=[]))
        @patch('geo_processing.GeoProcessing.address_to_coordinates', MagicMock(return_value='result_mock'))
        def it_address_to_coordinates():
            response = client.get('/api/addressToCoordinates', query_string={'query_parameter': 'value'})
            assert response.status_code == 200

        @patch('isi_visualization_back_end.IsiVisualizationBackEnd._IsiVisualizationBackEnd__request_to_table_string',
               MagicMock(return_value=[]))
        @patch('geo_processing.GeoProcessing.calculate_distances', MagicMock(return_value='result_mock'))
        def it_calculate_distances():
            response = client.get('/api/calculateDistances', query_string={'query_parameter': 'value'})
            assert response.status_code == 200

        @patch('isi_visualization_back_end.IsiVisualizationBackEnd._IsiVisualizationBackEnd__request_to_table_string',
               MagicMock(return_value=[]))
        @patch('geo_processing.GeoProcessing.merge_addresses', MagicMock(return_value='result_mock'))
        def it_merge_addresses():
            response = client.get('/api/mergeAddresses', query_string={'query_parameter': 'value'})
            assert response.status_code == 200

        def it_c():
            assert_blueprint_table_query(sut, 'c')

        def it_column():
            assert_blueprint_table_query(sut, 'column')

        def it_d():
            assert_blueprint_table_query(sut, 'd')

        def it_data():
            assert_blueprint_table_query(sut, 'data')

        def it_data_set():
            assert_table_query(sut, 'data_set')

        def it_e():
            assert_blueprint_table_query(sut, 'e')

        def it_f():
            assert_blueprint_table_query(sut, 'f')

        def it_format():
            assert_table_query(sut, 'format')

        def it_format_entry():
            assert_table_query(sut, 'format_entry')

        def it_format_group():
            assert_table_query(sut, 'format_group')

        def it_g():
            assert_blueprint_table_query(sut, 'g')

        def it_h():
            assert_blueprint_table_query(sut, 'h')

        def it_i():
            assert_blueprint_table_query(sut, 'i')

        def it_j():
            assert_blueprint_table_query(sut, 'j')

        def it_k():
            assert_blueprint_table_query(sut, 'k')

        def it_l():
            assert_blueprint_table_query(sut, 'l')

        def it_m():
            assert_blueprint_table_query(sut, 'm')

        def it_n():
            assert_blueprint_table_query(sut, 'n')

        def it_o():
            assert_blueprint_table_query(sut, 'o')

        def it_p():
            assert_blueprint_table_query(sut, 'p')

        def it_q():
            assert_blueprint_table_query(sut, 'q')

        def it_r():
            assert_blueprint_table_query(sut, 'r')

        def it_type():
            assert_table_query(sut, 'type')

        def it_favicon():
            client.get('/favicon.ico')
            assert mocked_flask.directory[-6:] == 'images'
            assert mocked_flask.file_name == 'favicon.ico'
            assert mocked_flask.mimetype == 'image/vnd.microsoft.icon'

        def describe_catch_all():

            @patch('os.path.exists', MagicMock(return_value=True))
            def it_main_css():
                client.get('/main.css')
                assert mocked_flask.file_name == 'main.css'

            @patch('os.path.exists', MagicMock(return_value=True))
            def it_index_html():
                client.get('/index.html')
                assert mocked_flask.file_name == 'index.html'

            @patch('os.path.exists', MagicMock(return_value=True))
            def it_bundle_js():
                client.get('/bundle.js')
                assert mocked_flask.file_name == 'bundle.js'

            @patch('os.path.exists', MagicMock(return_value=True))
            def it_imprint_php():
                response = client.get('/imprint.php')
                assert response.status_code == 200

            @patch('os.path.exists', MagicMock(return_value=True))
            def it_path_exists():
                client.get('/home')
                assert mocked_flask.directory[-4:] == 'dist'
                assert mocked_flask.file_name == 'home'
                assert mocked_flask.mimetype is None

            def it_path_does_not_exists():
                client.get('/home')
                assert mocked_flask.directory[-4:] == 'dist'
                assert mocked_flask.file_name == 'index.html'
                assert mocked_flask.mimetype is None


def describe_private_api():
    @pytest.fixture(autouse=True)
    def before_each():
        global sut, app, app_request_context, client
        with app.app_context():
            with app.test_request_context():
                sut = IsiVisualizationBackEnd(
                    mocked_serve,
                    mocked_flask,
                    'front_end_path_mock',
                    'database_path_mock'
                )

                app = sut.create_application('../../frontEndPathMock')
                with app.test_client() as client:
                    yield

    def describe__get_table():
        class HttpRequestMock:

            def __init__(self): \
                self.query_string = 'queryStringMock'

        def it_is_in_cache():
            table_name = 'tableNameMock'
            http_request = HttpRequestMock()
            # noinspection PyProtectedMember
            sut._IsiVisualizationBackEnd__cache['tableNameMockqueryStringMock'] = 'mocked_query_result'
            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_table(table_name, http_request)
            assert response == 'mocked_query_result'

        def it_is_not_in_cache():
            table_name = 'tableNameMock'
            http_request = HttpRequestMock()
            sut._IsiVisualizationBackEnd__cache = {}

            def mocked__get_table_directly(table_name_arg, http_request_arg):
                return 'mocked_query_result'

            def mocked__empty_cache_if_is_full():
                return

            sut._IsiVisualizationBackEnd__get_table_directly = mocked__get_table_directly
            sut._IsiVisualizationBackEnd__empty_cache_if_is_full = mocked__empty_cache_if_is_full

            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_table(table_name, http_request)
            assert response == 'mocked_query_result'

    def describe__get_table_directly():
        def it_without_error():
            table_name = 'foo'
            http_request = 'http_request_mock'

            sut._IsiVisualizationBackEnd__parse_request = MagicMock(return_value='where_clause_mock')

            class DatabaseMock:

                def __init__(self):
                    self.passed_query = None
                    self.where_clause = None

                def query(self, query, where_clause):
                    self.passed_query = query
                    self.where_clause = where_clause
                    return 'mocked_query_result'

            mocked_database = DatabaseMock()

            sut._IsiVisualizationBackEnd__database = mocked_database

            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_table_directly(table_name, http_request)
            assert response == 'mocked_query_result'

        @patch('builtins.print')
        def it_with_error(mocked_print):
            table_name = 'foo'
            http_request = 'http_request_mock'

            def mocked_parse_request(http_request):
                raise Exception('foo')

            sut._IsiVisualizationBackEnd__parse_request = mocked_parse_request

            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_table_directly(table_name, http_request)

            expected_text = '{"error": "Could not get table with request http_request_mock\nfoo"}'
            assert response == (expected_text, 500)
            assert mocked_print.mock_calls == [call(expected_text)]

    def describe__get_blueprint_table():
        class HttpRequestMock:

            def __init__(self): \
                self.query_string = 'queryStringMock'

        def it_is_in_cache():
            identifier = 'identifierMock'
            http_request = HttpRequestMock()

            # noinspection PyProtectedMember
            sut._IsiVisualizationBackEnd__cache['identifierMockqueryStringMock'] = 'mocked_query_result'

            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_blueprint_table(identifier, http_request)
            assert response == 'mocked_query_result'

        def it_is_not_in_cache():
            identifier = 'identifierMock'
            http_request = HttpRequestMock()
            sut._IsiVisualizationBackEnd__cache = {}

            def mocked__get_blueprint_table_directly(identifier_arg, http_request_arg):
                return 'mocked_query_result'

            def mocked__empty_cache_if_is_full():
                return

            sut._IsiVisualizationBackEnd__get_blueprint_table_directly = mocked__get_blueprint_table_directly
            sut._IsiVisualizationBackEnd__empty_cache_if_is_full = mocked__empty_cache_if_is_full

            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_blueprint_table(identifier, http_request)
            assert response == 'mocked_query_result'

    def describe__get_blueprint_table_directly():
        def it_without_where_clause():
            sut._IsiVisualizationBackEnd__parse_request = MagicMock(return_value=None)
            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_blueprint_table_directly('identifier_mock',
                                                                                  'http_request_mock')
            assert response == ('{"error": "Could not determine data set. The query must contain a where clause"}', 500)

        def describe_with_where_clause():
            class DatabaseMock:

                def __init__(self):
                    self.passed_query = None
                    self.where_clause = None

                def query(self, query, where_clause):
                    self.passed_query = query
                    self.where_clause = where_clause
                    return 'mocked_query_result'

            def it_with_data_set():
                where_clause_mock = {'data_set': 'geo'}
                sut._IsiVisualizationBackEnd__parse_request = MagicMock(return_value=where_clause_mock)

                mocked_database = DatabaseMock()
                sut._IsiVisualizationBackEnd__database = mocked_database
                # noinspection PyProtectedMember
                response = sut._IsiVisualizationBackEnd__get_blueprint_table_directly('identifier_mock',
                                                                                      'http_request_mock')

                assert response == 'mocked_query_result'

            @patch('builtins.print')
            def it_without_data_set(mocked_print):
                where_clause_mock = {'query_parameter': 'value'}
                sut._IsiVisualizationBackEnd__parse_request = MagicMock(return_value=where_clause_mock)
                # noinspection PyProtectedMember
                response = sut._IsiVisualizationBackEnd__get_blueprint_table_directly('identifier_mock',
                                                                                      'http_request_mock')
                expected_message = '{"error": "Could not determine data set. The query string must contain the name' + \
                                   ' of the data set, e.g. ?data_set=\"geo\"."}'

                assert mocked_print.mock_calls == [call(expected_message)]
                assert response == (expected_message, 500)

        @patch('builtins.print')
        def it_with_error(mocked_print):
            def __parse_request_mock(http_request):
                raise Exception('Parse error')

            sut._IsiVisualizationBackEnd__parse_request = __parse_request_mock
            # noinspection PyProtectedMember
            response = sut._IsiVisualizationBackEnd__get_blueprint_table_directly('identifier_mock',
                                                                                  'http_request_mock')
            expected_message = '{"error": "Could not get data with request http_request_mock\nParse error"}'

            assert mocked_print.mock_calls == [call(expected_message)]
            assert response == (expected_message, 500)

    def describe__empty_cache_if_is_full():
        def it_cache_is_full():
            cache = {}
            for index in range(0, 110):
                cache['key' + str(index)] = 'foo'
            sut._IsiVisualizationBackEnd__cache = cache
            # noinspection PyProtectedMember
            sut._IsiVisualizationBackEnd__empty_cache_if_is_full()

            assert len(sut._IsiVisualizationBackEnd__cache.keys()) == 0

        def it_cache_is_not_full():
            # noinspection PyProtectedMember
            sut._IsiVisualizationBackEnd__cache['key'] = 'foo'
            # noinspection PyProtectedMember
            sut._IsiVisualizationBackEnd__empty_cache_if_is_full()
            # noinspection PyProtectedMember
            assert sut._IsiVisualizationBackEnd__cache['key'] == 'foo'

    def it__parse_request():
        class HttpRequestMock:
            query_string = b'data_set="geo";query_parameter="value"'

        http_request_mock = HttpRequestMock()
        # noinspection PyProtectedMember
        where_clause = sut._IsiVisualizationBackEnd__parse_request(http_request_mock)
        assert where_clause['data_set'] == '"geo"'
        assert where_clause['query_parameter'] == '"value"'

    def it__request_to_table_string():
        class HttpRequestMock:
            query_string = b'%5B%5B%22Content%22%5D%5D'
        http_request_mock = HttpRequestMock()
        # noinspection PyProtectedMember
        table_string = sut._IsiVisualizationBackEnd__request_to_table_string(http_request_mock)
        assert table_string == '[["Content"]]'

    def describe__handle_internal_server_error():
        @patch('builtins.print')
        def it_with_internal_error(mocked_print):
            class MyException:
                original_exception = 'exception_mock'

            mocked_error = MyException()
            # noinspection PyProtectedMember
            response = IsiVisualizationBackEnd._IsiVisualizationBackEnd__handle_internal_server_error(mocked_error)
            assert mocked_print.mock_calls == [call('Internal server error\nexception_mock')]

        @patch('builtins.print')
        def it_without_internal_error(mocked_print):
            # noinspection PyProtectedMember
            response = IsiVisualizationBackEnd._IsiVisualizationBackEnd__handle_internal_server_error('mocked_error')
            assert mocked_print.mock_calls == [call('Internal server error')]

    def it__handle_exception():
        mocked_exception = HTTPException('my exception')
        # noinspection PyProtectedMember
        response = IsiVisualizationBackEnd._IsiVisualizationBackEnd__handle_exception(mocked_exception)
        assert response.content_type == 'application/json'
        json_obj = json.loads(response.data)

        assert json_obj['code'] is None
        assert json_obj['name'] == 'Unknown Error'
        assert json_obj['description'] == 'my exception'

    @patch('builtins.print')
    def it__handle_500(mocked_print):
        # noinspection PyProtectedMember
        response = IsiVisualizationBackEnd._IsiVisualizationBackEnd__handle_500('mocked_error')
        assert response == 'Internal server error 500:mocked_error'
        assert mocked_print.mock_calls == [call('Internal server error 500:', 'mocked_error')]
