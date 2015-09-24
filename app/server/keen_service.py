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
from datetime import datetime, timedelta



import keen
from keen.client import KeenClient

from env_config import ENV

log = logging.getLogger(__name__)
log.setLevel("DEBUG")


#
# keen service for handling raw Event logs
#
class KeenEventService():
    def __init__(self):
        self.client = KeenClient(
            project_id=ENV["keen"]["project_id"],
            write_key=ENV["keen"]["write_key"],
            read_key=ENV["keen"]["read_key"],
            master_key=ENV["keen"]["master_key"]
        )

    #
    # insert an event log
    #
    def insert_event(self, event_collection, event_log):
        try:
            self.client.add_event(event_collection, event_log)
        except Exception, e:
            log.exception(e) 

    #
    # count event
    # 
    def get_count_data(self, event_collection, distinct=False, timeframe="previous_week"):
        if distinct:
            return self.client.count_unique(event_collection, target_property="distinct_id", 
                timeframe=timeframe)
        else:
            return self.client.count(event_collection, timeframe=timeframe)

    #
    # get key metrics- for now only two metrics are being pulled - count and count_unique
    #
    def get_key_metrics(self, event_collection, timeframe="previous_week"):
        return self.client.multi_analysis(
            event_collection, analyses={ "event_count":{"analysis_type":"count"}, 
                "event_count_unique":{"analysis_type":"count_unique", 
                    "target_property":"distinct_id"}},
            timeframe=timeframe
        )

    #
    # get key metrics- for now only two metrics are being pulled - count and count_unique
    # and filter by device and browser
    #
    def get_key_metrics_w_filters(self, event_collection, timeframe="previous_week"):
        return self.client.multi_analysis(
            event_collection, analyses={ "event_count":{"analysis_type":"count"}, 
                "event_count_unique":{"analysis_type":"count_unique", 
                    "target_property":"distinct_id"}},
            filters=[
                {
                    "property_name" : "$device",
                    "operator" : "contains",
                    "property_value" : "iPhone"
                },
                {
                    "property_name" : "$browser",
                    "operator" : "eq",
                    "property_value" : "Chrome iOS"
                }
            ],
            timeframe=timeframe
        )

    #
    # get key metrics- for now only two metrics are being pulled - count and count_unique
    # and group by an array of properties
    #
    def get_key_metrics_group_by(self, event_collection, group_by_props, timeframe="previous_week"):
        return self.client.multi_analysis(
            event_collection, analyses={ "event_count":{"analysis_type":"count"}, 
                "event_count_unique":{"analysis_type":"count_unique", 
                    "target_property":"distinct_id"}},
            group_by=group_by_props,
            timeframe=timeframe
        )


    #
    # funnel analysis
    #
    def get_funnel_data(self, events_collection, timeframe="previous_week", distinct=True):
        if distinct:
            steps = [{"event_collection": event_collection,"actor_property": "distinct_id"} 
                for event_collection in events_collection]
        else: 
            steps = [{"event_collection": event_collection} 
                for event_collection in events_collection]            
        #print steps
        return self.client.funnel(steps, timeframe=timeframe) # => [2039, 201]        

    #
    # retention analysis by week
    #
    def get_retention_analysis_by_week(self, events_collection, no_of_weeks=4):
        # today's date in UTC
        current_dt = datetime.utcnow()
        current_dt = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
        current_week_start_dt = current_dt - timedelta(days = current_dt.weekday())
        current_week_end_dt = current_week_start_dt + timedelta(days = 6)
        steps = [{"event_collection": event_collection,"actor_property": "distinct_id", 
                    "timeframe": {"start":current_week_start_dt.isoformat('T'), 
                        "end": current_week_end_dt.isoformat('T')}
                } for event_collection in events_collection]
        # Get funnel analysis for last 14 weeks - count the first event in first week and 
        # count the second event from first week to next 14 weeks
        cohorts = []
        for week_no in range(no_of_weeks):
            cohort_start_week = current_week_start_dt - timedelta(weeks=(no_of_weeks-week_no))
            cohort_end_week = cohort_start_week + timedelta(days = 6)
            #print "%s week ago - csw is: %s, cew is: %s" %((no_of_weeks-week_no), 
            #        cohort_start_week.isoformat('T'), cohort_end_week.isoformat('T'))
            # set time frame
            steps[0]["timeframe"]["start"] = cohort_start_week.isoformat('T')
            steps[0]["timeframe"]["end"] = cohort_end_week.isoformat('T')
            
            # lets do the first fetch here itself
            steps[1]["timeframe"]["start"] = cohort_start_week.isoformat('T')
            steps[1]["timeframe"]["end"] = cohort_end_week.isoformat('T')
            response = self.client.funnel(steps) # => [2039, 201] 
            cohort = {"date": cohort_start_week.strftime("%b %d, %Y"), "start_count": response[0], 
                        "retention":[
                            {"period":"week1", 
                                "end_count":response[1], 
                                "ratio": "%.2f%%" % (100 * float(response[1])/float(response[0]))
                            }
                        ]
            }
            for_no_weeks = (no_of_weeks - week_no - 1) # for how many weeks we need to look at the other event
            # now lets go for other weeks
            for for_week in range(for_no_weeks):
                cohort_start_week = current_week_start_dt - timedelta(weeks=(for_no_weeks-for_week))
                cohort_end_week = cohort_start_week + timedelta(days = 6)
                #print "%s week ago - csw is: %s, cew is: %s" %((for_no_weeks-for_week), 
                #    cohort_start_week.isoformat('T'), cohort_end_week.isoformat('T'))
                # set time frame
                steps[1]["timeframe"]["start"] = cohort_start_week.isoformat('T')
                steps[1]["timeframe"]["end"] = cohort_end_week.isoformat('T')
                response = self.client.funnel(steps) # => [2039, 201] 
                cohort["retention"].append({
                        "period":"week%d" % (for_week+2), 
                        "end_count":response[1], 
                        "ratio": "%.2f%%" % (100 * float(response[1])/float(response[0]))
                        #"{:.2%}".format(float(response[1])/float(response[0]))
                        })
            cohorts.append(cohort)
            #print cohort
        return cohorts

