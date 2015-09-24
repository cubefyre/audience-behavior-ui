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


import os, logging, fnmatch, shutil, json, calendar
from collections import defaultdict, Counter, OrderedDict
from datetime import datetime, timedelta

from mp_lib import Mixpanel
      
from env_config import ENV

#log = logging.getLogger(__name__)
#log.setLevel("DEBUG")


#
# MixPanel service for handling mp APIs
#
class MPService():
    def __init__(self):
        self.mp = Mixpanel(api_key=ENV["mp"]["api_key"], api_secret=ENV["mp"]["api_secret"])
      
    #
    # get list of most common events over the past 31 days
    #
    def get_event_list(self):
        return self.mp.request(['events', 'names'], {'type': 'general', 'limit':5})

    #
    # get Events data
    #
    def get_events_data(self, events, start_date, end_date, unit, event_type, viz="line"):
        interval = (end_date - start_date).days
        today_date = datetime.utcnow()
        # mix panel always returns events data using end_data as today's date
        # diff between the end date requested by app and today's date
        diff = (today_date - end_date).days
        if diff > 0:
          interval = (today_date - start_date).days
        
        interval = self.get_interval(unit, interval)
        
        # call api
        response_data = self.mp.request(['events'], { 
            'event' : events, 'unit' : unit, 
            'interval' : interval, 'type': event_type
        })

        # bit of massaging is needed here to remove extra data
        dates = []

        if diff > 0:  # chop values of
          diff = self.get_interval(unit, diff)
          #dates = response_data["data"]["series"][:-(diff-1)] # remove last n elements
          dates = response_data["data"]["series"][-(diff):] # keep firt elements

        events_data = []
        for event_name in events:
          event_data = response_data["data"]["values"][event_name]
          for d in dates:
            del event_data[d]
          
          # convert date string to time in epoch
          if viz == "line":
            new_event_data = {}
            for event_date, count in event_data.iteritems():
                event_date = (calendar.timegm((datetime.strptime(event_date, '%Y-%m-%d')).timetuple())) * 1000
                new_event_data[event_date] = count
            events_data.append({"name": event_name, "data": sorted(new_event_data.iteritems(), key=lambda x: x[0])})            
          else:
            events_data.append({"name": event_name, "data": sorted(event_data.iteritems(), key=lambda x: x[0])})            
        return events_data

    #
    # Given unit and interval in days, get new value of interval
    #
    def get_interval(self, unit, interval):
      if unit == "hour":
          interval = interval * 24
      elif unit == "week":
          interval = interval // 7 
      elif unit == "month":
          interval = interval // 30
      return interval

    #
    # get list of funnels
    #
    def get_funnel_list(self):
      return self.mp.request(['funnels/list'], {})
       

    #
    # make api call to get funnel data
    #
    def get_funnel(self, funnel_id, start_date, end_date, group_by="", where_cond=""):
      return self.mp.request(['funnels'], {
        'funnel_id': funnel_id, 'from_date': start_date, 
          'to_date':end_date, 'on': group_by, 'where':where_cond})

    #
    # get funnel  data
    #
    def get_funnel_data(self, funnel_id, start_date, end_date, viz="bar"):
      # get funnel data
      funnel_data = self.get_funnel(funnel_id, start_date, end_date)
      
      # construct an empty funnel object
      funnel = {'funnel_id': funnel_id, 'from_date': start_date, 'to_date':end_date,
                   'data': []}

      if viz == "bar":
        funnel["data"] = self.transform_funnel_data(funnel_data)                
      else:
        funnel["data"] = self.transform_funnel_data(funnel_data, True)
      return funnel

    #
    # get funnel breakdown data
    #
    def get_funnel_breakdown_data(self, funnel_id, start_date, end_date, viz="bar"):
      # get funnel data
      funnel_data = self.get_funnel(funnel_id, start_date, end_date)
      
      # construct an empty funnel object
      funnel = {'funnel_id': funnel_id, 'from_date': start_date, 'to_date':end_date,
                   'data': []}
      if viz == "bar":
        funnel["data"] = self.transform_funnel_breakdown_data(funnel_data)                
      else:
        funnel["data"] = self.transform_funnel_breakdown_data(funnel_data, True)                
      return funnel    

    #
    # get funnel data
    #
    def get_filtered_funnel_data(self, funnel_id, start_date, end_date, group_by="", where_cond="", viz="bar"):
      # get funnel data
      funnel_data = self.get_funnel(funnel_id, start_date, end_date, group_by, where_cond)

      # construct an empty funnel object
      funnel = {'funnel_id': funnel_id, 'from_date': start_date, 'to_date':end_date,
                   'data': []}

      funnel["data"] = self.transform_filtered_funnel_data(funnel_data)
      return funnel

    #
    # get funnel conversion rate
    #
    def get_funnel_conversion_rate_data(self, funnel_id, start_date, end_date, viz="bar"):
      # construct an empty funnel object
      funnel = {'funnel_id': funnel_id, 'from_date': start_date, 'to_date':end_date,
                   'data': []}
      # get funnel data
      funnel_data = self.get_funnel(funnel_id, start_date, end_date)
      
      conversion_data = {}
      for event_date, values in sorted(funnel_data["data"].iteritems(), key=lambda x: x[0]):
        event_date = (calendar.timegm((datetime.strptime(event_date, '%Y-%m-%d')).timetuple())) * 1000
        ana =  values["analysis"]
        if int(ana["starting_amount"]) != 0:
          conversion_data[event_date] = round(int(ana["completion"])/int(ana["starting_amount"]), 3)
        else:
          conversion_data[event_date] = 0
      funnel["data"] = [{"name": "Conversion Rate", "data": sorted(conversion_data.iteritems(), key=lambda x: x[0])}]
      return funnel

    #
    # transform funnel data
    #
    def transform_funnel_data(self, funnel_data, table_view=False):
        # reduce all steps related to funnels grouped by date in one list
        funnel_step_count_by_day = [step for info in funnel_data["data"].values() for step in info["steps"]]
        # now aggregate the list of dictionaries 
        funnel_steps = defaultdict(int)
        for steps in funnel_step_count_by_day:
          funnel_steps[steps['event']] += steps['count']
        
        if not table_view:
          data = defaultdict(list)        
          for category,value in sorted(funnel_steps.iteritems(), key=lambda x: x[1], reverse=True):
            data["categories"].append(category)
            data["series"].append(value)
          return data
        else: # transform data to table
          data = []
          row = OrderedDict()
          row["Funnel"] = "Overall" 
          prev_step_val = None
          for category,value in sorted(funnel_steps.iteritems(), key=lambda x: x[1], reverse=True):
            if prev_step_val is None:
              prev_step_val = value
            row[category] = "%d (%.2f%%)" % (value, (100 * float(value)/float(prev_step_val)))
            prev_step_val = value
          data.append(row)
          return data

         

    #
    # transform funnel breakdown data by step by date
    #
    def transform_funnel_breakdown_data(self, funnel_data, table_view=False):
      #print funnel_data
      #by_step_by_date = defaultdict(list)
      by_step_by_date = OrderedDict()
      categories = []
      for event_date, values in sorted(funnel_data["data"].iteritems(), key=lambda x: x[0]):
        event_date = datetime.strptime(event_date, '%Y-%m-%d').strftime('%b %d')
        #(calendar.timegm((datetime.strptime(event_date, '%Y-%m-%d')).timetuple())) * 1000
        categories.append(event_date)
        for step in values["steps"]:
            series_name = step["event"]
            count = step["count"]
            if series_name in by_step_by_date:
              #by_step_by_date[series_name].append([event_date, count])
              by_step_by_date[series_name].append(count)
            else:
              #by_step_by_date[series_name] = [[event_date, count]]
              by_step_by_date[series_name] = [count] 
        data = {"categories": categories, "series": by_step_by_date}
      if not table_view:
        return data
      else:
        grid_data = []
        for key, value in data["series"].iteritems():
            l = zip(data["categories"], value) # zip date and event count together 
            l.insert(0, ("Event", key))
            grid_row = OrderedDict(l)
            grid_data.append(grid_row)
        return grid_data
        #events_data.append({"name": event_name, "data": sorted(event_data.iteritems(), key=lambda x: x[0])})            

        

    #
    # transform fitler data
    #
    def transform_filtered_funnel_data(self, funnel_data):
        # first bring all events for a property value under one list
        by_prop = defaultdict(list)
        for info in funnel_data["data"].values():
            for prop, items in info.iteritems():
                by_prop[prop].extend(items)

        # now aggregate by property
        for prop, items in by_prop.iteritems():
            by_event = defaultdict(Counter)
            for item in items:
                key = item["event"]
                vals = {"count": item["count"]}
                by_event[key].update(vals)
            by_prop[prop] = OrderedDict(sorted(by_event.items(), key=lambda x: x[1], reverse=True))
        return by_prop

    #
    # get segment data
    #
    def get_segment_data(self, event_name, start_date, end_date, unit, event_type, group_by="", where_cond="", viz="bar"):
      # get funnel data segment_data = 
      request_object = {'event' : event_name,
        'from_date': start_date, 
        'to_date': end_date, 
        'unit': unit, 
        'type': event_type }
      #print request_object
      if group_by:
        request_object["on"] = group_by

      if where_cond:
        request_object["where"] = where_cond
      #print request_object
      segment_data = self.mp.request(['segmentation'], request_object) 
      return self.transform_segment_data(event_name, segment_data)

    #
    # transform segment data
    #

    #
    # transform segment  data
    #
    def transform_segment_data(self, event_name, segment_data, table_view=False, viz="bar"):
      # first bring all events for a property value under one list
      #by_prop = defaultdict(list)
      data = defaultdict(list)
      for prop, items in segment_data["data"]["values"].iteritems():
        data["categories"].append(prop)
        data["series"].append(sum(items.values()))
      return data

    #
    # get retention data
    #
    def get_retention_data(self, born_event, start_date, end_date, unit, interval_count, data_as='number', return_event=None, group_by="", where_cond="", viz="bar"):
      # get funnel data segment_data = 
      request_object = {'born_event' : born_event,
        'from_date': start_date, 
        'to_date': end_date, 
        'unit': unit, 
        'interval_count': interval_count}
      #print request_object
      if return_event:
        request_object["event"] = return_event

      if where_cond:
        request_object["where"] = where_cond
      #print request_object
      retention_data = self.mp.request(['retention'], request_object) 
      return self.transform_retention_data(retention_data, unit, data_as)

    #
    # transform segment  data
    #
    def transform_retention_data(self, retention_data, unit, data_as='number', viz="bar"):
      # first bring all events for a property value under one list
      table_data = []
      for prop, items in retention_data.iteritems():
        data = OrderedDict()
        data[unit] = prop
        data['users'] = items["first"]
        for index, ele in enumerate(items["counts"]):
          if data_as == 'number':
            data["".join([unit, str(index)])] = ele
          else:
            data["".join([unit, str(index)])] = round(ele * 100.0 / items["first"], 1)
        table_data.append(data)
      return table_data

