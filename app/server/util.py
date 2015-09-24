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

import hashlib, random, jwt
from env_config import ENV

# JSON Web Token SALT
salt = ENV["SALT"]

# encode
def decode_jwt_token(token):
	return jwt.decode(token, salt)

# Genereate JWT Token
def encode_jwt_token(user):
	return jwt.encode(user, salt)

# generate_key
def generate_key():
	return hashlib.sha224( str(random.getrandbits(256)) ).hexdigest().upper()

#
# limit string
#
def limit_to(s, l=80):
	return s if len(s)<=l else s[0:l-3]+'...'