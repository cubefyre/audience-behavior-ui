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

import os, logging, fnmatch, shutil, json
from types import *
from datetime import datetime
from pymongo import MongoClient
from bson.objectid import ObjectId
from bson import json_util

from env_config import ENV

# $ mongoimport --port 19981 -d mp_data -c event_logs data/events_raw_data.json 
#start the logger
log = logging.getLogger(__name__)
log.setLevel("DEBUG")

mongo_db = ENV["mongo_db"]
#
# parent class
#
class DBService(object):

	def __init__(self):
		try:
			self.client = MongoClient(mongo_db["server"], mongo_db["port"])
			self.db = self.client[mongo_db["db"]]
		except Exception, e:
			log.exception(e) 

#
# db service for handing user interactions
#

class UserDBService(DBService):

	def __init__(self):
		super(UserDBService, self).__init__()
		self.user_coln = self.db['users']
		self.user_segments = self.db['segments']
		self.user_funnels = self.db['funnels']
		self.sg_db = SegmentDBService()
		self.fl_db = FunnelDBService()


	#
	# get user
	#
	def get_user(self, email, password=None):
		try:
			user = self.user_coln.find_one({"email": email})
			if user is not None:
				return user
		except Exception, e:
		    log.exception(e)

	#
	# insert a user
	#
	def insert_user(self, email, password="awesome"):

		try:
			user = {"email": email, 
				"password": password, 
				'member_since': datetime.utcnow(),
				'last_login': datetime.utcnow(),
				'segments':[],
				'funnels':[],
				'display_name': email[:email.find("@")]
				}
			user_id = self.user_coln.insert(user)
			return str(user_id)
			#users.update({'_id': user_email}, user, {upsert:true})
		except Exception, e:
			log.exception(e) 

	#
	# update user home
	#
	def update_user_field(self, email, field_id, field_value):
		try:
			user = self.user_coln.find_one({"email": email})
			user[field_id] = field_value
			self.user_coln.save(user)
		except Exception, e:
		    log.exception(e)		
	
	#
	# check if user exists
	#
	def check_user_exists(self, email, password=None):
		log.debug("Entered for email %s" % email ) 			
		user = self.get_user(email, password)
		user_exists = False;
		if user is not None:
			if password is None:
				user_exists = True 
			else:
				user_exists = True if user["password"] == password else False

		log.debug("Exiting with %s" % user_exists ) 			
		return user_exists

	#
	# Get user attribute
	#
	def get_user_field(self, email, field_id):
		try:
			user = self.get_user(email)
			if user is not None:
				if isinstance(user[field_id], datetime.datetime):
					return str(user[field_id].isoformat())
				elif isinstance(user[field_id], ObjectId):
					return str(user[field_id])				
				else:
					return user[field_id]
		except Exception, e:
		    log.exception(e)

	
	#
	# add segment to the user's list
	#
	def add_segment(self, email, segment):
		log.debug("Entered for user %s" % email)			
		segment_id = self.sg_db.insert_segment(segment)
		user = self.get_user(email)
		user["segments"].append({"segment_id": segment_id, "segment_name": segment["name"]})
		self.user_coln.save(user)
		#if segments and not any(sg['segment_id'] == segment_id for sg in segments):
		log.debug("Exiting") 			
		return segment_id
		
	#
	# update segment
	#
	def update_segment(self, email, segment):
		print segment
	
	#
	# get segments
	#
	def get_segments(self, email):
		try:
			user = self.get_user(email)
			if user is not None:
				return user["segments"]
		except Exception, e:
		    log.exception(e)	

	#
	# remove segment
	#
	def remove_segment(self, email, segment_id):
		log.debug("Entered for user %s to remove segment %s " % (email, segment_id))			
		if self.sg_db.remove_segment(segment_id):
			user = self.get_user(email)
			segments = [sg for sg in user["segments"] if not sg['segment_id'] == segment_id]
			user["segments"] = segments
			self.user_coln.save(user)
		log.debug("Exiting") 			
	
	#
	# remove all
	#
	def remove_all_segments(self, email):
		log.debug("Entered for user %s to remove all segments " % email)			
		user = self.get_user(email)
		for seg in user["segments"]:
			self.sg_db.remove_segment(seg['segment_id'])
		user["segments"] = []
		self.user_coln.save(user)
		log.debug("Exiting") 

	#
	# get count
	#
	def get_segment_count(self, email):
		try:
			return len(self.get_segments(email))
		except Exception, e:
		    log.exception(e)

	#
	# add funnel to the user's list
	#
	def add_funnel(self, email, funnel):
		log.debug("Entered for user %s" % email)			
		funnel_id = self.fl_db.insert_funnel(funnel)

		user = self.get_user(email)
		user["funnels"].append({"funnel_id": funnel_id, "funnel_name": funnel["name"]})
		self.user_coln.save(user)
		#if funnels and not any(sg['funnel_id'] == funnel_id for sg in funnels):
		log.debug("Exiting") 			
		return funnel_id
		
	#
	# update funnel
	#
	def update_funnel(self, email, funnel):
		print funnel
	
	#
	# get funnels
	#
	def get_funnels(self, email):
		try:
			user = self.get_user(email)
			if user is not None:
				return user["funnels"]
		except Exception, e:
		    log.exception(e)	

	#
	# remove funnel
	#
	def remove_funnel(self, email, funnel_id):
		log.debug("Entered for user %s to remove funnel %s " % (email, funnel_id))			
		if self.fl_db.remove_funnel(funnel_id):
			user = self.get_user(email)
			funnels = [fl for fl in user["funnels"] if not fl['funnel_id'] == funnel_id]
			user["funnels"] = funnels
			self.user_coln.save(user)
		log.debug("Exiting") 			

	#
	# remove all
	#
	def remove_all_funnels(self, email):
		log.debug("Entered for user %s to remove all funnels " % email)			
		user = self.get_user(email)
		for fl in user["funnels"]:
			self.fl_db.remove_funnel(fl['funnel_id'])
		user["funnels"] = []
		self.user_coln.save(user)
		log.debug("Exiting") 			


	#
	# get count
	#
	def get_funnel_count(self, email):
		try:
			return len(self.get_funnels(email))
		except Exception, e:
		    log.exception(e)
	#
	# remove a user
	#
	def remove_user(self, email):
		try:
			user_id = self.get_user_field(email, "_id")
			#remove segments
			user = self.get_user(email)
			for segment in user["segments"]:
				self.user_segments.remove_segment(segment["segment_id"])
			# remove funnels
			for funnel in user["funnels"]:
				self.user_funnels.remove_funnel(funnel["funnel_id"])
			# remove profile
			self.user_coln.remove({"email": email})
		except Exception, e:
			log.exception(e) 

