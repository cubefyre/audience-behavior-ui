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

import os, logging, json
from collections import defaultdict, Counter, OrderedDict
from datetime import datetime, timedelta
import calendar
import hashlib

import tornado.ioloop
import tornado.web
import tornado.websocket
from tornado.escape import json_encode, json_decode
from tornado.options import define, options, parse_command_line

from user_service import UserService
from env_config import ENV
from analytics_service import MPService

define("port", default=ENV["server"]["port"], help="run on the given port", type=int)

#start the logger
log = logging.getLogger("server")
log.setLevel("DEBUG")

class BaseHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        self.set_header('Access-Control-Allow-Headers', 'x-requested-with')
        self.set_header('Content-type', 'application/json')

#
# User action handler 
#
class UserHandler(tornado.web.RequestHandler):
    
    def options(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        #self.set_header("Access-Control-Allow-Headers", "accept, authorization");
        self.set_status(200)
        self.finish()

    def get(self, action, sub_action, id):
        print self.request

        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        #self.set_header("Access-Control-Allow-Headers", "accept, authorization");
        self.set_header('Content-type', 'application/json')
        print action
        log.debug("UserHandler: action: %s and sub-action: %s and id: %s" % (action, sub_action, id))
        if not action: 
            self.redirect('/')
                
        #initialize response JSON
        response_message = {}
        
        # init user class
        user = UserService()
        
        # what action to take
        if action == "register":
            # Get email        
            user_email = self.get_argument('email', None)
            if not user_email: raise tornado.web.HTTPError(404)        
            log.debug("UserHandler: Registering user %s" % user_email)
            resend_email = self.get_argument('resend', None)
            response_message = user.register_user(user_email, resend_email)
        
        elif action == "signin":
            # Get email        
            user_email = self.get_argument('email', None)
            print user_email
            if not user_email: raise tornado.web.HTTPError(404)        
            log.debug("UserHandler: Signing in user %s" % user_email)
            
            # Get password        
            user_password = self.get_argument('password', "awesome")
            if not user_password: raise tornado.web.HTTPError(404)

            response_message = user.login_user(user_email, user_password)
        
        elif action == "segment":
            user_token = util.decode_jwt_token(self.request.headers.get('Authorization', None))
            
            if sub_action is not None and sub_action == "add" and segment_or_funnel is not None:
                response_message = user.add_segment(user_token["email"], segment_or_funnel)
            elif sub_action is not None and sub_action == "delete" and segment_or_funnel is not None:
                response_message = user.remove_segment(user_token["email"], segment_or_funnel)
            else:
                response_message = user.get_segments(user_token["email"])

        elif action == "funnels":
            user_token = util.decode_jwt_token(self.request.headers.get('Authorization', None))
            response_message = user.get_funnelsget_funnels(user_token["email"])

        # Write Response   
        self.write(json_encode(response_message))

#
# Events Handler
#
class EventsHandler(tornado.web.RequestHandler):

    def initialize(self):
        self.analytics = MPService()

    def get(self, action=None):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
        self.set_header('Content-type', 'application/json')
        
        # request a list of events
        events_list = self.analytics.get_event_list()
        events_list = ['Video Laser 4x', 'Why Laser 4x', 'Easy to Use Video 4x', 'Reviews', '90-day Money Back', 
        'Skin Care', 'Free Shipping', 'Warranty']
        if action is None: #send events litst back
            self.write(json.dumps([{"id": i, "label": event} for i, event in enumerate(events_list, 1)]))
            #self.write(json.dumps([{"id": i, "label": event} for i, event in enumerate(events_list, 1)]))
        
        elif action == "data": # get events data
            default_end_date = datetime.utcnow()
            default_end_date = default_end_date.replace(hour=0, minute=0, second=0, microsecond=0)
            default_start_date = default_end_date - timedelta(days = 29)
            # get query parameters
            start_date = self.get_argument("startDate", None)
            end_date = self.get_argument("endDate", None)
            event_type = self.get_argument("type", "general")
            unit = self.get_argument("unit", "day")
            viz = self.get_argument("viz", "line")
            events = self.get_argument("events", None)

            if start_date is not None:
                start_date = datetime.utcfromtimestamp(int(start_date))
            else:
                start_date = default_start_date
            
            if end_date is not None:
                end_date = datetime.utcfromtimestamp(int(end_date))
            else:
                end_date = default_end_date
            
            if events is not None:
                events = json.loads(events) # transform the event string to python list
            else:
                events = events_list
            # call the service to get events data
            events_data = self.analytics.get_events_data(events, start_date, end_date, 
                    unit, event_type, viz)
            self.write(json.dumps(events_data))


class FunnelHandler(tornado.web.RequestHandler):

    def initialize(self):
        self.analytics = MPService()

    def options(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        #self.set_header("Access-Control-Allow-Headers", "accept, authorization");
        self.set_status(200)
        self.finish()


    def get(self, action=None):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
        self.set_header('Content-type', 'application/json')
        
        if action is None: # Get funnel list
            # funnels = self.analytics.get_funnel_list()
            #self.write(json.dumps([{"id": fn["funnel_id"], "label": fn["name"]} for fn in funnels]))
            funnels = [{"funnel_id": 935439, "label": "Cart Abondened"}, {"funnel_id": 935440, "label": "Video Conversions"}]
            self.write(json.dumps(funnels))
        elif action == "data": # get data on a funnel
            # get query arguments
            start_date = self.get_argument("startDate", None)
            end_date = self.get_argument("endDate", None)
            funnel_id = int(self.get_argument("id", 935439))
            by = self.get_argument("by", "")
            where = self.get_argument("where", "")
            bdv = self.get_argument("bdv", None)
            viz = self.get_argument("viz", "bar")
            conversion_rate=self.get_argument("cr", None)
            # if no filters are present
            funnel_data = None
            if conversion_rate is not None and conversion_rate == "y": # get breakdown view of the funnel
                funnel_data = self.analytics.get_funnel_conversion_rate_data(funnel_id, start_date, end_date, viz)
            elif by:
                funnel_data = self.analytics.get_filtered_funnel_data(funnel_id, start_date, end_date, 
                 by, where, viz)
            elif bdv is not None and bdv == "true": # get breakdown view of the funnel
                funnel_data = self.analytics.get_funnel_breakdown_data(funnel_id, start_date, 
                    end_date, viz)                
            else:
                funnel_data = self.analytics.get_funnel_data(funnel_id, start_date, 
                    end_date, viz)                
            '''
            if bdv is None:
                bdv = False
            else:
                bdv = True if bdv == "true" else False            
            print "%s, %s, %s" %(funnel_id, start_date, end_date)
            '''
            #print funnel_data
            self.write(json.dumps(funnel_data)) #write response back
        elif action == "create":
            events = self.get_argument("events", events)


    #
    # post
    #
    def post(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials". true);
        self.set_header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        query = None
        content_type = self.request.headers.get("Content-Type", "")
        if content_type.startswith("application/json"):            
            arguments = json_decode(self.request.body)
            query = arguments.get("query")
        #print query
        if query == "DB":
            response = self.read_json_file("../app/types.json")
        elif query == "DB where (name = \"Reporting\")":
            response = self.read_json_file("../app/types-1.json")
        else:     
            response =  self.read_json_file("../app/types-10.json")
        
        self.write(response)

    def read_json_file(self, file_path):
        #print file_path
        json_data = open(file_path)
        data = json.load(json_data)
        json_data.close()
        return data

class FilterHandler(tornado.web.RequestHandler):

    def get(self):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header("Access-Control-Allow-Credentials", "true");
        self.set_header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
        self.set_header('Content-type', 'application/json')
        # Get events
        props = [{'dim_id': 0, 'data_type': 'string', 'dim_val': [u'Mobile Safari', u'Chrome', u'Safari', u'Internet Explorer', u'Firefox', u'Mozilla', u'Chrome iOS', u'Android Mobile', u'Opera', u'Opera Mini'], 'dim_name': '$browser', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Browser', 'is_range': False}, {'dim_id': 1, 'data_type': 'string', 'dim_val': [u'iPhone', u'Android', u'iPad', u'Windows Phone'], 'dim_name': '$device', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Device', 'is_range': False}, {'dim_id': 2, 'data_type': 'string', 'dim_val': [u'iOS', u'Mac OS X', u'Windows', u'Android', u'Linux', u'Windows Mobile'], 'dim_name': '$os', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Os', 'is_range': False}, {'dim_id': 3, 'data_type': 'integer', 'dim_val': [568, 900, 1301, 932, 1600, 1154, 640, 0, 800, 667, 1024, 1200, 768, 1080, 982, 1680, 720, 1280, 736, 480, 1440, 1050, 864, 947, 600, 1920, 698, 855, 818, 960, 592, 975, 4000, 700, 894, 534, 384, 840, 1812, 797, 360, 1125, 1008, 2560, 985, 955, 1152, 606, 638, 1000, 783, 831, 810, 1350, 857, 371, 1138, 785, 853, 1137, 829, 1140, 854, 850, 871, 648, 1143, 533, 732, 2160, 1800, 645, 976, 819, 582], 'dim_name': '$screen_height', 'dim_operators': [{'op_label': 'in between', 'op_value': '=='}, {'op_label': 'less than', 'op_value': '<'}, {'op_label': 'equal to', 'op_value': '=='}, {'op_label': 'greater than', 'op_value': '>'}], 'dim_label': 'Screen_Height', 'is_range': False}, {'dim_id': 4, 'data_type': 'integer', 'dim_val': [320, 1440, 2313, 1657, 2560, 2051, 360, 1600, 0, 1280, 375, 768, 1920, 1366, 1745, 1050, 720, 414, 1024, 1360, 1680, 1536, 1684, 640, 1200, 1242, 1437, 1455, 1219, 1120, 1117, 1080, 800, 1152, 600, 1344, 1350, 721, 1417, 1229, 598, 2000, 1613, 1067, 1527, 2048, 1081, 364, 383, 1400, 1391, 384, 900, 1477, 1441, 2400, 1524, 300, 3360, 1422, 1257, 1518, 2021, 1474, 1824, 480, 1548, 1429, 412, 3840, 2880, 1146, 350, 2133], 'dim_name': '$screen_width', 'dim_operators': [{'op_label': 'in between', 'op_value': '=='}, {'op_label': 'less than', 'op_value': '<'}, {'op_label': 'equal to', 'op_value': '=='}, {'op_label': 'greater than', 'op_value': '>'}], 'dim_label': 'Screen_Width', 'is_range': False}, {'dim_id': 5, 'data_type': 'string', 'dim_val': [u'US', u'CN', u'IN', u'HK', u'CA', u'JP', u'GB', u'IE', u'EC', u'KR', u'PH', u'CZ', u'DE', u'BR', u'PT', u'IT', u'TH', u'SE', u'IL', u'RO', u'ES', u'SG', u'PS', u'MX', u'NL', u'EG', u'CL', u'AU', u'CO', u'TN', u'UY', u'DK', u'MY', u'FR', u'PA', u'FI', u'PL', u'RE', u'AR', u'RU', u'GT', u'ID', u'ZA', u'SK', u'TT', u'MK', u'NO', u'CH', u'JM', u'PE', u'BH', u'SA', u'GR', u'TW', u'SV', u'MA', u'HU', u'RS', u'LK', u'AL', u'QA', u'UA', u'BE', u'DZ', u'BG', u'AZ', u'HR', u'BY', u'AP', u'AO', u'MM', u'PK', u'EU', u'KE', u'BB', u'AE', u'SI', u'EE', u'CR', u'DO', u'KY', u'VN', u'FO', u'IR', u'TR', u'PR', u'TL', u'VE', u'GE'], 'dim_name': 'mp_country_code', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Mp_Country_Code', 'is_range': False}, {'dim_id': 6, 'data_type': 'string', 'dim_val': [u'google', u'bing', u'duckduckgo', u'yahoo'], 'dim_name': '$search_engine', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Search_Engine', 'is_range': False}, {'dim_id': 7, 'data_type': 'string', 'dim_val': [u'www.graphsql.com', u'www.google.com', u'm.baidu.com', u'www.baidu.com', u'www.linkedin.com', u'www.google.com.hk', u'www.bing.com', u'www.google.ca', u'www.crunchbase.com', u'www.milliwaysventures.com', u'www.google.co.jp', u'www.google.co.uk', u'semalt.semalt.com', u'www.google.co.kr', u'www.google.co.in', u'www.google.cz', u'www.google.de', u'www.google.co.th', u'buttons-for-website.com', u'sharebutton.net', u'cn.bing.com', u'graphsql.net', u'duckduckgo.com', u'www.google.es', u'www.google.com.ph', u'www.zoominfo.com', u'search.yahoo.com', u'www.google.ps', u'www.google.nl', u'strataconf.com', u'www.google.cl', u'www.google.com.au', u'www.google.dk', u'nortonsafe.search.ask.com', u'www.google.com.my', u'www.google.fr', u'www.strikingly.com', u'www.google.fi', u'www.it-farm.com', u'venturebeat.com', u'r.search.yahoo.com', u'www.so.com', u'www.facebook.com', u'www.google.se', u'www.sogou.com', u'www.google.ie', u'www.jisu8.cn', u'www.google.hn', u'danhuacap.com', u'www.google.pl', u'www.google.sk', u'www.tasteidea.com', u'www.google.pt', u'www.google.tt', u'www.google.no', u'www.google.co.il', u'l.facebook.com', u'make-money-online.7makemoneyonline.com', u'translate.google.com.hk', u'translate.googleusercontent.com', u'investing.businessweek.com', u'www.google.com.bh', u'www.google.com.pk', u'ame.lvh.me', u'global.bing.com', u'www.google.it', u'www.google.com.tw', u'fanyi.baidu.com', u'translate.baiducontent.com', u'www.google.lk', u'search.yahoo.co.jp', u'www.google.com.sg', u'www.google.be', u'graph006:9009', u'schreifels.github.io', u'www.google.com.br', u'www.cuda.io', u'www.google.hu', u'www.searchlock.com', u'www.google.com.bd', u'awk.so', u'www.moradoventures.com', u'www.cs.kent.edu', u'www.google.ch', u'www.gdcchina.cn', u'www.google.ru', u'subscriber.zoominfo.com', u'www.google.co.za', u'anticrawler.org', u'translate.google.com', u'www.weburlopener.com', u'www.google.com.ua', u'www.google.com.mx', u'www.google.rs', u'www.google.si', u'search.aol.com', u'www.google.com.sv', u'www.google.com.do', u'www.gfsoso.com', u'www.google.gr', u'ec2-54-250-200-50.ap-northeast-1.compute.amazonaws.com', u'www.haosou.com', u'www.google.com.vn', u'54.215.245.192', u'www.google.ro', u'www.google.ge'], 'dim_name': '$referring_domain', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Referring_Domain', 'is_range': False}, {'dim_id': 8, 'data_type': 'string', 'dim_val': [u'Beijing', u'California', u'Henan', u'Guangdong', u'Ohio', u'Karnataka', u'New Jersey', u'Illinois', u'Ontario', u'London, City of', u'Maryland', u'Dublin', u'New York', u'Manila', u'New Hampshire', u'Tamil Nadu', u'Texas', u'Haryana', u'Tianjin', u'Hlavni mesto Praha', u'Baden-Wurttemberg', u'Sao Paulo', u'Jiangsu', u'Washington', u'Florida', u'Massachusetts', u'Havering', u'Aveiro', u'Lazio', u'Wisconsin', u'Bahia', u'Assam', u'Phuket', u'Delhi', u'Rio de Janeiro', u'Zhejiang', u'Rio Grande do Sul', u'Stockholms Lan', u'Minas Gerais', u'Hawaii', u'Pichincha', u'Shanghai', u'Tennessee', u'Tel Aviv', u'Cluj', u'Pais Vasco', u'Laguna', u'Virginia', u'Missouri', u'Distrito Federal', u'Aberdeen City', u'British Columbia', u'Idaho', u'Utah', u'Benguet', u'Noord-Brabant', u'Colorado', u'Region Metropolitana', u'Victoria', u'Antioquia', u'Wiltshire', u'Quebec', u'Tokyo', u'Georgia', u'Hessen', u'Zuid-Holland', u'Minnesota', u'Montevideo', u'Hunan', u'Hovedstaden', u'Goias', u'Kuala Lumpur', u'Languedoc-Roussillon', u'Nordrhein-Westfalen', u'Leicestershire', u'Panama', u'Pernambuco', u'Arizona', u'Western Finland', u'Lombardia', u'Maharashtra', u'Mazowieckie', u'Goa', u'Cambridgeshire', u'Campania', u'Mato Grosso', u'Kentucky', u'Noord-Holland', u'Haute-Normandie', u'Malopolskie', u'Norfolk', u'Santa Catarina', u'Pennsylvania', u'Birmingham', u'Ile-de-France', u'Iowa', u'Liguria', u'Hebei', u'Anhui', u'Moscow City', u'Jakarta Raya', u'Alaska', u'Liaoning', u'Krung Thep', u'Berlin', u'Shaanxi', u'Toscana', u'Connecticut', u'Morelos', u'Mississippi', u'Hampshire', u'Parana', u'Selangor', u'Lubelskie', u'Western Australia', u'Western Cape', u'Bratislava', u'Andhra Pradesh', u'Louisiana', u'Porto', u'Arkansas', u'Alabama', u'Pampanga', u'Karpos', u'Rogaland', u'Guangxi', u'Trentino-Alto Adige', u'Rhone-Alpes', u'Paraiba', u'Kent', u'Rondonia', u'Ealing', u'Santander', u'Madhya Pradesh', u'North Carolina', u'Groningen', u'Hounslow', u'Vaud', u'Saint Andrew', u'Lima', u'Michigan', u'Al Manamah', u'Ar Riyad', u'Catalonia', u'Oklahoma', u'Chiapas', u'Sicilia', u"T'ai-pei", u"Ryazan'", u'Rio Grande do Norte', u'San Salvador', u'Kyongsang-bukto', u'West Bengal', u'Oregon', u'Szeged', u'Entre Rios', u'Rhondda Cynon Taff', u'Vastra Gotaland', u'Puglia', u'Western', u'Amazonas', u'Mexico', u'Kanagawa', u'Denbighshire', u'Shkoder', u'Basilicata', u'Mato Grosso do Sul', u'Delaware', u'Buenos Aires', u'Albay', u'Auvergne', u'Kyyiv', u'Andalucia', u'Piemonte', u'Omsk', u'Bern', u'Brussels Hoofdstedelijk Gewest', u'Batna', u'Rabat-Sale-Zemmour-Zaer', u'Braga', u'Alberta', u'Reading', u'Lorraine', u'Pomorskie', u'Marche', u'South Carolina', u'Michoacan de Ocampo', u'Fujian', u'Queretaro de Arteaga', u'Tocantins', u'Saitama', u'Espirito Santo', u'Montana', u'Nevada', u'Ceara', u'Telford and Wrekin', u'General Santos', u'Chiba', u'Indiana', u'Lisboa', u'Kansas', u'Kronobergs Lan', u'Islamabad', u'Jawa Barat', u'Bayern', u'Oost-Vlaanderen', u'Rajasthan', u'Jalisco', u'Niedersachsen', u'Setubal', u"Seoul-t'ukpyolsi", u'Distrito Especial', u'Levkas', u'Veneto', u'Melaka', u'Nairobi Area', u'KwaZulu-Natal', u'Sindh', u'Edinburgh, City of', u'Saint George', u'Bradford', u'Bucuresti', u'Para', u'New South Wales', u'Pays de la Loire', u'Cordoba', u'La Libertad', u'Grad Zagreb', u'Vila Real', u'Nusa Tenggara Barat', u'Punjab', u'Negeri Sembilan', u'Midtjylland', u'Veracruz-Llave', u'Abruzzi', u'Brandenburg', u'Cardiff', u'Ljubljana Urban Commune', u'Vrancea', u'Herefordshire', u'Cebu City', u'Glasgow City', u'Laanemaa', u'Caroni', u'Newfoundland', u'San Jose', u'Prince Edward Island', u'Vasterbottens Lan', u'Redbridge', u'Emilia-Romagna', u'Pahang', u'Bristol, City of', u'Wielkopolskie', u'Dolnoslaskie', u'Croydon', u'Gujarat', u'Kujawsko-Pomorskie', u'Distrito Nacional', u'Slaskie', u'Hubei', u'Luzern', u'Wokingham', u'Veszprem', u'HaMerkaz', u'Kosice', u'Cheshire', u'Calderdale', u'Attiki', u'Oslo', u'Nueva Ecija', u'Asturias', u'Ha Noi', u'Quezon City', u'Novosibirsk', u'Tehran', u'Gauteng', u'Canarias', u'Stockport', u'Istanbul', u'Dili', u'West Sussex', u'District of Columbia', u'Northamptonshire', u'St. Helens', u'Novo mesto Urban Commune', u'Faro', u'Bretagne', u'Hertford', u'Southern Finland', u'York', u'Aquitaine', u'Ticino', u'Luton', u'Salaj', u'Shandong'], 'dim_name': '$region', 'dim_operators': [{'op_label': 'equals', 'op_value': '=='}, {'op_label': 'does not equal', 'op_value': '!='}, {'op_label': 'contains', 'op_value': 'in'}, {'op_label': 'does not contain', 'op_value': 'not in'}], 'dim_label': 'Region', 'is_range': False}]
        self.write(json.dumps(props))

class SegmentationHandler(tornado.web.RequestHandler):

    def initialize(self):
        self.analytics = MPService()

    def get(self, action=None):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
        self.set_header('Content-type', 'application/json')
        #print action
        if action is None: #send saved segments list back
            self.write(json.dumps({"id": 1, "label": "first segment"}))
        elif action == "data": # get segments data
            start_date = self.get_argument("startDate", None)
            end_date = self.get_argument("endDate", None)
            unit = self.get_argument("unit", "day")
            event_type = self.get_argument("type", "general")
            event = self.get_argument("event", 'company page')
            by = self.get_argument("by", "")
            where = self.get_argument("where", "")
            viz = self.get_argument("viz", "bar")
            # call the service to get  data
            segments_data = self.analytics.get_segment_data(event, start_date, end_date, 
                        unit, event_type, by, where, viz)
            #print segments_data
            self.write(json.dumps(segments_data))

class RetentionHandler(tornado.web.RequestHandler):

    def initialize(self):
        self.analytics = MPService()

    def get(self, action=None):
        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.set_header('Access-Control-Max-Age', 1000)
        self.set_header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept')
        self.set_header('Content-type', 'application/json')
        #print action
        if action is None: #send saved retentions list back
            self.write(json.dumps({"id": 1, "label": "first segment"}))
        elif action == "data": # get retention data
            start_date = self.get_argument("startDate", None)
            end_date = self.get_argument("endDate", None)
            unit = self.get_argument("unit", "day")
            return_event = self.get_argument("returnEvent", "any event")
            born_event = self.get_argument("bornEvent", 'request demo page')
            interval_count = self.get_argument("intervalCount", 10)
            data_as = self.get_argument("dataAs", 'number')
            by = self.get_argument("by", "")
            where = self.get_argument("where", "")
            viz = self.get_argument("viz", "bar")
            # call the service to get  data
            if return_event == 'any event':
                return_event = None
            retention_data = self.analytics.get_retention_data(born_event, start_date, end_date, 
                        unit, int(interval_count), data_as, return_event, by, where, viz)
            #print segments_data
            self.write(json.dumps(retention_data))



# suggests that perivous segment is optional.
app = tornado.web.Application([
    #(r'/type/?([^/]+)?/?([^/]+)?/?([^/]+)?/?([^/]+)?/?([^/]+)?', TypeSystemHandler), 
    (r'/user/?([^/]+)?/?([^/]+)?/?([^/]+)?', UserHandler), 
    (r'/filters/', FilterHandler), 
    (r'/events/?([^/]+)?', EventsHandler), 
    (r'/funnels/?([^/]+)?', FunnelHandler), 
    (r'/segmentation/?([^/]+)?', SegmentationHandler), 
    (r'/retention/?([^/]+)?', RetentionHandler), 
    #(r'/gs(?:/([a-zA-Z0-9_-]*))?(?:/([^/]*))?(?:/([^/]*))?', GraphStoreHandler, dict(gs_db=GraphStoreDBService())), #/graphstore/gs_id/action/query or preview
])

if __name__ == '__main__':
    #log.debug("Starting server on port %s ..." % options.port)
    app.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
