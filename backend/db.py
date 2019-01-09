import datetime;
import traceback;
from pymongo import MongoClient;
from utilities import eprint;

''' 1 - error
    2 - fatal
    3 - info '''

def log(sevirity, message, error = None):
    try:
        client = MongoClient("mongodb://whatsappsync:012C6KdE4Gt7@ds042138.mlab.com:42138/whatsappsync");
        entry = {
                "service": "backend",
                "sevirity": sevirity,
                "message": message,
                "timestamp": datetime.datetime.utcnow()};
        if error:
            entry['error'] = error;

        client.whatsappsync.logs.insert_one(entry);
    except:
        eprint(traceback.format_exc());