#
# db service for handling segments
#
class SegmentDBService(DBService):

	def __init__(self):
		super(SegmentDBService, self).__init__()
		self.segment_coln = self.db['segments']

	def insert_segment(self, segment):
		segment["stats"] = {}
		segment["created_on"] = segment["stats"]["last_run"] = datetime.utcnow()
		try:
			segment_id = self.segment_coln.insert(segment)
		except Exception, e:
		    log.exception(e)
		return str(segment_id)	

	def get_segment(self, segment_id):
		try:
			self.update_segment_stats(segment_id)
			gs = self.segment_coln.find_one({"_id": ObjectId(segment_id)})
			return gs
		except Exception, e:
		    log.exception(e)

	def update_segment(self, segment_id, field_id, field_value):
		try:
			sg = self.segment_coln.find_one({"_id": ObjectId(segment_id)})
			sg[field_id] = field_value
			self.segment_coln.save(sg)
		except Exception, e:
		    log.exception(e)

	def remove_segment(self, segment_id):
		try:
			self.segment_coln.remove({"_id": ObjectId(segment_id)})
			return True
		except Exception, e:
		    log.exception(e)
		    return False

	def clear_segments_colln(self):
		print self.segment_coln.remove()

	def update_segment_stats(self, segment_id):
		try:
			self.segment_coln.update({'_id':ObjectId(segment_id)},
				{'$inc':{'stats.times_run': 1}, '$set':{'stats.last_run':datetime.datetime.utcnow()}},
				upsert=False, multi=False)
		except Exception, e:
		    log.exception(e)

	def count_segmetns(self):
		try:
			return self.segment_coln.count()
		except Exception, e:
		    log.exception(e)	

#
# db service for handling funnels
#
class FunnelDBService(DBService):

	def __init__(self):
		super(FunnelDBService, self).__init__()
		self.funnel_coln = self.db['funnels']

	def insert_funnel(self, funnel):
		funnel["stats"] = {}
		funnel["created_on"] = funnel["stats"]["last_run"] = datetime.utcnow()
		try:
			funnel_id = self.funnel_coln.insert(funnel)
		except Exception, e:
		    log.exception(e)
		return str(funnel_id)	

	def get_funnel(self, funnel_id):
		try:
			self.update_funnel_stats(funnel_id)
			gs = self.funnel_coln.find_one({"_id": ObjectId(funnel_id)})
			return gs
		except Exception, e:
		    log.exception(e)

	def update_funnel(self, funnel_id, field_id, field_value):
		try:
			sg = self.funnel_coln.find_one({"_id": ObjectId(funnel_id)})
			sg[field_id] = field_value
			self.funnel_coln.save(sg)
		except Exception, e:
		    log.exception(e)

	def remove_funnel(self, funnel_id):
		try:
			self.funnel_coln.remove({"_id": ObjectId(funnel_id)})
			return True
		except Exception, e:
		    log.exception(e)
		    return False

	def clear_funnels_colln(self):
		print self.funnel_coln.remove()

	def update_funnel_stats(self, funnel_id):
		try:
			self.funnel_coln.update({'_id':ObjectId(funnel_id)},
				{'$inc':{'stats.times_run': 1}, '$set':{'stats.last_run':datetime.datetime.utcnow()}},
				upsert=False, multi=False)
		except Exception, e:
		    log.exception(e)

	def count_funnels(self):
		try:
			return self.funnel_coln.count()
		except Exception, e:
		    log.exception(e)	



