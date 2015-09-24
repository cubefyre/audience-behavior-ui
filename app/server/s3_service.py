# Author - Jitender Aswani
# May 2015
# Python base Audience Behavior REST Server
# SparklineData, Inc. -- http://www.sparklinedata.com/
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

import os, requests, boto, json
from boto.s3.connection import S3Connection


from env_config import ENV

import logging
log = logging.getLogger(__name__)
log.setLevel("DEBUG")

#
# S3 class and methods to read json, text and csv files
# 
class S3FileReader:

	def download_file_from_s3(self, what_file, local_file_path, file_url):
		log.debug("Starting download for file %s " % what_file)
		try:
			response = requests.get(file_url, stream=True)
			if response.status_code == 200:
				
				if not os.path.exists(os.path.dirname(local_file_path)):
					os.makedirs(os.path.dirname(local_file_path))
				with open(local_file_path, 'wb') as file_handle:
					for block in response.iter_content(chunk_size=1024): 
						if not block:
							break
						file_handle.write(block)
						file_handle.flush()
		except Exception, e:
			log.exception(e)	

#
# S3 class to list contents of buckets and more
#	

class S3Service:

	def __init__(self, aws_access_key, aws_secret_key):
		self.s3 = S3Connection(aws_access_key, aws_secret_key)
		#self.s3 = boto.connect_s3()

	def list_folders(self, events_root_bucket_name):
		#events_root_bucket = self.s3.get_bucket(bucket_name)
		#return [key.name.encode('utf-8')[:-1] for key in events_root_bucket.list()]
		events_root_bucket = self.s3.get_bucket(events_root_bucket_name)
		return set([os.path.dirname(key.name.encode('utf-8')) for key in events_root_bucket.list()])
		#return set(["/".join(key.name.encode('utf-8').split("/")[:-1]) for key in events_root_bucket.list()])

	def get_estimated_size_of_daily_bucket(self, events_root_bucket_name, example_daly_folder=None):
		events_root_bucket = self.s3.get_bucket(events_root_bucket_name)
		#daily_events_file_list = events_root_bucket.list(prefix=example_daly_folder)
		daily_events_file_list = events_root_bucket.list()
		size = 0
		for key in daily_events_file_list:
			size += key.size
		return "%.3f GB" % (size*1.0/1024/1024/1024)

	def read_sample_file_from_daily_bucket(self, events_root_bucket_name, example_daly_folder=None, lines=10):
		size_of_bucket = self.get_estimated_size_of_daily_bucket(events_root_bucket_name)

		events_root_bucket = self.s3.get_bucket(events_root_bucket_name)
		#daily_events_file_list = events_root_bucket.get_all_keys(prefix=example_daly_folder, max_keys=1)
		daily_events_file_list = events_root_bucket.get_all_keys(max_keys=1)
		sample_file_name =  daily_events_file_list[0].name.encode('utf-8')
		folder_name = os.path.dirname(sample_file_name)
		#print sample_file_name
		sample_file_content = daily_events_file_list[0].get_contents_as_string(encoding="utf-8").splitlines()[:lines]
		return {'sample_file_name': sample_file_name, 'folder_name': folder_name, "size_of_bucket":size_of_bucket, 
		'sample_file_content':[json.loads(line) for line in sample_file_content] }



if  __name__ =='__main__':
	AWS_SECRET_ACCESS_KEY="unTfzEA33cY5AXK4+JqFZdBXEBqH+XenHURADlkr"
	AWS_ACCESS_KEY_ID="AKIAIOVG3I235W5NVR4A"
	s3 = S3Service(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY)
	#print s3.list_folders("yahoo-photos-event-logs")
	#print s3.get_estimated_size_of_daily_bucket("yahoo-photos-event-logs", "dt=2014-01-01")
	#print s3.read_sample_file_from_daily_bucket("yahoo-photos-event-logs", "dt=2014-01-01")
	print json.dumps(s3.read_sample_file_from_daily_bucket("yahoo-photos-event-logs"))
	
	#s3 = S3FileReader()
	'''with open('vertex.csv', 'wb') as handle:
		response = requests.get('https://s3-us-west-1.amazonaws.com/graphsql-testdrive/jitender/twitter/random_name_vertices.csv', stream=True)
		#print response
		#print response.encoding
		#print response.headers['content-type']
		if response.status_code == 200:
			for block in response.iter_content(1024):
				if not block:
					break
				handle.write(block)
	'''
	#s3.download_file_from_s3('https://s3-us-west-1.amazonaws.com/graphsql-testdrive/jitender/twitter/random_name_vertices.csv')
