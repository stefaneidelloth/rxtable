import pytest
from mock import patch, MagicMock
import pandas

# noinspection PyUnresolvedReferences
from database import Database

sut = None

@pytest.fixture(autouse=True)
def before_each():
    global sut
    sut = Database('database_path_mock')
    yield

def describe_query():

    @patch('sqlite3.connect', MagicMock(return_value=MagicMock()))
    @patch('pandas.read_sql_query', MagicMock(return_value=pandas.DataFrame({'id': []})))
    def it_empty():
        sut.append_where_clause = MagicMock(return_value='SELECT * FROM table WHERE 1')
        result = sut.query('SELECT * FROM table', 'where_clause_mock')
        assert result == '[]'

    @patch('sqlite3.connect', MagicMock(return_value=MagicMock()))
    @patch('pandas.read_sql_query', MagicMock(return_value=pandas.DataFrame({'id': [1, 2, 3]})))
    def it_filled():
        sut.append_where_clause = MagicMock(return_value='SELECT * FROM table WHERE 1')
        result = sut.query('SELECT * FROM table', 'where_clause_mock')
        assert result == '[{"id":1},{"id":2},{"id":3}]'

    @patch('sqlite3.connect', 'invalid_connection')
    @patch('pandas.read_sql_query', MagicMock(return_value=pandas.DataFrame({'id': [1, 2, 3]})))
    def it_error():
        sut.append_where_clause = MagicMock(return_value='SELECT * FROM table WHERE 1')
        result = sut.query('SELECT * FROM table', 'where_clause_mock')
        assert result == '[]'

def describe_append_where_clause():

    def it_without_where_clause():
        query = sut.append_where_clause('SELECT * FROM table', None)
        assert query == 'SELECT * FROM table'

    def it_empty_where_clause():
        query = sut.append_where_clause('SELECT * FROM table', {})
        assert query == 'SELECT * FROM table'

    def it_normal_usage():
        query = sut.append_where_clause('SELECT * FROM table', {'id': '3', 'type': 'min'})
        assert query == 'SELECT * FROM table WHERE id=3 AND type=min' or \
            query == 'SELECT * FROM table WHERE type=min AND id=3'