#
# db service for handling raw Event logs
#
class EventLogService(DBService):

	def __init__(self):
		super(EventLogService, self).__init__()
		self.event_logs_col = self.db['event_logs']

	#
	# insert an event log
	#
	def insert_event_log(self, event_log):

		try:
			self.event_logs_col.insert(event_log)
		except Exception, e:
			log.exception(e) 

	#
	# count collection
	#
	def count_event_logs(self):
		try:
			return self.event_logs_col.count()
		except Exception, e:
		    log.exception(e)

	#
	# get distinct value
	#	
	def distinct_value(self, field):
		try:
			return self.event_logs_col.distinct(field)
		except Exception, e:
		    log.exception(e)

	#
	# insert iso date
	#
	def update_event_log(self):
		try:
			for doc in self.event_logs_col.find():
				self.event_logs_col.update({"_id":doc["_id"]}, 
					{ "$set":{"properties.event_date":datetime.utcfromtimestamp(doc["properties"]["time"])}}, 
					upsert=False, multi=False)
		except Exception, e:
		    log.exception(e)

#
# clean collections in mongo
#
def clean_collections():
	client = MongoClient(mongo_db["server"], mongo_db["port"])
	db = client[mongo_db["db"]]
	el_coln = db['event_logs']
	# clean up
	print el_coln.remove()


if __name__ == '__main__':
	user = UserDBService()
	user_id = "jitender@sparklinedata.com"
	'''
	print user.get_funnels(user_id)
	print user.get_segments(user_id)

	print user.remove_all_funnels(user_id)
	print user.remove_all_segments(user_id)

	print user.get_funnel_count(user_id)
	print user.get_segment_count(user_id)
	'''
	# user related
	'''
	if not user.check_user_exists(user_id):
		user.insert_user(user_id)
	print user.get_user("jitender@sparklinedata.com")
	'''

	# segments related
	'''
	segment_id = user.add_segment(user_id, {"name": "my fourth segment"})
	print user.get_segments(user_id)
	print segment_id
	print user.remove_segment(user_id, "552843937ded40180eea1047")
	'''

	# funnels
	'''
	#funnel_id = user.add_funnel(user_id, {"name": "my first funnel"})
	print user.get_funnels(user_id)
	print user.remove_funnel(user_id, "55284e877ded401924917693")

	funnels = FunnelDBService()	
	print funnels.count_funnels()
	'''

	'''
	clean_collections()
	el_service = EventLogService()
	
	# Read the directory and dump all the files in mongo
	data_path = ENV["data_path"]
	for dirpath, dirs, files in os.walk(data_path["event_logs"]):
		for filename in fnmatch.filter(files, '*.json'):
			#print os.path.join(dirpath, filename)
			with open(os.path.join(dirpath, filename)) as f:
				for event_log in f:
					el_service.insert_event_log(json.loads(event_log))
	'''
	'''
	#el_service.update_event_log()
	#print el_service.count_event_logs()
	#fields = ["browser","device","initial_referrer","initial_referring_domain","os","screen_height","screen_width","mp_country_code","search_engine","referrer","referring_domain","region"]
	fields = ["browser","device","os","screen_height","screen_width","mp_country_code","search_engine","referring_domain","region"]
	user_dimensons = [] 	
	#str_operators = ["equals","does not equal","contains","does not contain","is set","is not set"]
	str_operators = [{"op_label": "equals", "op_value": "=="},
		{"op_label": "does not equal" , "op_value": "!="} ,
		{"op_label": "contains", "op_value": "in"},{"op_label":"does not contain", "op_value": "not in"}]
	#int_opeators = ["in between","less than","equal to","greater than"]			
	int_opeators = [{"op_label": "in between","op_value": "=="},
		{"op_label": "less than","op_value": "<"},
		{"op_label": "equal to","op_value": "=="}
		,{"op_label": "greater than","op_value": ">"}]			
	for i, field in enumerate(fields):
		if field != "mp_country_code":
			f = ("").join(["properties.", "$", field])
			dim_name = ("").join(["$", field])
		else:
			f = ("").join(["properties.", field])
			dim_name = field
		values = el_service.distinct_value(f)
		dim_ops = str_operators
		dim_type = "string"
		if type(values[0]) is IntType:
			dim_type = "integer"
			dim_ops = int_opeators
		#dim_type = type(values[0]).__name__, 
		dim = {"dim_label": field.title(),
				"dim_name":  dim_name,
				"dim_id":i, 
				"data_type":dim_type,
				"dim_val":values,
				"is_range":False,
				"dim_operators":dim_ops
				}
		user_dimensons.append(dim)
	print user_dimensons
	'''