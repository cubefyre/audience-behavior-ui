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

import json, calendar
from datetime import datetime, timedelta
from collections import defaultdict, Counter, OrderedDict
from itertools import groupby

end_date = datetime.utcnow()
end_date = end_date.replace(hour=0, minute=0, second=0, microsecond=0)
start_date = end_date - timedelta(days = 29)

current_dt = datetime.utcnow()
current_dt = current_dt.replace(hour=0, minute=0, second=0, microsecond=0)
current_week_start_dt = current_dt - timedelta(days = current_dt.weekday())
current_week_end_dt = current_week_start_dt + timedelta(days = 6)

print "today: %s, bow: %s, eow: %s" %(current_dt.isoformat('T'), 
        current_week_start_dt.isoformat('T'), current_week_end_dt.isoformat('T'))


#last week's friday:
#friday = day - timedelta(days=day.weekday()) + timedelta(days=4, weeks=-1)
#Explanation: timedelta(days=day.weekday()) is the offset between monday and day so adding 4 days and subtracting one week will get you last week's friday.

no_weeks = 14
for w in reversed(xrange(no_weeks+1)):
    week_start_dt = current_week_start_dt - timedelta(weeks=w)
    week_end_dt = week_start_dt + timedelta(days = 6)
    print "%s week ago - bow is: %s, eow is: %s" %(w, 
            week_start_dt.isoformat('T'), week_end_dt.isoformat('T'))


response = {
    u'meta': {
        u'dates': [
            u'2015-02-17',
            u'2015-02-18',
            u'2015-02-19',
            u'2015-02-20',
            u'2015-02-21'
        ]
    },
    u'data': {
        u'2015-02-20': {
            u'steps': [
                {
                    u'count': 40,
                    u'avg_time': None,
                    u'goal': u'landingpage',
                    u'overall_conv_ratio': 1,
                    u'step_conv_ratio': 1,
                    u'event': u'landingpage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'requestdemopage',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0.0,
                    u'event': u'requestdemopage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'thankyou',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0,
                    u'event': u'thankyou'
                }
            ],
            u'analysis': {
                u'completion': 0,
                u'starting_amount': 40,
                u'steps': 3,
                u'worst': 1
            }
        },
        u'2015-02-21': {
            u'steps': [
                {
                    u'count': 27,
                    u'avg_time': None,
                    u'goal': u'landingpage',
                    u'overall_conv_ratio': 1,
                    u'step_conv_ratio': 1,
                    u'event': u'landingpage'
                },
                {
                    u'count': 1,
                    u'avg_time': 378,
                    u'goal': u'requestdemopage',
                    u'overall_conv_ratio': 0.037037037037037035,
                    u'step_conv_ratio': 0.037037037037037035,
                    u'event': u'requestdemopage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'thankyou',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0.0,
                    u'event': u'thankyou'
                }
            ],
            u'analysis': {
                u'completion': 0,
                u'starting_amount': 27,
                u'steps': 3,
                u'worst': 2
            }
        },
        u'2015-02-17': {
            u'steps': [
                {
                    u'count': 30,
                    u'avg_time': None,
                    u'goal': u'landingpage',
                    u'overall_conv_ratio': 1,
                    u'step_conv_ratio': 1,
                    u'event': u'landingpage'
                },
                {
                    u'count': 2,
                    u'avg_time': 31,
                    u'goal': u'requestdemopage',
                    u'overall_conv_ratio': 0.06666666666666667,
                    u'step_conv_ratio': 0.06666666666666667,
                    u'event': u'requestdemopage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'thankyou',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0.0,
                    u'event': u'thankyou'
                }
            ],
            u'analysis': {
                u'completion': 0,
                u'starting_amount': 30,
                u'steps': 3,
                u'worst': 2
            }
        },
        u'2015-02-19': {
            u'steps': [
                {
                    u'count': 44,
                    u'avg_time': None,
                    u'goal': u'landingpage',
                    u'overall_conv_ratio': 1,
                    u'step_conv_ratio': 1,
                    u'event': u'landingpage'
                },
                {
                    u'count': 1,
                    u'avg_time': 2722,
                    u'goal': u'requestdemopage',
                    u'overall_conv_ratio': 0.022727272727272728,
                    u'step_conv_ratio': 0.022727272727272728,
                    u'event': u'requestdemopage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'thankyou',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0.0,
                    u'event': u'thankyou'
                }
            ],
            u'analysis': {
                u'completion': 0,
                u'starting_amount': 44,
                u'steps': 3,
                u'worst': 2
            }
        },
        u'2015-02-18': {
            u'steps': [
                {
                    u'count': 38,
                    u'avg_time': None,
                    u'goal': u'landingpage',
                    u'overall_conv_ratio': 1,
                    u'step_conv_ratio': 1,
                    u'event': u'landingpage'
                },
                {
                    u'count': 1,
                    u'avg_time': 44,
                    u'goal': u'requestdemopage',
                    u'overall_conv_ratio': 0.02631578947368421,
                    u'step_conv_ratio': 0.02631578947368421,
                    u'event': u'requestdemopage'
                },
                {
                    u'count': 0,
                    u'avg_time': None,
                    u'goal': u'thankyou',
                    u'overall_conv_ratio': 0.0,
                    u'step_conv_ratio': 0.0,
                    u'event': u'thankyou'
                }
            ],
            u'analysis': {
                u'completion': 0,
                u'starting_amount': 38,
                u'steps': 3,
                u'worst': 2
            }
        }
    }
}
'''
by_steps = defaultdict(list)
for event_date, values in response["data"].iteritems():
    event_date = (calendar.timegm((datetime.strptime(event_date, '%Y-%m-%d')).timetuple())) * 1000
    for step in values["steps"]:
        series_name = step["event"]
        count = step["count"]
        by_steps[series_name].append([event_date, count])

print by_steps

'''