if __name__ == '__main__':
  mp = MPService()
  events = mp.get_event_list()
  end_date = datetime.utcnow()
  end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
  end_date = end_date - timedelta(days = 14)
  start_date = end_date - timedelta(days = 29)
  event_type = "general"
  unit = "week"
  #print mp.get_events_data(events, start_date, end_date, unit, event_type)
  
  # funnels related tests
  funnel_id = 935441
  start_date = "2015-01-10"
  end_date = "2015-04-09"
  #print mp.get_funnel_list()
  #print json.dumps(mp.get_funnel_data(funnel_id, start_date, end_date, "table"))
  #print json.dumps(mp.get_funnel_breakdown_data(funnel_id, start_date, end_date, True))
  #print mp.get_funnel_conversion_rate_data(funnel_id, start_date, end_date, "line")

  #segment related tests
  #group_by = 'properties["$browser"]'
  #where_cond = '"Chrome" in properties["$browser"]'
  #print mp.get_segment_data(events[0], start_date, end_date, unit, event_type, group_by)
  
  # retention related
  born_event = 'request demo page'
  print json.dumps(mp.get_retention_data(born_event, start_date, end_date, unit, 10, 'number'))


'''
response_data = [
        {series_name: collections.OrderedDict(sorted(series_values.items()))} 
        for series_name, series_values in events_data["values"].iteritems()
        ]
response_data = []
for series_name, series_values in events_data["values"].iteritems():
    series_new_values = [
        [(calendar.timegm((datetime.strptime(d, '%Y-%d-%m')).timetuple())) * 1000, v] 
        for d, v in series_values.iteritems()
        ]
    response_data.append({"key": series_name, "values": series_new_values})
    #print calendar.timegm((datetime.strptime(d, '%Y-%d-%m')).timetuple())
print json.dumps(response_data)
'''
