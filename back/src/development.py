import os

class Development(object):

    @staticmethod
    def open_browser(url):
        chrome_path = "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe"
        if os.path.isfile(chrome_path):
            print('Opening browser at ' + url)
            # list of chrome command line switches:
            # https://peter.sh/experiments/chromium-command-line-switches/
            # in order to disable caching we use a non-existing disk-cache-dir, also see
            # https://stackoverflow.com/questions/40314005/command-line-flag-to-disable-all-types-of-caches-in-chrome
            command = 'start "chrome" "' + chrome_path + \
                      '" --auto-open-devtools-for-tabs --disk-cache-dir=/dev/null ' + url
            os.system(command)
        else:
            print('Could not open browser for development session. (Which is fine if this runs on the server). ')
