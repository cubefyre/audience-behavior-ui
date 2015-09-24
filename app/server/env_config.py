# Author - Jitender Aswani
# May 2015
# SparklineData, Inc. -- http://www.sparklinedata.com/
#
# Python base Audience Behavior REST Server
#
# Copyright 2014-2015 SparklineData, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# Credit - http://eric.themoritzfamily.com/learning-python-logging.html
import logging.config
import os.path
import socket

LOGGING_CONF=os.path.join(os.path.dirname(__file__), "logging.ini")
logging.config.fileConfig(LOGGING_CONF)


HOST = socket.gethostname()

if HOST == "MacBook.local":
	ENV = {
		"home": "/server",
		"mongo_db_host":"localhost"
	}
else: # localhost settings
	ENV = {
		"home": "/data/server",
		"mongo_db_host":"192.168.12.16"
	}

ENV["data_path"] = { 
	"event_logs": "/".join([ENV["home"], "data"])
}

ENV["mp"] = {
    "token": "YOUR_TOKEN", 
    "api_key": "YOUR_API",
    "api_secret": "YOUR_SECRET",
}

ENV["segment"] = {
	"write_key": "YOUR_SEGMENT_KEY"
}

ENV["keen"] = {
	"project_id": "YOUR_PROJECT",
	"write_key": "YOUR_KEY",
	"read_key": "YOUR_KEY",
	"master_key": "MASTER_KEY"
}

ENV["server"] = {
	"port": 19980
}

ENV["mongo_db"] = {
	"server":ENV["mongo_db_host"],
	"port": 19981,
	"db": "sparky"
}

ENV["SALT"] = "WeLoveIt"
