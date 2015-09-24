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

import os, datetime, shutil, itertools, csv, json, jwt, logging
from mongo_service import UserDBService
import util

from env_config import ENV
#start the logger
log = logging.getLogger(__name__)
log.setLevel("DEBUG")

class UserService:

	def __init__(self):
		try:
			self.user_db = UserDBService()
		except Exception, e:
			log.exception(e) 

    #
    # Login user 
    #
	def login_user(self, email, password="awesome"):
		log.debug("Entered with password %s for email %s" % (password, email) ) 			
		response_message = {}
		if self.user_db.check_user_exists(email, password):
			log.debug("User Exists")
			self.user_db.update_user_field(email, "last_login", datetime.datetime.utcnow())
			
			response_message["error"] = False 
			response_message["message"] = "Valid email and developer password." 
			
			# Genereate JWT Token
			log.debug("Generating JWT token")
			token = util.encode_jwt_token({"email": email}) 
			#jwt.encode({"password": password, "email": email}, "GreenTeaLeaves")
			response_message["token"] = token
		else: 
			response_message["error"] = True 
			response_message["message"] = "Invalid email or developer password." 
		log.debug("Exiting with response: %s" % response_message) 			
		return response_message

   	#
    # Get segments
    #
	def get_segments(self, email):
		return self.user_db.get_segments(email)

	#
    # update segments
    #
	def update_segment(self, email, segment):
		return self.user_db.update_segment(email, segment)

	#
	# Add a segment
	#
	def add_segment(self, email, segment):
		log.debug("Entered with segment %s for user %s" % (segment["name"], email) ) 			
		response_message = {}
		self.user_db.add_segment(email, segment)
		response_message["error"] = False 
		response_message["message"] = "segment added."
		response_message["segments"] = self.user_db.get_segments(email)
		log.debug("Exiting for email %s" % email) 			
		return response_message

	#
	# remove a segment
	#
	def remove_segment(self, email, segment_id):
		log.debug("Entered with segment %s for user %s" % (segment_id, email) ) 			
		response_message = {}
		self.user_db.remove_segment(email, segment)
		response_message["error"] = False 
		response_message["message"] = "segment added."
		response_message["segments"] = self.user_db.get_segments(email)
		log.debug("Exiting for email %s" % email) 			
		return response_message


	#
    # Get funnels
    #
	def get_funnels(self, email):
		return self.user_db.get_funnels(email)

	#
    # update funnels
    #
	def update_funnel(self, email, funnel):
		return self.user_db.update_funnel(email, funnel)

	#
	# Add a funnel
	#
	def add_funnel(self, email, funnel):
		log.debug("Entered with funnel %s for user %s" % (funnel["name"], email) ) 			
		response_message = {}
		self.user_db.add_funnel(email, funnel)
		response_message["error"] = False 
		response_message["message"] = "funnel added."
		response_message["funnels"] = self.user_db.get_funnels(email)
		log.debug("Exiting for email %s" % email) 			
		return response_message

	#
	# remove a funnel
	#
	def remove_funnel(self, email, funnel_id):
		log.debug("Entered with funnel %s for user %s" % (funnel_id, email) ) 			
		response_message = {}
		self.user_db.remove_funnel(email, funnel_id)
		response_message["error"] = False 
		response_message["message"] = "funnel added."
		response_message["funnels"] = self.user_db.get_funnels(email)
		log.debug("Exiting for email %s" % email) 			
		return response_message


if  __name__ =='__main__':
	user = UserService()
	user_id = "info@app.com"
	#print user.login_user(user_id)
	#print user.add_segment(user_id, {"name": "my new segment"})
	#print user.get_segments(user_id)
	#user.add_funnel(user_id, {"name": "my first funnel"})
	#print user.get_funnels(user_id)
	#print user.remove_funnel(user_id, '55284fbc7ded40194b5f07dd')