'''
by_steps = defaultdict(list)
for info in response["data"].values():
	for prop, items in info.iteritems():
		by_steps[prop].extend(items)
#print by_steps

# now aggregate by property
for items in by_steps.values():
	by_event = defaultdict(Counter)
	for item in items:
		print item
		key = item["event"]
		print key
		vals = {"count": item["count"]}
		print vals
		by_event[key].update(vals)
#print json.dumps(by_event)
'''


'''
# if condtiions filters out analysis dictionary from the steps
#funnel_step_count_by_day = [step for info in dato["data"].values() for steps in info.values() for step in steps if isinstance(steps, list)]

# reduce all steps related to funnels grouped by date in one list
funnel_step_count_by_day = [step for info in dato["data"].values() for step in info["steps"]]

# now aggregate the list 
funnel_steps = defaultdict(int)
for steps in funnel_step_count_by_day:
    funnel_steps[steps['event']] += steps['count']
print json.dumps(sorted(funnel_steps.iteritems(), key=lambda x: x[1], reverse=True))
funnel_steps = OrderedDict(sorted(funnel_steps.iteritems(), key=lambda x: x[1], reverse=True))
print json.dumps(funnel_steps)
'''


'''
# group by example

g = groupby(funnel_step_count_by_day, lambda x: x.pop("event"))
print g

funnel = {}
for event, event_data in g:
	c = Counter()
	for row in event_data: c.update(row)
	funnel[event] = c  # if you want a dict rather than Counter, return dict(c) here
print funnel
'''

