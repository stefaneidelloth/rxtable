import pytest
from mock import patch, MagicMock
import pandas
# noinspection PyUnresolvedReferences
from geo_processing import GeoProcessing

sut = None


def describe_address_to_coordinates():
    def it_normal_usage():
        assert 1 == 1
        # TODO
        # address_input = []
        # address = GeoProcessing.calculate_distances(address_input)
        # assert address == ''


def describe_calculate_distances():
    def it_normal_usage():
        assert 1 == 1
        # TODO
        # address_input = []
        # address = GeoProcessing.calculate_distances(address_input)
        # assert address == ''


def describe_merge_addresses():
    def it_normal_usage():
        assert 1 == 1
        # TODO
        # address_input = []
        # address = GeoProcessing.calculate_distances(address_input)
        # assert address == ''


def describe__haversine():
    def it_normal_usage():
        lon1 = 0
        lat1 = 10
        lon2 = 0
        lat2 = 20
        # noinspection PyProtectedMember
        result = GeoProcessing._GeoProcessing__haversine(lon1, lat1, lon2, lat2)
        assert result == 1111.221976576174
