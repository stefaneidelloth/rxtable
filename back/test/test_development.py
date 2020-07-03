import pytest
from mock import patch, MagicMock, call

# noinspection PyUnresolvedReferences
from development import Development

def describe_open_browser():

    @patch('os.path')
    @patch('os.system')
    @patch('builtins.print')
    def it_chrome_exists(mocked_print, mocked_system, mocked_path):

        mocked_path.isfile = MagicMock(return_value=True)
        Development.open_browser('url_mock')

        assert mocked_print.mock_calls == [call('Opening browser at url_mock')]
        expected_command = 'start "chrome" "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" ' \
                           '--auto-open-devtools-for-tabs --disk-cache-dir=/dev/null url_mock'
        assert mocked_system.mock_calls == [call(expected_command)]

    @patch('os.path')
    @patch('builtins.print')
    def it_chrome_does_not_exist(mocked_print, mocked_path):

        mocked_path.isfile = MagicMock(return_value=False)
        Development.open_browser('url_mock')

        assert mocked_print.mock_calls == [call('Could not open browser for development session. (Which is fine if this runs on the server). ')]
