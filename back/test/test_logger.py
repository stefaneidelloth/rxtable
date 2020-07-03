import pytest
from mock import patch, MagicMock, call
from logger import Logger

sut = None

@pytest.fixture(autouse=True)
def before_each():
    global sut
    sut = Logger(is_active=True)
    yield

def describe_construction():

    def it_protected_attributes():
        assert sut._Logger__is_active == True
        assert sut._Logger__start_time == 0

def describe_public_api():

    def describe_start_timer():

        def it_active():
            sut.current_time_in_ms = MagicMock(return_value=66)
            sut.start_timer()
            assert sut._Logger__start_time == 66

        def it_inactive():
            sut._Logger__is_active = False
            sut.start_timer()
            assert sut._Logger__start_time == 0

    def describe_info_elapsed_time():

        @patch('builtins.print')
        def it_active(mocked_print):
            sut._Logger__start_time = 10
            sut.current_time_in_ms = MagicMock(return_value=30)
            sut.info_elapsed_time('foo')
            assert mocked_print.mock_calls == [call('foo20 ms')]

        @patch('builtins.print')
        def it_inactive(mocked_print):
            sut._Logger__is_active = False
            sut.info_elapsed_time('foo')
            assert mocked_print.mock_calls == []

    def describe_info():

        @patch('builtins.print')
        def it_active(mocked_print):
            sut.info('foo')
            assert mocked_print.mock_calls == [call('foo')]

        @patch('builtins.print')
        def it_inactive(mocked_print):
            sut._Logger__is_active = False
            sut.info('foo')
            assert mocked_print.mock_calls == []

    @patch('time.time', MagicMock(return_value=5.123456))
    def it_current_time_in_ms():
        assert Logger.current_time_in_ms() == 5123