'''
di = {u'meta': {u'property_values': [u'Chrome', u'Safari', u'Mobile Safari', u'Internet Explorer', u'Firefox', u'Mozilla', u'Android Mobile']}, u'data': {u'2015-02-20': {u'Android Mobile': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Firefox': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 40, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'request demo page', u'overall_conv_ratio': 0.0}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}], u'Chrome': [{u'count': 30, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Mobile Safari': [{u'count': 3, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 4, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}]}, u'2015-02-21': {u'Mobile Safari': [{u'count': 4, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Firefox': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 27, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 1, u'avg_time': None, u'step_conv_ratio': 0.037037037037037035, u'event': u'request demo page', u'overall_conv_ratio': 0.037037037037037035}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}], u'Chrome': [{u'count': 18, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 378, u'goal': u'request demo page', u'overall_conv_ratio': 0.05555555555555555, u'step_conv_ratio': 0.05555555555555555, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Mozilla': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Internet Explorer': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}]}, u'2015-02-22': {u'Chrome': [{u'count': 15, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 1485, u'goal': u'request demo page', u'overall_conv_ratio': 0.06666666666666667, u'step_conv_ratio': 0.06666666666666667, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Internet Explorer': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 424, u'goal': u'request demo page', u'overall_conv_ratio': 0.5, u'step_conv_ratio': 0.5, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Mobile Safari': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 3, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 22, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 2, u'avg_time': None, u'step_conv_ratio': 0.09090909090909091, u'event': u'request demo page', u'overall_conv_ratio': 0.09090909090909091}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}]}, u'2015-02-23': {u'Chrome': [{u'count': 28, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Internet Explorer': [{u'count': 5, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Mobile Safari': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 4, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 33, u'goal': u'request demo page', u'overall_conv_ratio': 0.25, u'step_conv_ratio': 0.25, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'$overall': [{u'count': 39, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 1, u'avg_time': None, u'step_conv_ratio': 0.02564102564102564, u'event': u'request demo page', u'overall_conv_ratio': 0.02564102564102564}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}]}, u'2015-02-19': {u'Chrome': [{u'count': 39, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 2722, u'goal': u'request demo page', u'overall_conv_ratio': 0.02564102564102564, u'step_conv_ratio': 0.02564102564102564, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Firefox': [{u'count': 3, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 44, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 1, u'avg_time': None, u'step_conv_ratio': 0.022727272727272728, u'event': u'request demo page', u'overall_conv_ratio': 0.022727272727272728}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}]}, u'2015-02-18': {u'Firefox': [{u'count': 4, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 38, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 1, u'avg_time': None, u'step_conv_ratio': 0.02631578947368421, u'event': u'request demo page', u'overall_conv_ratio': 0.02631578947368421}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}], u'Chrome': [{u'count': 30, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 44, u'goal': u'request demo page', u'overall_conv_ratio': 0.03333333333333333, u'step_conv_ratio': 0.03333333333333333, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Mobile Safari': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Safari': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Internet Explorer': [{u'count': 2, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}]}, u'2015-02-17': {u'Chrome': [{u'count': 20, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 17, u'goal': u'request demo page', u'overall_conv_ratio': 0.05, u'step_conv_ratio': 0.05, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Mobile Safari': [{u'count': 5, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 1, u'avg_time': 45, u'goal': u'request demo page', u'overall_conv_ratio': 0.2, u'step_conv_ratio': 0.2, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'thankyou'}], u'Safari': [{u'count': 5, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 30, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 2, u'avg_time': None, u'step_conv_ratio': 0.06666666666666667, u'event': u'request demo page', u'overall_conv_ratio': 0.06666666666666667}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}]}, u'2015-02-24': {u'Chrome': [{u'count': 5, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Internet Explorer': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'Mozilla': [{u'count': 1, u'avg_time': None, u'goal': u'landing page', u'overall_conv_ratio': 1, u'step_conv_ratio': 1, u'event': u'landing page'}, {u'count': 0, u'avg_time': None, u'goal': u'request demo page', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0.0, u'event': u'request demo page'}, {u'count': 0, u'avg_time': None, u'goal': u'thankyou', u'overall_conv_ratio': 0.0, u'step_conv_ratio': 0, u'event': u'thankyou'}], u'$overall': [{u'count': 7, u'avg_time': None, u'step_conv_ratio': 1, u'event': u'landing page', u'overall_conv_ratio': 1}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0.0, u'event': u'request demo page', u'overall_conv_ratio': 0.0}, {u'count': 0, u'avg_time': None, u'step_conv_ratio': 0, u'event': u'thankyou', u'overall_conv_ratio': 0.0}]}}}
# first bring all events for a property value under one list
by_prop = defaultdict(list)
for info in di["data"].values():
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
print json.dumps(by_prop)


# try to do it together - it works excpet the sorting goes out of the window.

by_prop = defaultdict(Counter)
for info in di["data"].values():
	for prop, items in info.iteritems():
		by_event = defaultdict(Counter)
		for item in items:
			k = item["event"]
			v = {"count":item["count"]}
		   	by_event[k].update(v)	
		by_prop[prop].update(by_event)

#print json.dumps(by_prop)
#by[prop] = OrderedDict(sorted(by_prop.items(), key=lambda x: x[1], reverse=True))
'''


'''
for prop, items in by.iteritems():
	by_prop = defaultdict(Counter)
	for item in items:
	    key = item["event"]
	    vals = {"count": item["count"]}
	    by_prop[key].update(vals)
	by[prop] = OrderedDict(sorted(by_prop.items(), key=lambda x: x[1], reverse=True))
print by
'''


'''
l.extend(vi['Chrome'])

print l

dic = defaultdict(Counter)
for item in l:
    key = item["event"]
    vals = {"count": item["count"]}		#{k:item[k]for k in ["count"]}
    dic[key].update(vals)
print dic
'''