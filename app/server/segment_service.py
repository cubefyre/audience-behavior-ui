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
import datetime
import analytics
from analytics import Client
       
from env_config import ENV

log = logging.getLogger(__name__)
log.setLevel("DEBUG")


#
# Segment service for handling raw Event logs
#
class SegmentEventService():
    def __init__(self):
        self.segment = Client(ENV["segment"]["write_key"], 
            debug=True, on_error=self.on_error, send=True, max_queue_size=100000)
        '''
        analytics.write_key = ENV["segment"]["write_key"]
        analytics.debug = True
        analytics.on_error = self.on_error
        '''

    def on_error(self, error, items):
        print("An error occurred:", error)

    #
    # insert an event log
    #
    def insert_event(self, event_log):
        try:
            #print "%s did event %s " % (event_log["anonymousId"], event_log["event"])
            #analytics.track(event_log["userId"], event_log["event"], {}, 
            self.segment.track(event_log["userId"], event_log["event"], {}, 
                event_log["context"], event_log["timestamp"], event_log["anonymousId"],
                event_log["integrations"])
        except Exception, e:
            log.exception(e) 


#
# Read the log directory and dump all the files in keen
#
def load_event_logs():
    segment_service = SegmentEventService()
    data_path = ENV["data_path"]
    print data_path
    for dirpath, dirs, files in os.walk(data_path["event_logs"]):
        for filename in fnmatch.filter(files, '*.json'):
            #print os.path.join(dirpath, filename)
            with open(os.path.join(dirpath, filename)) as f:
                for event_log in f:
                    event_log = json.loads(event_log)   #transform the string to JSON object
                    segment_service.insert_event(transform_mp_event(event_log))  #insert event into "event" collection

#
# transform mp to segment
#
def transform_mp_event(event_log):
    transformed_el = {
     "anonymousId": event_log["properties"]["distinct_id"],
     "event":event_log["event"],
      "context": {
        "library": {
          "name": "mp_lib_%s" % event_log["properties"].get("mp_lib"),
          "version": event_log["properties"].get("$lib_version")
        },  
        "ip": None,
        "referrer": {
          "url": event_log["properties"].get("$initial_referring_domain"),
          "domain": event_log["properties"].get("$initial_referring_domain"),
          "name": event_log["properties"].get("$search_engine")
        },
        'os':{
          "name": event_log["properties"].get("$os"),
          "version": None
        },
        "screen":{
            "height":event_log["properties"].get("$screen_height"),
            "width":event_log["properties"].get("$screen_width")
        },
        "location":{
          "city":event_log["properties"].get("$city"),
          "region":event_log["properties"].get("$region"),
          "country":event_log["properties"].get("mp_country_code"),
        },
        "userAgent": event_log["properties"].get("$browser")

      },
        "integrations": {
            "All": False,
            "Amazon S3": True
          },      
      "timestamp": datetime.datetime.fromtimestamp(event_log["properties"].get("time")), #"%sZ" % str(datetime.datetime.fromtimestamp(event_log["properties"].get("time")).isoformat('T')),
      "userId": None
    }
    return transformed_el


if __name__ == '__main__':
    for i in range(100):
        print "iteration %d" % i
        load_event_logs()