#
# Read the log directory and dump all the files in keen
#
def load_event_logs():
    keen_service = KeenEventService()
    data_path = ENV["data_path"]
    for dirpath, dirs, files in os.walk(data_path["event_logs"]):
        for filename in fnmatch.filter(files, '*.json'):
            #print os.path.join(dirpath, filename)
            with open(os.path.join(dirpath, filename)) as f:
                for event_log in f:
                    event_log = json.loads(event_log)   #transform the string to JSON object
                    event_log["properties"]["keen"] = { 
                        "timestamp": str(datetime.datetime.fromtimestamp(event_log["properties"]["time"]).isoformat('T'))
                    }   # overwrite keen timestamp with historical timestamp                   
                    #print str(datetime.datetime.fromtimestamp(event_log["properties"]["time"]).isoformat('T'))
                    keen_service.insert_event(event_log["event"], event_log["properties"])  #insert event into "event" collection

#
# run funnel analysis
#
def run_funnel_analysis():
    events_collection = ["landing page", "request demo page", "thank you"]
    keen_service = KeenEventService()
    print keen_service.get_funnel_data(events_collection, "previous_week", False)

#
# run retention analysis
#
def run_retention_analysis():
    events_collection = ["request demo page", "landing page"]
    keen_service = KeenEventService()
    print keen_service.get_retention_analysis_by_week(events_collection)


#
# Get basic metrics
#
def get_basic_metrics():
    events_collection = ["landing page", "request demo page", "thank you", "company page", "careers page"]
    keen_service = KeenEventService()
    for event_collection in events_collection:
        """
        print "Count and distinct count for event %s are: (%s, %s)" \
            % (event_collection, keen_service.get_count_data(event_collection),
                keen_service.get_count_data(event_collection, True))
        """
        print "For event %s" % event_collection
        
        print "Count and distinct count are: %s)" \
            % keen_service.get_key_metrics(event_collection)
        
        print "Count and distinct count filtered by device and broswer are: %s)" \
            % keen_service.get_key_metrics_w_filters(event_collection)

        print "Count and distinct count grouped by country are: %s)" \
            % keen_service.get_key_metrics_group_by(event_collection, ["mp_country_code"])


if __name__ == '__main__':
    #load_event_logs()
    #run_funnel_analysis()
    #get_basic_metrics()
    run_retention_analysis()


'''
keen.project_id=ENV["keen"].project_id
keen.write_key=ENV["keen"].write_key
keen.read_key=ENV["keen"].read_key
keen.master_key=ENV["keen"].master_key
keen.add_event("sign_ups", {
        "username": "lloyd",
        "referred_by": "harry"
    })
# uploads 4 events total - 2 to the "sign_ups" collection and 2 to the "purchases" collection
keen.add_events({
    "sign_ups": [
        { "username": "nameuser1" },
        { "username": "nameuser2" } 
    ],
    "purchases": [
        { "price": 5 },
        { "price": 6 }
    ]
})
'''


